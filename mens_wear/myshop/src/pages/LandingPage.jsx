import React from "react";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutUs from "../components/AboutUs";
import Slider from "../components/Slider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCategoryDisplay from "../components/ProductCategoryDisplay";
import ClientReview from "../components/ClientReview";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Slider />
      <AboutUs />
      <FeaturedProducts />
      <ProductCategoryDisplay />
      <ClientReview />
      <Footer />
    </div>
  );
};

export default LandingPage;
