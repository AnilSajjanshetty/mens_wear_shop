import React from "react";
import { Container } from "react-bootstrap";
import CustomerNavbar from "../components/CustomerNavbar";
import { motion } from "framer-motion";

const MyProducts = () => {
    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)" }}
        >
            <CustomerNavbar />
            <Container className="text-white mt-5">
                <h1 className="text-center">My Products</h1>
                <p className="text-center mt-3">Browse through your favorite products and explore new arrivals!</p>
            </Container>
        </motion.div>
    );
};

export default MyProducts;
