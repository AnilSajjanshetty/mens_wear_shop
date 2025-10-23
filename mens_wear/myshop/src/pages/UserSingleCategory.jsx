import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance";
import { motion } from 'framer-motion';
import config from '../../config';
import CustomerNavbar from "../components/CustomerNavbar";

const UserSingleCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const server = config.server;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(null);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get(`/get-products-by-category/${categoryId}`);
                setProducts(Array.isArray(response.data) ? response.data : [response.data] || []);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId, server]);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axiosInstance.get(`/fetch-category/${categoryId}`);
                setCategory(response.data);  // Set the category data
            } catch (err) {
                setError('Failed to fetch category details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId, server]);
    const handleBack = () => {
        navigate('/user/allcategory');
    };

    const handleViewProduct = (productId) => {
        navigate(`/user/product/${productId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff512f, #dd2476)', padding: '1.25rem' }}
        >
            <CustomerNavbar />
            <Container>
                <h2 className='text-white'>
                    <Button variant="secondary" className="me-2" onClick={handleBack}>
                        ←
                    </Button>
                    Category / {category?.categoryName}
                </h2>

                {loading && <p>Loading products...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && !error && products.length === 0 && (
                    <p className="text-center text-white mt-4">No products to show</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <Row className="mt-4">
                        {products.map((product, index) => (
                            <Col key={product._id} sm={12} md={4} lg={3} className="mb-4">
                                <Card className="h-100 shadow-lg" style={{ borderRadius: '20px' }}>
                                    <Card.Img variant="top" src={`http://localhost:8000/${product.Image[0]}`}
                                        alt={product.ProductName} style={{ objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', className: "img-fluid" }} />
                                    <Card.Body>
                                        <Card.Title>{product.productName}</Card.Title>
                                        <Card.Text>
                                            <strong>Description</strong> {product.Description}<br />
                                            <strong>Price:</strong> ${product.Price}<br />
                                            <strong>Stock:</strong> {product.Stock}
                                        </Card.Text>
                                        <Button variant="primary" style={{ width: '100%' }} onClick={() => handleViewProduct(product._id)}>View</Button>
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

export default UserSingleCategory;
