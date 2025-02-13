import React from 'react';
import ProductSlider from './ProductSlider';

// Import JSON data
import mensWear from '../JsonData/products';


const ProductCategoryDisplay = () => {

  return (
    <section
      id="products"
      className="py-12 bg-light"
      style={{ paddingTop: '4rem' }} // This ensures the section is not hidden by the navbar
    >
      <div className="container bg-light">

        {Object.entries(mensWear).map(([category, products]) => (
          <ProductSlider key={category} categoryName={category} products={products} />
        ))}
      </div>
    </section>
  );
};

export default ProductCategoryDisplay;
