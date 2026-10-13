import { createClient } from "redis";
const redisClient = createClient({
    url: "redis://127.0.0.1:6379 "
})

redisClient.on("error", (err)=>{
    console.log("error in connection redis", err)
})

export const connectRedis = async () =>{
    await redisClient.connect()
    console.log('Redis connected')
}

export default redisClient