const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const profileSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"], // Regex for email validation
  },
  Password: {
    type: String,
    required: true,
    trim: true,
  },
  MobileNo: {
    type: Number,
    required: true,
    trim: true,
  },
  Address: {
    type: String,
    required: true,
    trim: true,
  },
  Image: {
    type: String, // Store image URL, default to null
    default: null,
  },
});

// Apply auto-increment plugin for UserId
profileSchema.plugin(AutoIncrement, { inc_field: "UserId" });

// Pre-save hook to hash password before storing it in the DB
profileSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    try {
      this.Password = await bcrypt.hash(this.Password, 10); // Hashing password with 10 rounds of salting
      next(); // Proceed with saving the document
    } catch (error) {
      next(error); // Handle error during hashing
    }
  } else {
    next(); // No modification to password, just proceed
  }
});

const users = mongoose.model("profile", profileSchema);

module.exports = users;
