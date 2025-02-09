// src/pages/AllProducts.js
import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import NavbarComponent from "../components/NavbarComponent";
import { motion } from "framer-motion";
import AddProductModal from "../components/AddProductModal";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const AllProducts = () => {
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/get-product"
            );
            setProducts(response.data || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/delete-product/${productId}`);
                fetchProducts();
                alert("Product deleted successfully");
            } catch (error) {
                console.error("Error deleting product", error);
                alert("Failed to delete product");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ff512f, #dd2476)",
                padding: "1.25rem",
            }}
        >
            <NavbarComponent />
            <Container>
                <h2 className="text-white mb-4">Add and Manage Products</h2>
                <Button className="btn btn-light mb-3" onClick={() => { setShowModal(true); setSelectedProduct(null); }}>
                    Add Product
                </Button>

                {/* Products Grid */}
                <Row>
                    {products.map((product) => (
                        <Col md={6} lg={4} key={product._id} className="mb-4">
                            <Card className="shadow-lg rounded-lg overflow-hidden">
                                <Row noGutters>
                                    {/* Left - Product Image */}
                                    <Col xs={5}>
                                        <div
                                            style={{
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#f8f9fa",
                                            }}
                                        >
                                            {product.Image && product.Image.length > 0 ? (
                                                <img
                                                    src={`http://localhost:8000/${product.Image[0]}`}
                                                    alt={product.ProductName}
                                                    style={{
                                                        width: "100%",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-muted">No Image</span>
                                            )}
                                        </div>
                                    </Col>

                                    {/* Right - Product Details */}
                                    <Col xs={7}>
                                        <Card.Body>
                                            <h5 className="card-title">{product.ProductName}</h5>
                                            <p className="card-text text-muted">
                                                {product.categoryName}
                                            </p>
                                            <p className="card-text">
                                                <strong>${product.Price}</strong> | Stock: {product.Stock}
                                            </p>

                                            {/* Icons for Actions */}
                                            <div className="d-flex justify-content-between mt-3">
                                                <FaEye size={20} className="text-primary cursor-pointer" />
                                                <FaEdit size={20} className="text-warning cursor-pointer" onClick={() => handleEdit(product)} />
                                                <FaTrash size={20} className="text-danger cursor-pointer" onClick={() => handleDelete(product.ProductId)} />
                                            </div>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Add/Edit Product Modal */}
            <AddProductModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshProducts={fetchProducts}
                product={selectedProduct}
            />
        </motion.div>
    );
};

export default AllProducts;
