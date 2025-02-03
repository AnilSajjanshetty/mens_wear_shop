const bcrypt = require("bcrypt");
const users = require("../Modal/User-Modal");
const roles = require("../Modal/Roles-Modal");
const userRoles = require("../Modal/Users-Role-Modal");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const config = require("../Config/config");

console.log({ config });
const HYDRA_ADMIN_URL = config.HYDRA_URL;
console.log("HYDRA_ADMIN_URL:", HYDRA_ADMIN_URL);

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await users.findOne({ Email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Retrieve the user's role ID from userRoles
    const userRoleRecord = await userRoles.findOne({ UserId: user.UserId });
    if (!userRoleRecord) {
      return res.status(403).json({ message: "User role not found" });
    }

    // Retrieve the role details using RoleId
    const userRole = await roles.findOne({ RoleId: userRoleRecord.RoleId });
    if (!userRole) {
      return res.status(403).json({ message: "Role details not found" });
    }

    // Handle Hydra login challenge
    const challenge = login_challenge;
    if (!challenge) {
      return res.status(400).json({ message: "Login challenge is missing" });
    }

    // Pass the user's role in the context field of the token
    const loginResponse = await axios.put(
      `${HYDRA_ADMIN_URL}/oauth2/auth/requests/login/accept`,
      {
        subject: user.UserId, // UserId as the subject
        context: {
          roleId: userRoleRecord.RoleId, // Pass RoleId
          role: userRole, // Optional: Pass role name
        },
      },
      { params: { login_challenge: challenge } }
    );

    // Return the Hydra redirect URL
    res.status(200).json({ redirectUrl: loginResponse.data.redirect_to });
  } catch (error) {
    console.error("Error response:", error.response?.data);
    console.error("Error message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login };
