// const express = require("express");
// const app = express();
// const cors = require("cors");

// const AllRouters = require("./Routers/All-Router")

// const port = process.env.PORT || 5000;

// app.use(cors());

// app.use(express.json());

// // Serve static files from the "UploadedFiles" directory
// app.use('/UploadedFiles', express.static('UploadedFiles', {
//   // Set cache control headers to prevent caching
//   maxAge: 0,
//   etag: false,
// }));

// app.use("/api/v1",AllRouters)

// app.listen(port, () => {
//   console.log(`I-Shop Server Started on port no. ${port}`);
// });

const express = require("express");
const app = express();
const cors = require("cors");
const client = require("prom-client");
const session = require("express-session");
const AllRouters = require("./Routers/All-Router");

const config = require("./Config/config"); // Import configuration file
// const oauthRoutes = require("./Routers/oauth");
// // const loginRoutes = require("./Routers/login"); // read below and uncomment  call the using app.use uncomment ref 1,
// // want to use above line  comment login route in /Routers/All-Router  and change end point of  hydra log in
// const consentRoutes = require("./Routers/consent");
// const callbackRoutes = require("./Routers/callback"); // New callback route
// const refreshTokenRoutes = require("./Routers/refresh-token");

const { HOST, PORT } = config; // Destructure HOST and PORT
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
// Serve static files from the "UploadedFiles" directory
app.use(
  "/UploadedFiles",
  express.static("UploadedFiles", {
    maxAge: 0,
    etag: false,
  })
);

app.use("/api/v1", AllRouters);
// app.use("/authorize", oauthRoutes);
// // app.use("/login", loginRoutes); // ref1
// app.use("/consent", consentRoutes);
// app.use("/callback", callbackRoutes); // Register the callback route
// app.use("refresh-token", refreshTokenRoutes);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Shraddha-Jeans Server Started on ${HOST} port no. ${PORT}`);
});

module.exports = app;
