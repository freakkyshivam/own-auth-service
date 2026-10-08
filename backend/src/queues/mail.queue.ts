import { Queue } from "bullmq";
import { bullRedis} from "../config/bullmq.redis.js";

export const mailQueue = new Queue('mail-queue',{
    connection:bullRedis,
    defaultJobOptions : {
        attempts : 3,
        backoff : {
            type : "exponential",
            delay : 2000,
        },
        removeOnComplete : true,
        removeOnFail : false
    },
})

  export const enqueueMail = async (
        type:   "WELCOME" | "PASSWORD_RESET" | "ACCOUNT_VERIFY" | "PASSWORD_RESET_ALERT" | "TWO_FA_ENABLE_ALERT" | "TWO_FA_DISABLE_ALERT" | "GENERATE_NEW_CODE",
    payload: Record<string, any>
    )=>{
        await mailQueue.add(type,payload);
    }

  if(await mailQueue.isPaused()) await mailQueue.resume();


