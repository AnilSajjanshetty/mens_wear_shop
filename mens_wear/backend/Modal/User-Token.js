const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // Auto-delete after 7 days
});

module.exports = mongoose.model("userToken", userTokenSchema);
