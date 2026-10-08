import { response, type Request, type Response } from "express";
import argon2 from "argon2";
import { and, eq, ne, sql } from "drizzle-orm";

import db from "../../db/db.js";
import Users from "../../db/schema/users.schema.js";
import { UserSessions } from "../../db/schema/user_sessions.schema.js";

import { loginValidation } from "../../validation/validation.js";

import { findUserByEmail } from "../../services/user/user.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";

import crypto from "node:crypto";
import { cookieOptions } from "../../utils/cookiesAption.js";
import jwt from "jsonwebtoken";
import authenticator from "../../config/otplib.js";
import { encryptSecret, decryptSecret } from "../../utils/crypto.util.js";
import backupCodesTable from "../../db/schema/user_2fa_backupcode.scema.js";

export const login = async (req: Request, res: Response) => {
  try {
    const validationResult = await loginValidation.safeParseAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        msg: "Please enter valid details",
        error: validationResult.error,
      });
    }

    const { email, password } = validationResult.data;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Name , email and password are required",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        msg: `User with this email ${email} is not exists in database`,
      });
    }

    const isValid = await argon2.verify(existingUser.password, password);

    if (!isValid) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }

    if (existingUser.is2fa) {
      const tempToken = jwt.sign(
        {
          id: existingUser?.id,
          email: existingUser.email,
          is2fa: existingUser.is2fa,
          purpose: "2fa",
        },
        process.env.JWT_TEMP_TOKEN_SECRET!,
        {
          expiresIn: "5m",
        }
      );
      return res.status(200).json({
        success: true,
        msg: "Enter OTP from authenticator app",
        twoFactorEnabled: true,
        tempToken,
      });
    }

    const sessionId = crypto.randomUUID();

    const accessToken = await generateAccessToken(
      existingUser.id,
      existingUser.email,
      existingUser.is2fa,
      sessionId
    );

    const refreshToken = generateRefreshToken();

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    res
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 5 * 60 * 1000,
      })

      .cookie("sid", sessionId, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        msg: "User login successfully",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          isAccountVerified: existingUser.isAccountVerified,
          isTwoFactorEnabled: existingUser.is2fa,
        },
        accessToken,
      });

    queueMicrotask(async () => {
      const device = req.deviceInfo;

      await db.insert(UserSessions).values({
        id: sessionId,
        userId: existingUser.id,
        refreshToken: hashedRefreshToken,
        isActive: true,

        deviceName: req.deviceInfo?.deviceName ?? null,
        deviceType: req.deviceInfo?.deviceType ?? null,
        os: req.deviceInfo?.os ?? null,
        browser: req.deviceInfo?.browser ?? null,
        ipAddress: req.deviceInfo?.ipAddress ?? null,
      });

      await db
        .update(Users)
        .set({
          lastLoginAt: new Date(),
        })
        .where(eq(Users.email, email));
    });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res
      .status(500)
      .json({
        success: false,
        msg:
          process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : error.message,
      });
  }
};

export const verify2faLogin = async (req: Request, res: Response) => {
  try {
    const { code, type } = req.body;

    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const existingUser = await findUserByEmail(user.email);

    if (!existingUser?.twoFactorSecret || !existingUser?.twoFactorNonce) {
      return res.status(400).json({
        success: false,
        msg: "2FA is misconfigured on this account",
      });
    }

    const secret = decryptSecret(
      existingUser?.twoFactorSecret,
      existingUser?.twoFactorNonce
    );
    if (!secret) {
      return res.status(400).json({
        success: false,
        msg: "Two factor authentication secret not found",
      });
    }

    if (type === "OTP") {
      const isValid = authenticator.verify({
        token: code,
        secret,
      });
      if (!isValid) {
        return res.status(400).json({
          success: false,
          msg: "Wrong OTP",
        });
      }
    } else {
      let isValid = false;
      const backupCodes = await db
        .select({ hashCode: backupCodesTable.hashCode })
        .from(backupCodesTable)
        .where(
          and(
            eq(backupCodesTable.userId, user.id),
            eq(backupCodesTable.used, false)
          )
        );

      for (const bc of backupCodes) {
        if (await argon2.verify(bc.hashCode, code)) {
          const result = await db
            .update(backupCodesTable)
            .set({ used: true, usedAt: new Date() })
            .where(
              and(
                eq(backupCodesTable.hashCode, bc.hashCode),
                eq(backupCodesTable.used, false)
              )
            );

          isValid = true;

          break;
        }
      }
      if (!isValid) {
        return res.status(400).json({
          success: false,
          msg: "Wrong backup code or already used",
        });
      }
    }

    const sessionId = crypto.randomUUID();
    const accessToken = await generateAccessToken(
      existingUser.id,
      existingUser.email,
      existingUser.is2fa,
      sessionId
    );
    const refreshToken = generateRefreshToken();

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    res.clearCookie("tempToken", cookieOptions);

    res
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 5 * 60 * 1000,
      })

      .cookie("sid", sessionId, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        msg: "User login successfully",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          isAccountVerified: existingUser.isAccountVerified,
          isTwoFactorEnabled: existingUser.is2fa,
        },
        accessToken: accessToken,
      });

    queueMicrotask(async () => {
      const device = req.deviceInfo;
      await db.insert(UserSessions).values({
        id: sessionId,
        userId: existingUser.id,
        refreshToken: hashedRefreshToken,
        isActive: true,

        deviceName: req.deviceInfo?.deviceName ?? null,
        deviceType: req.deviceInfo?.deviceType ?? null,
        os: req.deviceInfo?.os ?? null,
        browser: req.deviceInfo?.browser ?? null,
        ipAddress: req.deviceInfo?.ipAddress ?? null,
      });

      await db
        .update(Users)
        .set({
          lastLoginAt: new Date(),
        })
        .where(eq(Users.email, user.email));
    });
  } catch (error: any) {
    console.error("Server error (2FA login error ) ", error.message);
    return res
      .status(500)
      .json({
        success: false,
        msg:
          process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : error.message,
      });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(
      `[LOGOUT] IP: ${req.ip} - User-Agent: ${req.get("User-Agent")}`
    );
    // #endregion
    const { refreshToken, sid } = req.cookies || req.body;

    if (refreshToken && sid) {
      // console.log("refresh token and sid");

      const [session] = await db
        .select()
        .from(UserSessions)
        .where(eq(UserSessions.id, sid));

      if (session && session.isActive) {
        // console.log("session and active");

        const isValid = await argon2.verify(session.refreshToken, refreshToken);

        if (isValid) {
          // console.log("isValid");

          await db
            .update(UserSessions)
            .set({
              isActive: false,
              revokedAt: new Date(),
            })
            .where(eq(UserSessions.id, sid));
        }
      }
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("sid", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error(error.message);
    return res
      .status(500)
      .json({
        success: false,
        msg:
          process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : error.message,
      });
  }
};
