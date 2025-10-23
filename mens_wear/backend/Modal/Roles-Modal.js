const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  RoleId: { type: Number, required: true },
  RoleName: { type: String, required: true },
});

// Prevent overwriting if model already exists
const Role = mongoose.models.role || mongoose.model("role", roleSchema);

module.exports = Role;
