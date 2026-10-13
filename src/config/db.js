import mongoose from "mongoose"

export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connection successfully")
    } catch (error) {
        console.log('Database connectoin error', error)
    }
}