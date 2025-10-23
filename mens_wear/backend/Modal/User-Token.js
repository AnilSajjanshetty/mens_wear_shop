const mongoose = require("mongoose");
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");

const userTokenSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: [true, "User ID is required"],
    validate: {
      validator: (value) => validator.isInt(value.toString(), { min: 1 }),
      message: "User ID must be a valid positive integer",
    },
  },
  accessToken: {
    type: String,
    required: [true, "Access token is required"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
  refreshToken: {
    type: String,
    required: [true, "Refresh token is required"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Auto-delete after 7 days
  },
});

module.exports = mongoose.model("userToken", userTokenSchema);
