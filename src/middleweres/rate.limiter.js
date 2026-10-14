import redisClient from "../config/redis.js"

export const rateLimiter = async (req, res, next) =>{
    const user = req.ip || "123"
    const key = `user-limit:${user}`

    // Redis atomically tracks each client's request count across app instances.
    const count = await redisClient.incr(key)

    if(count === 1){
        redisClient.expire(key, 60)
    }
    
    if(count > 3){
        return res.status(429).json({message: "Too many request please wait for 60 seconds"})
    }
    
    next()
}   