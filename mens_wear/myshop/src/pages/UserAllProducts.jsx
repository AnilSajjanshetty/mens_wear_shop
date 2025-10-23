import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import CustomerNavbar from "../components/CustomerNavbar";
import config from "../../config";

const UserAllProducts = () => {
    const navigate = useNavigate();
    const server = config.server;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get(`/get-product`);
                setProducts(response.data || []);
            } catch (err) {
                setError("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [server]);

    const handleViewProduct = (productId) => {
        navigate(`/user/product/${productId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
        >
            <CustomerNavbar />
            <Container>
                <h2 className="text-white mb-4">All Products</h2>

                {loading && <p>Loading products...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && products.length === 0 && (
                    <p className="text-center text-white mt-4">No products to show</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <Row className="mt-4">
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={4} lg={3} className="mb-4">
                                <Card className="h-100 shadow-lg" style={{ borderRadius: "20px" }}>
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:8000/${product.Image[0]}`}
                                        alt={product.ProductName}
                                        style={{ objectFit: "cover", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{product.ProductName}</Card.Title>
                                        <Card.Text>
                                            <strong>Description:</strong> {product.Description}<br />
                                            <strong>Price:</strong> ${product.Price}<br />
                                            <strong>Stock:</strong> {product.Stock}
                                        </Card.Text>
                                        <Button variant="primary" style={{ width: "100%" }} onClick={() => handleViewProduct(product._id)}>View</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </motion.div>
    );
};

export default UserAllProducts;
