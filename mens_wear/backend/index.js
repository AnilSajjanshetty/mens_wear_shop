const express = require("express");
const cors = require("cors");
const session = require("express-session");
const AllRouters = require("./Routers/All-Router");
const authMiddleware = require("./authMiddleware");
const config = require("./Config/config");

const HOST = config.HOST;
const PORT = config.PORT;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Serve static files
app.use(
  "/UploadedFiles",
  express.static("UploadedFiles", { maxAge: 0, etag: false })
);

// Apply auth middleware globally (whitelisted paths will be bypassed)
app.use(authMiddleware);

// All API Routes
app.use("/api/v1", AllRouters);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on ${HOST} port ${PORT}`);
});

module.exports = app;
