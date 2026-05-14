import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hoteldccompany",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  charset: "utf8mb4",
}

let pool = null

const createPool = () => {
  if (!process.env.DB_HOST && process.env.NODE_ENV === "production") {
    console.warn("⚠️  No DB_HOST configured — database features will be unavailable")
    return null
  }
  return mysql.createPool(dbConfig)
}

pool = createPool()

export const testConnection = async () => {
  if (!pool) {
    console.warn("⚠️  Database pool not initialized")
    return false
  }
  try {
    const connection = await pool.getConnection()
    console.log("✅ MySQL connection established")
    console.log(`📊 Database: ${dbConfig.database} @ ${dbConfig.host}`)
    connection.release()
    return true
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message)
    return false
  }
}

export const executeQuery = async (query, params = []) => {
  if (!pool) throw new Error("Database not configured")
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Query error:", error)
    throw error
  }
}

export const executeTransaction = async (queries) => {
  if (!pool) throw new Error("Database not configured")
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const results = []
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params)
      results.push(result)
    }
    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Test connection at startup (non-blocking)
testConnection().catch(() => {})

export default pool
