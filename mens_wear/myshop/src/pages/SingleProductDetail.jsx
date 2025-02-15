import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import config from "../../config";
import NavbarComponent from "../components/NavbarComponent";
import "./SingleProductsDetail.css"; // Ensure correct path
import { FiPlus, FiMinus } from "react-icons/fi";

const SingleProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1); // Order quantity state
    const server = config.server;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${server}/get-product/${productId}`);
                setProduct(response.data);
                setSelectedImage(response.data.Image[0]); // Set first image as default
            } catch (err) {
                setError("Failed to fetch product details");
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

    const addToCart = async () => {
        if (!product) return;

        if (quantity < 1 || quantity > product.Stock) {
            alert("Please select a valid quantity.");
            return;
        }

        setAddingToCart(true);

        try {
            const userId = Number(localStorage.getItem("userId")); // Replace with actual logged-in user ID
            const response = await axios.post(`${server}/add-cart`, {
                UserId: userId,
                ProductId: product._id,
                Quantity: quantity,  // Include quantity
                OrderStatus: "Pending",
                DeliveryStatus: "Not Shipped",
                PaymentMethod: null, // Since order is not confirmed yet
                PaymentStatus: "Pending",
            });

            alert("Product added to cart successfully!");
        } catch (err) {
            console.error("Failed to add product to cart", err);
            alert("Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) return <div>Loading product details...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;

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
                <Button variant="secondary" className="me-2" onClick={handleBack}>
                    ← Back
                </Button>
                <div className="single-product-container mt-4 " >
                    {/* Image Section */}
                    <div className="product-images">
                        {/* Small Thumbnails */}
                        <div className="image-gallery">
                            {product.Image &&
                                product.Image.map((image, index) => (
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
                                className="img-fluid main-product-image "
                            />
                        </div>
                        <h2 className="product-name">{product.productName}</h2>
                        <p className="product-description">{product.Description}</p>
                        <p className="product-price">${product.Price}</p>
                        <p className="product-category">{product.categoryName}</p>
                        <p className="product-stock">{product.Stock} in stock</p>

                        {/* Quantity Selector with Plus & Minus Icons */}
                        <Form.Group controlId="quantity">
                            <Form.Label>Quantity:</Form.Label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Button
                                    variant="light"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                    disabled={quantity === 1}
                                    style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px 10px" }}
                                >
                                    <FiMinus />
                                </Button>

                                <span style={{ fontSize: "1.2rem", fontWeight: "bold", minWidth: "40px", textAlign: "center" }}>
                                    {quantity}
                                </span>

                                <Button
                                    variant="light"
                                    onClick={() => setQuantity((prev) => Math.min(product.Stock, prev + 1))}
                                    disabled={quantity >= product.Stock}
                                    style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px 10px" }}
                                >
                                    <FiPlus />
                                </Button>
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="add-to-cart mt-3"
                            onClick={addToCart}
                            disabled={addingToCart} // Disable button while adding
                        >
                            {addingToCart ? "Adding..." : "Add to Cart"}
                        </Button>
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default SingleProductDetail;
