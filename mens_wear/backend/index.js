const express = require("express");
const cors = require("cors");
const AllRouters = require("./Routers/All-Router");
const { authMiddleware } = require("./authMiddleware");
const intialDbConnection = require("./DataBase/DbConnection");

const app = express();

// CORS - Manual headers + cors package
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware
app.use(authMiddleware);

// Routes
app.use("/api/v1", AllRouters);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

// Initialize DB connection
let dbConnected = false;
if (!dbConnected) {
  intialDbConnection()
    .then(() => {
      dbConnected = true;
      console.log("✅ DB Connected");
    })
    .catch((err) => console.error("❌ DB Connection Failed:", err));
}

// Export for Vercel
module.exports = app;
