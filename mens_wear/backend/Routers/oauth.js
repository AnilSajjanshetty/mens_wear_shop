const express = require("express");
const router = express.Router();
const { HYDRA_PUBLIC_URL, CLIENT_ID, REDIRECT_URI } = process.env;

// Authorization endpoint to redirect user to Hydra login page
router.get("/api/v1", (req, res) => {
  const authorizationUrl = `${HYDRA_PUBLIC_URL}/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid offline_access`; // Add offline_access for refresh token
  res.redirect(authorizationUrl);
});

module.exports = router;
