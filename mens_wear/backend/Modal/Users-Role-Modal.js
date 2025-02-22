const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

const rolesSchema = new mongoose.Schema({
  RoleId: {
    type: Number,
    required: [true, "Role ID is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isInt(value.toString(), { min: 1 }),
      message: "Role ID must be a valid positive integer",
    },
  },
  Role: {
    type: String,
    required: [true, "Role name is required"],
    trim: true,
    minlength: [3, "Role name must be at least 3 characters long"],
    maxlength: [50, "Role name cannot exceed 50 characters"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
});

const roles = mongoose.model("role", rolesSchema);

module.exports = roles;
