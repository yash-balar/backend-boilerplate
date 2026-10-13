import pg from "pg"
import { configDotenv } from "dotenv";
configDotenv();

const {Pool} = pg

const pool =  new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
})

export const connectPostgres = async () =>{
    try {
        const connections = await pool.connect()
        connections.release()
        console.log("Postgres connected successfully")
    } catch (error) {
        console.log("postgres:::connection:::error:::",error)
    }
}