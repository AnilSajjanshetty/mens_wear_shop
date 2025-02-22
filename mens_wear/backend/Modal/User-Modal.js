const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const validator = require("validator"); // Import validator for sanitization

const profileSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
    match: [/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"],
    set: (value) => validator.escape(value), // Sanitize input
  },
  Email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true, // Ensure emails are stored in lowercase
    validate: [validator.isEmail, "Invalid email address"], // Validate email
    set: (value) => validator.normalizeEmail(value), // Sanitize email
  },
  Password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [20, "Password must be at most 20 characters long"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include uppercase, lowercase, number & special character",
    ],
  },
  MobileNo: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"],
  },
  Address: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, "Address must be at least 5 characters long"],
    maxlength: [100, "Address must be at most 100 characters long"],
    set: (value) => validator.escape(value), // Sanitize address
  },
  Image: {
    type: String, // Store image URL, default to null
    default: null,
  },
});

// Apply auto-increment plugin for UserId
profileSchema.plugin(AutoIncrement, { inc_field: "UserId" });

// 🔐 Pre-save Hook to Hash Password Before Storing in DB
profileSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    try {
      // Avoid double hashing
      if (!this.Password.startsWith("$2b$")) {
        this.Password = await bcrypt.hash(this.Password, 12);
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// 🔐 Compare Password Method
profileSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};

const users = mongoose.model("profile", profileSchema);

module.exports = users;
