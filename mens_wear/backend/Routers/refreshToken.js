const express = require("express");
const axios = require("axios");
const userRoles = require("../Modal/Users-Role-Modal"); // Assuming this is your model for user roles
const roles = require("../Modal/Roles-Modal"); // Assuming this is your model for roles
const router = express.Router();
const { CLIENT_ID, CLIENT_SECRET, HYDRA_PUBLIC_URL } = process.env;

const refreshToken = async (req, res) => {
  const { refresh_token, userId } = req.body;

  if (!refresh_token) {
    return res.status(400).send("Refresh token is required");
  }

  try {
    // Step 1: Refresh the access token using the refresh token
    const response = await axios.post(
      `${HYDRA_PUBLIC_URL}/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token,
      })
    );

    const { access_token, refresh_token: newRefreshToken } = response.data;

    // Step 2: Retrieve the user's role information from the Users-Role-Modal
    const userRole = await userRoles.findOne({ UserId: userId });
    if (!userRole) {
      return res.status(404).send("User role not found");
    }

    // Step 3: Retrieve the role details based on roleId from Roles-Modal
    const roleDetails = await roles.findOne({ RoleId: userRole.RoleId });
    if (!roleDetails) {
      return res.status(404).send("Role details not found");
    }

    // Step 4: Include only userId and roleId in the session or token response
    req.session.token = {
      access_token,
      refresh_token: newRefreshToken,
      userId, // Adding only userId to session
      roleId: userRole.RoleId, // Adding roleId to session
      roleDetails, // Adding role details to session
    };

    res.send({
      message: "New tokens received",
      data: {
        access_token,
        refresh_token: newRefreshToken,
        userId, // Returning only userId in the response
        roleId: userRole.RoleId,
        roleDetails, // Returning role details in the response
      },
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Error refreshing tokens");
  }
};

module.exports = { refreshToken };
