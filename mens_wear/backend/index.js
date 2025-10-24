const express = require("express");
const cors = require("cors");
const AllRouters = require("./Routers/All-Router");
const { authMiddleware } = require("./authMiddleware");
const intialDbConnection = require("./DataBase/DbConnection");

// Create Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - allow frontend URLs
const allowedOrigins = [
  "https://shraddhajins.vercel.app",
  "http://localhost:5173",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Auth middleware
app.use(authMiddleware);

// API routes
app.use("/api/v1", AllRouters);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: true, message: err.message || "Internal Server Error" });
});

// Connect to DB (keep connection alive between invocations)
intialDbConnection().catch((err) =>
  console.error("❌ DB Connection Failed:", err)
);

// Export the app as a Vercel serverless function
module.exports = app;
