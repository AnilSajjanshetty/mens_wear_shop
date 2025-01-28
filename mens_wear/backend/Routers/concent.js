const express = require("express");
const axios = require("axios");
const userRoles = require("../Modal/Users-Role-Modal");
const roles = require("../Modal/Roles-Modal");
const router = express.Router();

const concent = async (req, res) => {
  const challenge = req.query.consent_challenge;

  if (!challenge) {
    return res.status(400).send("Consent challenge is missing");
  }

  try {
    const response = await axios.get(
      `${process.env.HYDRA_ADMIN_URL}/oauth2/auth/requests/consent?consent_challenge=${challenge}`
    );

    const { requested_scope } = response.data;

    // Assuming the user's email and userId are available from the session or JWT token
    const { email, userId } = req.user || {
      email: "user@example.com",
      userId: "12345",
    };

    // Get user role from the userRoles model
    const userRole = await userRoles.findOne({ UserId: userId });

    // Get role details from the roles model
    const roleDetails = await roles.findOne({ RoleId: userRole.RoleId });

    // Accept the consent request with the granted scope, session data, and role info
    const acceptResponse = await axios.put(
      `${process.env.HYDRA_ADMIN_URL}/oauth2/auth/requests/consent/accept?consent_challenge=${challenge}`,
      {
        grant_scope: requested_scope,
        session: {
          id_token: { userId: userId, roleDetails: roleDetails }, // Add the role to session data
        },
      }
    );

    // Redirect the user to the redirect URL provided by Hydra
    res.redirect(acceptResponse.data.redirect_to);
  } catch (error) {
    console.error("Error handling consent challenge:", error.message);
    res
      .status(500)
      .send("An error occurred while processing consent. Please try again.");
  }
};

module.exports = { concent };
