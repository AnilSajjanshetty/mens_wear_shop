const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
      min: 1, // Ensures userId is a positive number
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Ensures rating is between 1 and 5
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, // Minimum 10 characters required
      maxlength: 500, // Limit feedback length to 500 characters
      set: (value) =>
        sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }), // Removes HTML tags for security
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", FeedbackSchema);
