const express = require("express");
const cors = require("cors");
const session = require("express-session");
const AllRouters = require("./Routers/All-Router");
const { authMiddleware } = require("./authMiddleware");
const config = require("./Config/config");
const intialDbConnection = require("./DataBase/DbConnection");

const HOST = config.HOST;
const PORT = config.PORT;

const app = express();

// ------------------ Middlewares ------------------ //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const uploadDir = path.join(__dirname, "UploadedFiles");

// // ✅ Check if folder exists, if not create it
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log("📁 Created img folder");
// }

// ✅ Session (only if needed)
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// ------------------ CORS Setup ------------------ //
const allowedOrigins = [
  "https://shraddhajins.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies/sessions
  })
);
app.options("*", cors()); // enable preflight for all routes

// // Serve static files
// app.use(
//   "/UploadedFiles",
//   express.static("UploadedFiles", { maxAge: 0, etag: false })
// );
// ------------------ Auth Middleware ------------------ //
app.use(authMiddleware);

// ------------------ API Routes ------------------ //
app.use("/api/v1", AllRouters);

// ------------------ Start Server ------------------ //
const startServer = async () => {
  try {
    // Wait for DB connection
    await intialDbConnection();
    console.log("✅ DB connected");

    // Start listening only after DB is ready
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
};

startServer();

module.exports = app;
