// src/pages/AllProducts.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";
import AddProductModal from '../components/AddProductModal';
import axios from 'axios';

const AllProducts = () => {
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/get-product');
            setProducts(response.data || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)" }}
        >
            <NavbarComponent />
            <Container>
                <h2>Add and Manage Products</h2>
                <Button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                    Add Product
                </Button>

                {/* Product Table */}
                <Table bordered hover>
                    <thead className="table-dark">
                        <tr>
                            <th>Sr. No</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.ProductName}</td>
                                <td>${product.Price}</td>
                                <td>{product.categoryName}</td>
                                <td>{product.Stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Add Product Modal */}
            <AddProductModal show={showModal} handleClose={() => setShowModal(false)} refreshProducts={fetchProducts} />
        </motion.div>
    );
};

export default AllProducts;
