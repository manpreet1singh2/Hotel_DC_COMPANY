import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"

dotenv.config()

// Routes
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import roomRoutes from "./routes/rooms.js"
import reservationRoutes from "./routes/reservations.js"
import serviceRoutes from "./routes/services.js"
import paymentRoutes from "./routes/payments.js"
import dashboardRoutes from "./routes/dashboard.js"
import clientRoutes from "./routes/clients.js"
import employeeRoutes from "./routes/employees.js"

// Middleware
import { errorHandler } from "./middleware/errorHandler.js"

const app = express()
const PORT = process.env.PORT || 5000

// Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Middleware
app.use(compression())
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "https://hotel-dc-company.vercel.app",
  /\.vercel\.app$/,
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const allowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      )
      callback(null, allowed)
    },
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check (no DB required)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: process.env.DB_HOST ? "configured" : "not configured",
  })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/employees", employeeRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      "/api/health",
      "/api/auth",
      "/api/users",
      "/api/rooms",
      "/api/services",
      "/api/clients",
      "/api/reservations",
      "/api/employees",
    ],
  })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📊 API available at: http://localhost:${PORT}/api`)
  console.log(`🏨 Hotel DC Company Backend`)
})

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message)
  // Don't exit in production — log and continue
  if (process.env.NODE_ENV !== "production") process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err.message)
  process.exit(1)
})

export default app
