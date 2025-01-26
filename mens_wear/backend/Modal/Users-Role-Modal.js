const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  UserId: {
    type: Number,
    required: true,
    unique: true, // Each user should have only one role association
  },
  RoleId: {
    type: Number,
    required: true,
    default: 3, // Default role is "User"
  },
});

const UserRole = mongoose.model("user_role", userRoleSchema);

module.exports = UserRole;
