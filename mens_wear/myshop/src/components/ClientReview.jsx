import React from 'react';
import ReviewCard from './ReviewCard';  // Importing ReviewCard
import './ClientReview.css';  // Adjust the path based on your file structure

const reviews = [
  { id: 1, name: 'John Doe', rating: 5, comment: 'Great product, very helpful!' },
  { id: 2, name: 'Jane Smith', rating: 4, comment: 'Good quality, but could be improved.' },
  { id: 3, name: 'Alice Brown', rating: 5, comment: 'Amazing customer service!' },
  { id: 4, name: 'Bob White', rating: 3, comment: 'Satisfactory, nothing exceptional.' },
  { id: 5, name: 'Charlie Green', rating: 4, comment: 'Would recommend it to others.' },
  { id: 6, name: 'David Black', rating: 3, comment: 'The experience was okay, could be better.' },
  { id: 7, name: 'Eve Wilson', rating: 5, comment: 'Loved it, really improved my workflow!' },
  { id: 8, name: 'Frank Harris', rating: 3, comment: 'Not bad, but could use some improvements.' },
  { id: 9, name: 'Grace Lee', rating: 4, comment: 'Good value for the price.' },
  { id: 10, name: 'Henry Clark', rating: 5, comment: 'Fantastic! Highly recommend!' },
];

const ClientReview = () => {
    return (
      <section id="reviews" className="py-12 bg-light">
        <div className="container">
          <h2 className="text-center text-primary mb-5">Customer Reviews</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {reviews.map((review) => (
              <div key={review.id} className="col">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default ClientReview;