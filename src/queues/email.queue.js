import { Queue } from "bullmq";
import bullMQconnection from "../config/bullMQ.js";

export const emailQueue = new Queue("email-queue",{
    connection: bullMQconnection
})