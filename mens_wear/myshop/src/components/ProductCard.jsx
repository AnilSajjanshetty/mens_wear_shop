import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      className="card shadow-lg border rounded-lg w-100"
     
      whileHover={{ scale: 1.05 }}
    >
      <div className=" overflow-hidden mx-auto" style={{height:"18rem",}}>
        <img
          src={product.img}
          alt={product.title}
          className="img-fluid"

        />
      </div>
      <div className="card-body text-center flex flex-column justify-between h-full">
        <h5 className="card-title text-dark">{product.title}</h5>
        <p className="card-text text-secondary">{product.price}</p>
        <button className="btn btn-primary w-100 mt-auto" style={{background: 'linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)'}}>Add to Cart</button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
