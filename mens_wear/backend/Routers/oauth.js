const express = require("express");
const router = express.Router();
const { HYDRA_PUBLIC_URL, CLIENT_ID, REDIRECT_URI, HYDRA_ADMIN_URL } =
  process.env;

// Authorization endpoint to redirect user to Hydra login page
const oAuth = async (req, res) => {
  console.log("oAuth called");
  const authorizationUrl = `${HYDRA_PUBLIC_URL}/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid offline_access`; // Add offline_access for refresh token
  res.redirect(authorizationUrl);
  console.log({ authorizationUrl });
};

module.exports = { oAuth };
