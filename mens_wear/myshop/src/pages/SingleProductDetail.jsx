import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Button, Container, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import config from "../../config";
import NavbarComponent from "../components/NavbarComponent";
import { FiPlus, FiMinus } from "react-icons/fi";

const SingleProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const server = config.server;
    const navigate = useNavigate();
    const role = localStorage.getItem('roleId');
    const userRoleId = Number(import.meta.env.VITE_USER_ROLE_ID);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axiosInstance.get(`/get-product/${productId}`);
                setProduct(response.data);
                setSelectedImage(response.data.Image[0]);
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
            const userId = Number(localStorage.getItem("userId"));
            await axiosInstance.post(`/add-cart`, {
                UserId: userId,
                ProductId: product._id,
                Quantity: quantity,
                OrderStatus: "Pending",
                DeliveryStatus: "Not Shipped",
                PaymentMethod: null,
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
            style={{ background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
        >
            <NavbarComponent />
            <Container>
                <Button variant="secondary" className="mb-3" onClick={handleBack}>
                    ← Back
                </Button>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
                    {/* Left Side: Images */}
                    <div style={{ flex: "1", maxWidth: "500px" }}>
                        <img
                            src={`http://localhost:8000/${selectedImage}`}
                            alt="Product"
                            style={{ width: "100%", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
                        />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", gap: "10px" }}>
                            {product.Image && product.Image.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8000/${image}`}
                                    alt="Thumbnail"
                                    style={{ width: "60px", height: "60px", cursor: "pointer", border: selectedImage === image ? "2px solid #ff512f" : "none" }}
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Product Details */}
                    <div style={{ flex: "1", minWidth: "300px" }}>
                        <h2 style={{ color: "white" }}>{product.productName}</h2>
                        <p style={{ fontSize: "1.2rem", color: "white" }}>{product.Description}</p>
                        <h3 style={{ color: "white" }}>${product.Price}</h3>
                        <p style={{ color: "white" }}>Category: {product.categoryName}</p>
                        <p style={{ color: "white" }}>{product.Stock} in stock</p>


                        {userRoleId == role && (
                            <div>
                                <Form.Group controlId="quantity">
                                    <Form.Label style={{ color: "white" }}>Quantity:</Form.Label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Button
                                            variant="light"
                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                            disabled={quantity === 1}
                                            style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "5px 10px" }}
                                        >
                                            <FiMinus />
                                        </Button>

                                        <span style={{ fontSize: "1.2rem", fontWeight: "bold", minWidth: "40px", textAlign: "center", color: "white" }}>
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
                                    variant="warning"
                                    className="mt-3"
                                    onClick={addToCart}
                                    disabled={addingToCart}
                                    style={{ width: "100%", padding: "10px", fontSize: "1.2rem" }}
                                >
                                    {addingToCart ? "Adding..." : "Add to Cart"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default SingleProductDetail;
