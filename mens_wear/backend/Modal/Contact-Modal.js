const mongoose = require("mongoose");
const validator = require("validator"); // Input validation & sanitization
const sanitizeHtml = require("sanitize-html"); // XSS protection

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      set: (value) => sanitizeHtml(validator.escape(value)), // ✅ Prevents XSS
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      validate: {
        validator: (value) => validator.isMobilePhone(value, "any"),
        message: "Enter a valid mobile number",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Enter a valid email address"], // ✅ Email format validation
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [100, "Address cannot exceed 100 characters"],
      set: (value) =>
        sanitizeHtml(validator.escape(value), {
          allowedTags: [], // ✅ Remove all HTML tags
          allowedAttributes: {}, // ✅ Remove attributes
        }),
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters"],
      maxlength: [500, "Message cannot exceed 500 characters"],
      set: (value) =>
        sanitizeHtml(validator.escape(value), {
          allowedTags: [], // ✅ Remove all HTML tags
          allowedAttributes: {}, // ✅ Remove attributes
        }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact", ContactSchema);
