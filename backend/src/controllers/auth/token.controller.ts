import { response, type Request, type Response } from "express";
import argon2 from "argon2";
import { and, eq, ne } from "drizzle-orm";

import db from "../../db/db.js";

import { UserSessions } from "../../db/schema/user_sessions.schema.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";
import { cookieOptions } from "../../utils/cookiesAption.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // #region region agent log
    console.log(`[REFRESH TOKEN] IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    // #endregion
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1418b0b3-e616-4466-997e-06f62e8307db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'token.controller.ts:16',message:'refreshToken entry',data:{hasCookies:!!req.cookies,refreshToken:!!req.cookies?.refreshToken,sid:!!req.cookies?.sid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log("Refresh token routes called");
    
    const { refreshToken: incomingRefreshToken, sid } = req.cookies;

    if (!incomingRefreshToken || !sid) {
      console.log("Missing tokens");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/1418b0b3-e616-4466-997e-06f62e8307db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'token.controller.ts:22',message:'Missing tokens in refresh',data:{hasRefreshToken:!!incomingRefreshToken,hasSid:!!sid},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return res.status(401).json({ success: false, msg: "Missing tokens" });
    }

    
    const payload = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
  


if(!payload){
  console.log("Payload not found");
  return res.status(401).json({
    success:false,
    msg:"Refresh token is wrong"
  })
}
    const user = payload;

    const [session] = await db
      .select()
      .from(UserSessions)
      .where(
        and(
          eq(UserSessions.id, sid),
          eq(UserSessions.userId, user?.id),
          eq(UserSessions.isActive, true)
        )
      );

    if (!session) {
      console.log("session not found");

      return res.status(401).json({ success: false, msg: "Session not found" });
    }

    const isValid = await argon2.verify(
      session.refreshToken,
      incomingRefreshToken
    );

    if (!isValid) {
      await db
        .update(UserSessions)
        .set({
          isActive: false,
          revokedAt: new Date(),
        })
        .where(eq(UserSessions.id, sid));

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      console.log("Refresh token compromised");

      return res.status(401).json({
        success: false,
        msg: "Refresh token compromised",
      });
    }

    const newAccessToken = await generateAccessToken(
      user.id,
      user.email,
      user.is2fa,
      sid
    );
    const newRefreshToken =  generateRefreshToken();

    const newHashedRefreshToken = await argon2.hash(newRefreshToken as string);

    await db
      .update(UserSessions)
      .set({
        refreshToken: newHashedRefreshToken,
        lastUsedAt: new Date(),
      })
      .where(
        and(
          eq(UserSessions.id, sid),
          eq(UserSessions.userId, user.id),
          eq(UserSessions.isActive, true)
        )
      );

    console.log("Token rotated successfully");
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1418b0b3-e616-4466-997e-06f62e8307db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'token.controller.ts:113',message:'Setting cookies in refreshToken',data:{hasAccessToken:!!newAccessToken,hasRefreshToken:!!newRefreshToken,cookieOptions,nodeEnv:process.env.NODE_ENV,origin:req.headers.origin,host:req.headers.host},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return res
      .cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        msg: "Token rotated successfully",
        accessToken: newAccessToken,
      });
  } catch (error: any) {
    console.error("Refresh token error error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};
