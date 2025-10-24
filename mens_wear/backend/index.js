const express = require("express");
const cors = require("cors");
const AllRouters = require("./Routers/All-Router");
const { authMiddleware } = require("./authMiddleware");
const intialDbConnection = require("./DataBase/DbConnection");

const app = express();

// ✅ CORS configuration - MUST be first!
const corsOptions = {
  origin: "*", // or specify: ["https://shraddhajins.vercel.app"]
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Apply CORS before any other middleware
app.use(cors(corsOptions));

// Handle preflight explicitly
app.options("*", cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware
app.use(authMiddleware);

// API routes
app.use("/api/v1", AllRouters);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

// Connect to DB
intialDbConnection().catch((err) =>
  console.error("❌ DB Connection Failed:", err)
);

module.exports = app;
