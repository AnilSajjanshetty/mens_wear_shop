import React from "react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const defaultImage = "https://via.placeholder.com/200"; // Placeholder image if no image exists
  const productImage = product?.Image?.length > 0 ? product.Image[0] : defaultImage; // First image or default

  return (
    <motion.div
      className="card shadow-lg border rounded-lg w-100"
      whileHover={{ scale: 1.05 }}
    >
      <div className="overflow-hidden mx-auto" style={{ height: "18rem" }}>
        <img
          // src={`http://localhost:8000/${productImage}`}
          src={productImage}
          alt={product.ProductName}
          className="img-fluid"
        />
      </div>
      <div className="card-body text-center flex flex-column justify-between h-full">
        <h5 className="card-title text-dark">{product.ProductName}</h5>
        <p className="card-text text-secondary">₹{product.Price}</p>
        <button
          className="btn btn-primary w-100 mt-auto"
          style={{
            background:
              "linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)",
          }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
