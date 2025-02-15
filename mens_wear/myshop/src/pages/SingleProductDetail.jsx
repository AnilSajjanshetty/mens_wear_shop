import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import config from '../../config';
import NavbarComponent from '../components/NavbarComponent';
import './SingleProductsDetail.css';  // Ensure correct path

const SingleProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const server = config.server;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${server}/get-product/${productId}`);
                setProduct(response.data);
                setSelectedImage(response.data.Image[0]); // Set first image as default
            } catch (err) {
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) return <div>Loading product details...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff512f, #dd2476)', padding: '1.25rem' }}
        >
            <NavbarComponent />
            <Container>
                <Button variant="secondary" className="me-2" onClick={handleBack}>
                    ← Back
                </Button>
                <div className="single-product-container mt-4">
                    {/* Image Section */}
                    <div className="product-images">
                        {/* Small Thumbnails */}
                        <div className="image-gallery">
                            {product.Image && product.Image.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8000/${image}`}
                                    alt={`Product image ${index + 1}`}
                                    className="product-thumbnail"
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                        {/* Large Main Image */}
                        <div className="main-image-container">
                            <img
                                src={`http://localhost:8000/${selectedImage}`}
                                alt="Selected Product"
                                className="main-product-image"
                            />
                        </div>
                        <h2 className="product-name">{product.productName}</h2>
                        <p className="product-description">{product.Description}</p>
                        <p className="product-price">${product.Price}</p>
                        <p className="product-category">{product.categoryName}</p>
                        <p className="product-stock">{product.Stock} in stock</p>
                        <Button variant="primary" className="add-to-cart">Add to Cart</Button>
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default SingleProductDetail;
