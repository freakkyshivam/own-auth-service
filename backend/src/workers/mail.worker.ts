import { Worker } from "bullmq";
 import { bullRedis } from "../config/bullmq.redis.js";
 
import {
    sendWelcomeEmail,
  sendRegisterAccountVerifyEmail,
  sendPasswordRestEmail,
  sendPasswordRestAlertEmail,
  sendTwoFactorEnableAlertEmail,
  sendTwoFactorDisableAlertEmail,
  sendGenerateBackupCodeOTPEmail
} from "../services/mail/mail.service.js";


 
const worker = new Worker('mail-queue',
    async (job)=>{
        console.log("Processing job:", job.name);
        const {name , data} = job;

        switch (name){

            case "WELCOME":
                await sendWelcomeEmail(
                    data.name,
                    data.email
                );
                break;

            case "ACCOUNT_VERIFY":
                await sendRegisterAccountVerifyEmail(
                    data.name,
                    data.email,
                    data.otp
                );
                break;

            case "PASSWORD_RESET":
                await sendPasswordRestEmail(
                    data.name,
                    data.email,
                    data.otp
                );
                break;

            case "PASSWORD_RESET_ALERT":
                await sendPasswordRestAlertEmail(
                    data.name,
                    data.email,
                );
                break;

            case "TWO_FA_ENABLE_ALERT":
                await sendTwoFactorEnableAlertEmail(
                    data.name,
                    data.email,
                );
                break;

            case "TWO_FA_DISABLE_ALERT":
                await sendTwoFactorDisableAlertEmail(
                    data.name,
                    data.email,
                );
                break;

            case "GENERATE_NEW_CODE" :
                await sendGenerateBackupCodeOTPEmail(
                    data.name,
                    data.otp,
                    data.email
                )
                break;

            default:
        throw new Error(`Unknown mail job: ${name}`);
        }
    
    },
    {
        connection : bullRedis,
        concurrency : 5
    }
)

worker.on("ready", () => {
  console.log("📬 Mail worker ready");
});

worker.on("failed", (job, err) => {
  console.error("❌ Job failed:", job?.name, err);
});