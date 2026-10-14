import { createClient } from "redis";

// Create the shared Redis client; Redis runs locally on port 6379.
const redisClient = createClient({
    url: "redis://127.0.0.1:6379"
})

redisClient.on("error", (err)=>{
    console.log("error in connection redis", err)
})

export const connectRedis = async () =>{
    // Connect once during application startup before Redis-backed features run.
    await redisClient.connect()
    console.log('Redis connected')
}

export default redisClient