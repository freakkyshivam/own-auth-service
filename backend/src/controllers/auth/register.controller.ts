import { response, type Request, type Response } from "express";
import argon2 from "argon2";
import { and, eq, ne } from "drizzle-orm";

import db from "../../db/db.js";
import Users from "../../db/schema/users.schema.js";
 

import {
  signupValidation,
  
  otpVerificationForRegister,
  
} from "../../validation/validation.js";

import { getRedis } from "../../config/redis.js";
 
const redis = await getRedis();

import { findUserByEmail } from "../../services/user/user.service.js";
 
import { storeOtpInRedis, verifyOtpFromRedis } from "../../services/otp/otp.service.js";

import crypto from "node:crypto";
 import { cookieOptions } from "../../utils/cookiesAption.js";
import { enqueueMail } from "../../queues/mail.queue.js";


export const register = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[REGISTER] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const validationResult = await signupValidation.safeParseAsync(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please enter valid details",
          error: validationResult.error,
        });
    }

    const { name, email, password } = validationResult.data;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Name , email and password are required",
        });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          msg: `User with this email ${email} already registered`,
        });
    }

    const otp = await storeOtpInRedis({
      identifier: email,
      purpose: "ACCOUNT_VERIFY",
    });


    const hashedPassword = await argon2.hash(password);

    await redis.set(
      `pending-user:${email}`,
      JSON.stringify({ name, email, hashedPassword }),
      { EX: 600 }
    );

     await enqueueMail("ACCOUNT_VERIFY", {
        name,
        email,
        otp,
});


    return res.status(200).json({
      success: true,
      msg: "OTP sent. Please verify to complete registration.",
    });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const verifyRegisterOtp = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[VERIFY REGISTER OTP] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const validationResult = otpVerificationForRegister.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ success: false });
    }

    const { email, otp } = validationResult.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already verified",
      });
    }

    const pending = await redis.get(`pending-user:${email}`);
    if (!pending) {
      return res.status(400).json({ msg: "Registration expired" });
    }

    const { name, hashedPassword } = JSON.parse(pending);

    const result = await verifyOtpFromRedis({
      identifier: email,
      purpose: "ACCOUNT_VERIFY",
      otp,
    });

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        msg: result.reason,
      });
    }

    await redis.del(`pending-user:${email}`);

    const [user] = await db
      .insert(Users)
      .values({
        name,
        email,
        password: hashedPassword,
        isAccountVerified: true,
        lastLoginAt: new Date(),
      })
      .returning();

      await enqueueMail("WELCOME",{
       name,
        email,
      })
    return res.status(201).json({
      success: true,
      msg: "Registration successfull",
      user
    });
  } catch (err: any) {
    return res.status(500).json({ success: false });
  }
};