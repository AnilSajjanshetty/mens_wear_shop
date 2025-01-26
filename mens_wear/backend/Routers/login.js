const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../models/profile"); // Import the users model
const UserRole = require("../models/userRole"); // Import the user role model
const axios = require("axios");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    // Find the user by email
    const user = await users.findOne({ Email: email });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }

    // Check user role (optional, depending on your business logic)
    const userRole = await UserRole.findOne({ UserId: user.UserId });

    if (!userRole) {
      return res.status(400).send("User role not found");
    }

    // Login success, generate the login challenge response
    const challenge = req.query.login_challenge;
    if (!challenge) {
      return res.status(400).send("Login challenge is missing");
    }

    // Accept the login request and redirect
    const loginResponse = await axios.put(
      `${process.env.HYDRA_ADMIN_URL}/oauth2/auth/requests/login/accept?login_challenge=${challenge}&subject=${user.UserId}`
    );

    res.json({ redirectUrl: loginResponse.data.redirect_to });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
