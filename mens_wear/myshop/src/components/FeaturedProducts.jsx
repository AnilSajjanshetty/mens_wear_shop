import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import axiosInstance from "../utils/axiosInstance";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axiosInstance.get("/get-featured-product");
        setFeaturedProducts(response.data); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section id="products" className="py-12 bg-light" style={{ paddingTop: "80px" }}>
      <div className="container">
        <h2 className="text-center text-primary mb-5">Featured Products</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product.ProductId} className="col">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-center">No featured products available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
