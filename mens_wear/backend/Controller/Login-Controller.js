const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../Config/config");
const User = require("../Modal/User-Modal");
const userToken = require("../Modal/User-Token");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.Email, roleId: user.roleId },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.Email, roleId: user.roleId },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// 🟢 Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ Email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store tokens in database
    await userToken.findOneAndUpdate(
      { userId: user._id },
      { accessToken, refreshToken },
      { upsert: true }
    );

    res.status(200).json({
      accessToken,
      refreshToken,
      userId: user.userId,
      roleId: user.roleId,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🟢 Refresh Token Controller
const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);
    const storedToken = await userToken.findOne({ userId: decoded.userId });

    if (!storedToken || storedToken.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      Email: decoded.email,
      roleId: decoded.roleId,
    });

    // Update the access token in the database
    storedToken.accessToken = newAccessToken;
    await storedToken.save();

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// 🟢 Logout Controller
const logout = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const deletedToken = await userToken.findOneAndDelete({
      refreshToken: token,
    });

    if (!deletedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, refreshToken, logout };
