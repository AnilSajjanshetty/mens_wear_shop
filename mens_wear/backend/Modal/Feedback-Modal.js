const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", FeedbackSchema);
