import React from 'react';
import { Container } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";

const AllCustomers = () => {
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
            <NavbarComponent />
            <Container>
                <h2>Manage Customers</h2>
                {/* Add functionality */}
            </Container>
        </motion.div>
    );
};

export default AllCustomers;