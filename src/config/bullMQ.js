import { createIORedisClient } from "bullmq"

const bullMQconnection = new createIORedisClient({
    port: 6379,
    host: "127.0.0.1",
    maxRetriesPerRequest: null,
})

export default bullMQconnection