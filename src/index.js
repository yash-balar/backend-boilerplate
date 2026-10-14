import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import productRoute from "./routes/product.route.js";
import { insializeSocket } from "./config/socket.js";
// import { connectRedis } from "./config/redis.js"; // Enable after Redis is running.
import { connectPostgres } from "./config/postgres.js";
import { connectMySQL } from "./config/mysql.js";
import { fileURLToPath } from "url";
import path from "path";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
const createServer = http.createServer(app);
insializeSocket(createServer);

app.use("/api", productRoute);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const startServer = async () => {
  try {
    // await connectDB();
    // await connectPostgres()
    await connectMySQL();
    // await connectRedis(); // Enable after Redis is running.
    createServer.listen(PORT, () => {
      console.log(`server listing on ${PORT}`);
    });
  } catch (error) {}
};

startServer();
