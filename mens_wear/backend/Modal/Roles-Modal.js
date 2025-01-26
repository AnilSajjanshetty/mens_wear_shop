const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
  RoleId: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  Role: {
    type: String,
    required: true,
    trim: true,
  },
});
const roles = mongoose.model("role", rolesSchema);

module.exports = roles;
