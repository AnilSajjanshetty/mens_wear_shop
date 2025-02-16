const feedback = require("../Modal/Feedback-Modal");

// Get feedback by user ID
const getFeedbackByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const feedbacks = await feedback.findOne({ userId });

    if (!feedbacks) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Submit or update feedback
const submitOrUpdateFeedback = async (req, res) => {
  try {
    const { userId, rating, feedbackText } = req.body;

    if (!userId || !rating || !feedbackText) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userIdNumber = Number(userId);

    let feedbacks = await feedback.findOne({ userId: userIdNumber });

    if (feedbacks) {
      // Update existing feedback
      feedbacks.rating = rating;
      feedbacks.feedback = feedbackText;
      await feedbacks.save();
      return res
        .status(200)
        .json({ message: "Feedback updated successfully", feedbacks });
    } else {
      // Create new feedback
      feedbacks = new feedback({
        userId: userIdNumber,
        rating,
        feedback: feedbackText,
      });
      await feedbacks.save();
      return res
        .status(201)
        .json({ message: "Feedback submitted successfully", feedbacks });
    }
  } catch (error) {
    console.error("Error submitting/updating feedback:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await feedback.find();

    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getFeedbackByUser, submitOrUpdateFeedback, getAllFeedback };
