const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const userToken = require("../Modal/User-Token");
const User = require("../Modal/User"); // Import User model for role checking

const WHITELISTED_PATHS = [
  "/api/v1/login",
  "/api/v1/register-customer",
  "/api/v1/refresh-token",
];

const authMiddleware = async (req, res, next) => {
  if (WHITELISTED_PATHS.includes(req.path)) {
    return next();
  }

  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], config.ACCESS_TOKEN_SECRET);

    const storedToken = await userToken.findOne({
      userId: decoded.userId,
      accessToken: token.split(" ")[1],
    });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userId = decoded.userId;
    req.userRole = user.role; // Store user role in request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
