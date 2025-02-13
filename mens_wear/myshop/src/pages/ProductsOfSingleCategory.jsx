import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import config from '../../config';
import NavbarComponent from '../components/NavbarComponent';

const ProductsOfSingleCategory = () => {
    const { categoryId, categoryName } = useParams();
    const navigate = useNavigate();
    const server = config.server;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${server}/get-products-by-category/${categoryId}`);
                setProducts(Array.isArray(response.data) ? response.data : [response.data] || []);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId, server]);

    const handleBack = () => {
        navigate('/admin/allcategory');
    };

    const handleViewProduct = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff512f, #dd2476)', padding: '1.25rem' }}
        >
            <NavbarComponent />
            <Container>
                <h2 className='text-white'>
                    <Button variant="secondary" className="me-2" onClick={handleBack}>
                        ←
                    </Button>
                    Category / {categoryName}
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
                                        <Button variant="primary" onClick={() => handleViewProduct(product._id)}>View</Button>
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

export default ProductsOfSingleCategory;
