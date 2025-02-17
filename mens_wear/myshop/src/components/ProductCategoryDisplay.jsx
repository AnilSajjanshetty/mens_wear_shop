import React, { useState, useEffect } from "react";
import ProductSlider from "./ProductSlider";
import axios from "axios";

const ProductCategoryDisplay = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://192.168.248.231:8000/api/v1/get-products-grouped");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section id="products" className="py-12 bg-light" style={{ paddingTop: "4rem" }}>
      <div className="container bg-light">
        {categories.length === 0 ? (
          <p className="text-center">No products available.</p>
        ) : (
          categories.map(({ categoryName, products, _id }) => (
            <ProductSlider key={_id} categoryName={categoryName} products={products} />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductCategoryDisplay;
