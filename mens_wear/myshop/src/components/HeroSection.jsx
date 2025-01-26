import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="hero min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/assets/images/hero-bg.jpg)' }}>
      <div className="text-center px-6 md:px-12">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Discover the Perfect Style
        </motion.h1>
        <motion.p
          className="text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Premium Men’s Fashion for Every Occasion.
        </motion.p>
        <motion.a
          href="#products"
          className="btn btn-accent btn-lg"
          whileHover={{ scale: 1.1 }}
        >
          Shop Now
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
