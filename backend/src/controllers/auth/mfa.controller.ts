import { type Request, type Response } from "express";
import { generateQr } from "../../utils/qr.js";
import { getRedis } from "../../config/redis.js";
import db from "../../db/db.js";
import Users from "../../db/schema/users.schema.js";
import { eq } from "drizzle-orm";
import authenticator from "../../config/otplib.js";
import { encryptSecret, decryptSecret } from "../../utils/crypto.util.js";
import { generateAndSaveBackupCode } from "../../services/user/generateAndSaveBackupcode.js";
import backupCodesTable from "../../db/schema/user_2fa_backupcode.scema.js";
import z, { email } from "zod";
import  argon2 from "argon2";
import { enqueueMail } from "../../queues/mail.queue.js";
import { storeOtpInRedis, verifyOtpFromRedis } from "../../services/otp/otp.service.js";
const redis = await getRedis();

export const setup2fa = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[SETUP 2FA] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    if (user.is2fa) {
      return res
        .status(400)
        .json({ success: false, msg: "2FA already enabled" });
    }
    const secret = authenticator.generateSecret();
    if (!secret)
      return res
        .status(400)
        .json({ success: false, msg: "2FA secret code not generated" });

    const otpAuth = authenticator.keyuri(user.email, "Authify", secret);

    const data = {
        secret,
        attempts : 0
    }

    redis.set(`2fa:setup:${user.id}`, JSON.stringify(data), { EX: 300 });

    const qr = await generateQr(otpAuth);

    return res
      .status(200)
      .json({ success: true, msg: "Qrcode is generated for 2FA setup", qr,secret });
  } catch (error: any) {
    console.log("Internal server error ", error.message);

    return res.status(500).json({
      success: false,
      msg: `Internal serevr error ${error.message}`,
    });
  }
};

export const verify2faSetup = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[VERIFY 2FA SETUP] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    const { otp } = req.body;
    const user = req.user;

    if (!user?.id) {
      return res.status(400).json({ success: false, msg: "Unauthorized" });
    }

    if (!otp) {
      return res.status(400).json({ success: false, msg: "OTP is required" });
    }

    const dataRaw = await redis.get(`2fa:setup:${user.id}`);
    if (!dataRaw) throw new Error("2FA session expired");

    const data = JSON.parse(dataRaw);
    const { secret, attempts } = data;


    if (user.is2fa) {
      return res.status(400).json({ msg: "2FA already enabled" });
    }

    const isValid = authenticator.verify({
      token: otp,
      secret,
    });

    if (!isValid) {
        data.attempts += 1;

          if (data.attempts >= 5) {
    await redis.del(`2fa:setup:${user.id}`);
    return res.status(429).json({
      success: false,
      msg: "Too many invalid attempts. Restart 2FA setup.",
    });
  }

  await redis.set(
    `2fa:setup:${user.id}`,
    JSON.stringify(data),
    { EX: 300 }
  );

  return res.status(400).json({ success: false, msg: "Invalid OTP" });
    } 

    const { cipher, nonce } = encryptSecret(secret);

    await db
      .update(Users)
      .set({
        is2fa: true,
        twoFactorSecret: cipher,
        twoFactorNonce: nonce,
      })
      .where(eq(Users.id, user.id));

    await redis.del(`2fa:setup:${user.id}`);

    const plainBackupCodes = await generateAndSaveBackupCode(user.id)
 
    

    // Send 2FA enable alert email
    await enqueueMail("TWO_FA_ENABLE_ALERT", {
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      msg: "Two factor authentication is enabled",
      backupCodes: plainBackupCodes,
    });
  } catch (error: any) {
    console.log("Internal server error (2FA verification) ", error.message);

    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

export const disable2Fa = async (req:Request, res:Response)=>{
  try {
    // #region region agent log
    console.log(`[DISABLE 2FA] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion

    const authUser = req.user;

    if(!authUser?.id){
      return res.status(401).json({
        success:false,
        msg:"Unauthorized"
      })
    }

    const [user] = await db.select()
    .from(Users)
    .where(eq(Users.id,authUser.id))

    if(!user){
    return res.status(400).json({
       success:false,
      msg:"Something went wrong"
    })
  }

    if(!user.is2fa){
      return res.status(400).json({
        success:false,
        msg:"Two factor authentication is already disabled"
      })
    }

    const {password} = req.body;

  if(!password){
    return res.status(400).json({
      success:false,
      msg:"Password are required for disable 2FA"
    })
  }

   

  

  const isValid = await argon2.verify(user.password,password)

  if(!isValid){
     return res.status(400).json({
      success:false,
      msg:"Invalid password"
    })
  }

    await db.transaction(async (tx)=>{
         await tx.update(Users)
    .set({
      is2fa : false,
      twoFactorSecret : null,
      twoFactorNonce : null
    }).where(eq(Users.id, authUser.id))

    await tx.delete(backupCodesTable).where(eq(backupCodesTable.userId, authUser.id))
    })

    // Send 2FA disable alert email
    await enqueueMail("TWO_FA_DISABLE_ALERT", {
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      success:true,
      msg:"Two factor authentication has been disabled"
    })
    
  } catch (error: any) {
    console.log("Internal server error (2FA disabled) ", error.message);

    return res.status(500).json({
      success: true,
      msg: "Something went wrong",
    });
  }
}

export const generateNewBackupCode = async (req:Request, res:Response)=>{
  try {
    // #region region agent log
    console.log(`[GENERATE NEW BACKUP CODE] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion

    const authUser = req.user;

    if(!authUser?.id){
      return res.status(401).json({
        success:false,
        msg:"Unauthorized"
      })
    }

    if(!authUser.is2fa){
      return res.status(400).json({
        success:false,
        msg:"Two factor authentication is not enabled"
      })
    }

      const [user] = await db.select()
    .from(Users)
    .where(eq(Users.id,authUser.id))

    if(!user){
    return res.status(400).json({
       success:false,
      msg:"Something went wrong"
    })
  }

    if(!user.is2fa){
      return res.status(400).json({
        success:false,
        msg:"Two factor authentication is not enable"
      })
    }

     

     const otpS = await storeOtpInRedis({identifier:user.email, purpose:"GENERATE_NEW_CODE"});
    enqueueMail("GENERATE_NEW_CODE",{
      name : user.name,
      email : user.email,
      otp : otpS
    })

    const {otp} = req.body;

   const isValid = await verifyOtpFromRedis({
    identifier : user.email,
    purpose : "GENERATE_NEW_CODE",
    otp
   })

  if(!isValid){
    return res.status(401).json({
      success:false,
      msg:"Invalid OTP"
    })
  }

    await db.
    delete(backupCodesTable).
    where(
      eq(backupCodesTable.userId, authUser.id)
    )

    const plainBackupCodes = await generateAndSaveBackupCode(authUser.id)

    return res.status(200).json({
      success:true,
      data : plainBackupCodes,
      msg:"New backupcodes generated"
    })
    
 } catch (error: any) {
    console.log("Internal server error (New backupcode generation error) ", error.message);

    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
}