import mysql from "mysql2/promise"
import { configDotenv } from "dotenv"
configDotenv()

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})

export const connectMySQL = async () =>{
    try {
        const connection = await pool.getConnection()
        console.log('MySQL connected successfully')
        connection.release()
    } catch (error) {
        console.log('Mysql connection error', error)
    }
}


export default pool