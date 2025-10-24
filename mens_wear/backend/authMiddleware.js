const jwt = require("jsonwebtoken");
const config = require("./Config/config");
const userToken = require("./Modal/User-Token");
const User = require("./Modal/User-Modal");
const userRole = require("./Modal/Users-Role-Modal"); // Ensure correct role checking

const WHITELISTED_PATHS = [
  "/api/v1/login",
  "/api/v1/register-customer",
  "/api/v1/refreshToken",
  "/api/v1/get-featured-product",
  "/api/v1/get-products-grouped",
  "/api/v1/add-contact",
];

const authMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (WHITELISTED_PATHS.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token is required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    // Ensure the access token exists in the database
    const storedToken = await userToken.findOne({ userId: decoded.userId });

    if (!storedToken || storedToken.accessToken !== token) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Fetch user role separately
    const userRoleData = await userRole.findOne({ UserId: decoded.userId });
    if (!userRoleData) {
      return res.status(404).json({ message: "User role not found" });
    }

    req.userId = decoded.userId;
    req.roleId = userRoleData.RoleId; // Set correct roleId from userRole model
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.roleId)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
