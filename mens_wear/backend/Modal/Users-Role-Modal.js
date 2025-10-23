const mongoose = require("mongoose");
const validator = require("validator");

const rolesSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(), // Automatically generate _id
  },
  UserId: {
    type: Number,
    required: [true, "User ID is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isInt(value.toString(), { min: 1 }),
      message: "User ID must be a valid positive integer",
    },
  },
  RoleId: {
    type: Number,
    required: [true, "Role ID is required"],
    validate: {
      validator: (value) => validator.isInt(value.toString(), { min: 1 }),
      message: "Role ID must be a valid positive integer",
    },
  },
});

// Avoid re-compiling the model if already defined
const userRole =
  mongoose.models.userRole || mongoose.model("user_role", rolesSchema);

module.exports = userRole;
