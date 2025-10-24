const express = require("express");
const cors = require("cors");
const AllRouters = require("./Routers/All-Router");
const { authMiddleware } = require("./authMiddleware");
const config = require("./Config/config");
const intialDbConnection = require("./DataBase/DbConnection");

const app = express();
const PORT = config.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = [
  "https://shraddhajins.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Auth middleware
app.use(authMiddleware);

// API routes
app.use("/api/v1", AllRouters);

// Serve static files if needed
// app.use("/UploadedFiles", express.static("UploadedFiles"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: true, message: err.message || "Internal Server Error" });
});

// Start server after DB connection
const startServer = async () => {
  try {
    await intialDbConnection();
    console.log("✅ DB Connected");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
};

startServer();

module.exports = app;
