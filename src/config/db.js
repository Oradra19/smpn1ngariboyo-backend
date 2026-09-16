import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_smpn1ngariboyo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;