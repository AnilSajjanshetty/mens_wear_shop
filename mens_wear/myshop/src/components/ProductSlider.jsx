import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

const ProductSlider = ({ categoryName, products }) => {
  const settings = {
    dots: true,
    infinite: products.length > 1, // Avoid infinite scroll if only 1 product
    speed: 500,
    slidesToShow: Math.min(3, products.length), // Show up to 3, but never more than products available
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, products.length) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(2, products.length) } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="product-slider pb-5">
      <h3 className="text-center">{categoryName}</h3>
      {products.length === 0 ? (
        <p className="text-center">No products in this category.</p>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.ProductId} className="col px-2 py-2">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductSlider;
