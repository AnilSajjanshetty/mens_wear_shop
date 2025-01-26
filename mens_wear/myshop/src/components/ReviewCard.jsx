import React from 'react';
import { motion } from 'framer-motion';
import './ClientReview.css';  // Adjust the path based on your file structure

// Helper function to generate stars based on rating
const generateStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
    );
  }
  return stars;
};

const ReviewCard = ({ review }) => {
  return (
    <motion.div
      className="card shadow-lg border-0 rounded-lg w-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="card-body text-center">
        <h5 className="card-title text-dark">{review.name}</h5>
        <div className="stars">{generateStars(review.rating)}</div>
        <p className="card-text text-secondary">{review.comment}</p>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
