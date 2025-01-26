import React from 'react';

const AboutUs = () => {
  return (
    <section
      id="about"
      className="bg-light"
      style={{ paddingTop: '80px' }} // Adjust this value to your navbar height
    >
      <div className="container">
        <h2 className="text-center text-primary mb-5">About Us</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>Our Story</h3>
            <p>
              Welcome to our online store! We specialize in providing high-quality, stylish clothing for every occasion.
              From classic suits to casual jackets, our collection is designed to make you look and feel your best.
            </p>
            <p>
              Our mission is to deliver fashion-forward pieces at affordable prices while ensuring that each customer
              experiences excellent service. We believe that everyone deserves to express themselves through their clothing,
              and we are committed to offering a variety of styles that cater to all tastes.
            </p>
          </div>
          <div className="col-md-6">
            <h3>Why Choose Us?</h3>
            <ul>
              <li>High-quality fabrics and materials</li>
              <li>Trendy and timeless designs</li>
              <li>Affordable pricing and frequent sales</li>
              <li>Fast, reliable shipping</li>
              <li>Exceptional customer service</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
