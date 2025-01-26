import React from 'react';
import ProductCard from './ProductCard';

import myshop1 from '../assets/images/myshop1.jpg';
import myshop2 from '../assets/images/myshop2.jpg';
import myshop3 from '../assets/images/myshop3.jpg';

const products = [
  { id: 1, title: 'Classic Suit', price: '$199', img: myshop1 },
  { id: 2, title: 'Casual Jacket', price: '$99', img: myshop2 },
  { id: 3, title: 'Formal Shirt', price: '$49', img: myshop3 },
];

const FeaturedProducts = () => {
  return (
    <section
      id="products"
      className="py-12 bg-light"
      style={{ paddingTop: '80px' }} // This ensures the section is not hidden by the navbar
    >
      <div className="container">
        <h2 className="text-center text-primary mb-5">Featured Products</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
