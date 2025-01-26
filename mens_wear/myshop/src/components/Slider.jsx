import React from 'react';
import myshop1 from '../assets/images/myshop1.jpg';
import myshop2 from '../assets/images/myshop2.jpg';
import myshop3 from '../assets/images/myshop3.jpg';

const products = [
  { id: 1, title: 'Classic Suit', price: '$199', img: myshop1 },
  { id: 2, title: 'Casual Jacket', price: '$99', img: myshop2 },
  { id: 3, title: 'Formal Shirt', price: '$49', img: myshop3 },
];

const Slider = () => {
  return (
    <section
    id="slider" // The anchor point for the navbar link
    className="bg-light"
    style={{ paddingTop: '4.8rem' }} // Adjust this value to your navbar height
  >
    <div
     
      className="carousel slide"
      data-bs-ride="carousel"
     
    >
      <div className="carousel-inner">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <div style={{ height: '91vh', overflow: 'hidden' }}>
              <img
                src={product.img}
                className="d-block img-fluid"
                alt={product.title}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h5>{product.title}</h5>
              <p>{product.price}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Updated previous and next buttons with color changes */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#slider"
        data-bs-slide="prev"
       
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#slider"
        data-bs-slide="next"
   
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
    </section>
  );
};

export default Slider;
