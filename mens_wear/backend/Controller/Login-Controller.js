const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const users = require("../Modal/User-Modal");
const roles = require("../Modal/Roles-Modal");
const userRoles = require("../Modal/Users-Role-Modal");
const express = require("express");
const router = express.Router();

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// In-memory storage for refresh tokens (Map)
const refreshTokensMap = new Map();

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.UserId, email: user.Email, roleId: user.roleId },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.UserId, email: user.Email, roleId: user.roleId },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await users.findOne({ Email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRoleRecord = await userRoles.findOne({ UserId: user.UserId });
    if (!userRoleRecord) {
      return res.status(403).json({ message: "User role not found" });
    }

    const userRole = await roles.findOne({ RoleId: userRoleRecord.RoleId });
    if (!userRole) {
      return res.status(403).json({ message: "Role details not found" });
    }

    const accessToken = generateAccessToken({
      UserId: user.UserId,
      Email: user.Email,
      roleId: userRoleRecord.RoleId,
    });

    const refreshToken = generateRefreshToken({
      UserId: user.UserId,
      Email: user.Email,
      roleId: userRoleRecord.RoleId,
    });

    // Store refresh token in Map

    refreshTokensMap.set(user.UserId, refreshToken);

    res.status(200).json({
      accessToken,
      refreshToken,
      userId: user.UserId,
      roleId: userRoleRecord.RoleId,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
    const storedToken = refreshTokensMap.get(decoded.userId);

    if (!storedToken || storedToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({
      UserId: decoded.userId,
      Email: decoded.email,
      roleId: decoded.roleId,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// Logout function - Remove refresh token from map
const logout = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    let userIdToRemove = null;

    for (let [userId, storedToken] of refreshTokensMap.entries()) {
      if (storedToken === token) {
        userIdToRemove = userId;
        break;
      }
    }

    if (userIdToRemove) {
      refreshTokensMap.delete(userIdToRemove); // Remove token from in-memory store
      return res.status(200).json({ message: "Logged out successfully" });
    } else {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, refreshToken, logout };
