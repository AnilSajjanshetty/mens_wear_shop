import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Spinner } from "react-bootstrap";
import CustomerNavbar from "../components/CustomerNavbar";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const server = config.server
    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get(`/get-product`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    }; const navigate = useNavigate()
    const handleViewProduct = (productId) => {
        navigate(`/user/product/${productId}`);
    };
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
        >
            <CustomerNavbar />
            <Container className="text-white mt-1">
                <h1 className="text-center"> Products</h1>
                <p className="text-center mt-3">
                    Browse through your favorite products and explore new arrivals!
                </p>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <Spinner animation="border" variant="light" />
                    </div>
                ) : (
                    <Row className="mt-4">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Col key={product._id} md={3} lg={3} className="mb-4">
                                    <Card className="shadow-lg">
                                        {/* Image Section using Card.Img */}
                                        <Card.Img
                                            variant="top"
                                            // src={`http://localhost:8000/${product.Image[0]}`}
                                            src={`${product.Image[0]}`}
                                            alt={product.ProductName}
                                            className="img-fluid"  // Use img-fluid to ensure the image is responsive
                                            style={{
                                                objectFit: "contain",  // Ensures the image fits within the div without cropping
                                                height: "10rem",  // Fixed height for the image
                                                width: "100%",  // Ensures the image fills the width of the container
                                            }}
                                        />

                                        {/* Card Body Section */}
                                        <Card.Body>
                                            <Card.Title>{product.ProductName}</Card.Title>
                                            <Card.Text>${product.Price}</Card.Text>
                                            <Card.Text>{product.Description}</Card.Text>
                                            <Card.Text>{product.Rating}</Card.Text>
                                            <Button variant="primary" size="xl" style={{ width: '100%' }} onClick={() => handleViewProduct(product._id)}>View</Button>
                                        </Card.Body>
                                    </Card>


                                </Col>
                            ))
                        ) : (
                            <p className="text-center w-100 mt-3">No products available.</p>
                        )}
                    </Row>
                )}
            </Container>
        </motion.div>
    );
};

export default MyProducts;
