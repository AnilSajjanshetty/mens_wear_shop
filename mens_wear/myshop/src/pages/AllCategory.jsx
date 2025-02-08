// src/pages/AllCategory.js
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";
import AddCategoryForm from '../components/AddCategoryForm'; // Import AddCategoryForm component

const AllCategory = () => {
    const [showModal, setShowModal] = useState(false);

    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    // This function will be passed to AddCategoryForm to update categories when added
    const handleAddCategory = () => {
        console.log('Category added successfully!');
        // You can implement a state update to refresh categories after adding one
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
                <h2>Add and Manage Categories</h2>
                <Button className="btn btn-primary" onClick={handleShowModal}>Add Category</Button>

                {/* Add Category Modal */}
                <AddCategoryForm
                    show={showModal}
                    handleClose={handleCloseModal}
                    handleAddCategory={handleAddCategory}
                />
            </Container>
        </motion.div>
    );
};

export default AllCategory;
