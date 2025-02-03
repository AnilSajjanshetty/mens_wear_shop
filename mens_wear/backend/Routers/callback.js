const express = require("express");
const axios = require("axios");
const userRoles = require("../Modal/Users-Role-Modal");
const roles = require("../Modal/Roles-Modal");
const jwt = require("jsonwebtoken"); // For decoding JWT tokens (optional, depending on token structure)
const router = express.Router();
const { HYDRA_PUBLIC_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } =
  process.env;

const callBack = async (req, res) => {
  console.log("callback called");
  const { code, login_challenge } = req.query;
  console.log({ login_challenge });
  if (!code) {
    return res.status(400).send("Authorization code not found");
  }
  if (!login_challenge) {
    return res.status(400).send("Login challenge is missing");
  }

  try {
    // Exchange authorization code for tokens
    const response = await axios.post(
      `${HYDRA_PUBLIC_URL}/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      })
    );

    const { access_token, refresh_token } = response.data;

    // Verify the login challenge by calling Hydra's /oauth2/auth/requests/login endpoint
    const loginRequest = await axios.get(
      `${HYDRA_PUBLIC_URL}/oauth2/auth/requests/login`,
      {
        params: { login_challenge },
      }
    );

    if (loginRequest.data && loginRequest.data.challenge) {
      // Proceed with user verification or further actions
      // Decode the JWT access token to get userId if available in the token
      const decodedToken = jwt.decode(access_token); // Optional: you might need to adjust based on your token structure
      const userId = decodedToken?.sub || null; // Assuming user ID is in the 'sub' field in JWT

      if (!userId) {
        return res.status(400).send("User ID not found in token");
      }

      // Get user role from the userRoles model
      const userRole = await userRoles.findOne({ UserId: userId });
      if (!userRole) {
        return res.status(404).send("User role not found");
      }

      // Get role details from the roles model
      const roleDetails = await roles.findOne({ RoleId: userRole.RoleId });
      if (!roleDetails) {
        return res.status(404).send("Role details not found");
      }

      // Store tokens and role in session
      req.session.token = {
        access_token,
        refresh_token,
        role: roleDetails,
        userId: userId,
      };

      // Send a response with tokens and role info
      return res.send(
        `Tokens received: ${JSON.stringify(response.data)}, Role: ${
          roleDetails.roleDetails
        }`
      );
    } else {
      return res.status(400).send("Invalid login challenge");
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res
      .status(500)
      .send("Error exchanging code for tokens or verifying login challenge");
  }
};

module.exports = { callBack };
