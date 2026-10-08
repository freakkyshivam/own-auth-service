import jwt from "jsonwebtoken";
import crypto from "node:crypto";
export const generateAccessToken = async (id:string, email: string,is2fa:boolean | null, sid:string)=>{
   try {
     const payload = {
        id,
        email,
        is2fa,
        sid
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!,{expiresIn:"5m"})
    return token;
   } catch (error:any) {
    console.error(error.message)
    throw error;
   }
}

export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const verifyToken = (token:string)=>{
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!)
}