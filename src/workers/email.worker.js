import { Worker } from "bullmq"
import bullMQconnection from "../config/bullMQ"

let emailWorker = null
export const startWorkerConnection = async() =>{
    emailWorker = new Worker('email-queue', async (job) =>{
        const {name, email} = job.data

        await new Promise((resolve, reject)=>{
            setTimeout(resolve, 3000)
        })

        return {success: true, name}
    },{
        connection: bullMQconnection,
        concurrency: 2
    })
    emailWorker.on("completed", (job)=>{
        console.log('job:::completed::')
    })

    emailWorker.on("failed", (job, error)=>{
        console.log("email::::error:::",error.message)
    })
}
