const express = require("express");
const cors = require("cors");
const AllRouters = require("./Routers/All-Router");
const { authMiddleware } = require("./authMiddleware");
const intialDbConnection = require("./DataBase/DbConnection");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests BEFORE auth middleware
app.options("*", cors(corsOptions));

// Auth middleware (make sure it skips OPTIONS requests)
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

// Connect to DB
intialDbConnection().catch((err) =>
  console.error("❌ DB Connection Failed:", err)
);

module.exports = app;
