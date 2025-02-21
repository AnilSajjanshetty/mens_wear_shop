import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Form, Badge } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";
import config from '../../config';
import axiosInstance from '../utils/axiosInstance';

const AllCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState({});
    const server = config.server;

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axiosInstance.get(`/get-cart`);
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Error fetching cart data", error);
        }
    };

    const updateDeliveryStatus = async (cartId) => {
        try {
            setLoading(true);
            await axiosInstance.put(`/edit-cart/${cartId}`, { DeliveryStatus: selectedStatus[cartId] });
            fetchCart();
        } catch (error) {
            console.error("Error updating delivery status", error);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (cartId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            setLoading(true);

            // ✅ Updating OrderStatus instead of DeliveryStatus
            await axiosInstance.put(`/edit-cart/${cartId}`, { DeliveryStatus: "Cancelled" });

            fetchCart(); // ✅ Refresh cart data
        } catch (error) {
            console.error("Error canceling order", error);
        } finally {
            setLoading(false);
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
            }}>

            <NavbarComponent />
            <Container>
                <h2 className="text-center text-white mb-4">Orders list</h2>

                <Row className="d-flex flex-wrap justify-content-center">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <Col key={item.CartId} xs={12} sm={10} md={8} lg={6} className="mb-3">
                                <Card className="shadow-sm p-2 d-flex flex-md-row align-items-center"
                                    style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #ddd", background: "#ffffff" }}>

                                    {/* Image Section */}
                                    <div className="p-2 d-flex align-items-center justify-content-center bg-light"
                                        style={{ minWidth: "100px", minHeight: "100px", borderRadius: "8px" }}>
                                        <Image
                                            src={`http://localhost:8000/${item.ProductDetails?.Images[0]}` || "https://via.placeholder.com/150"}
                                            rounded
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <Card.Body className="p-2 w-100">
                                        <Card.Title className="mb-1">{item.ProductDetails?.Name || "Unknown Product"}</Card.Title>

                                        {/* Compact Product Details */}
                                        <Card.Text className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                                            💰 <strong>${item.ProductDetails?.Price}</strong> | 🏷 <strong>{item.ProductDetails?.Category}</strong> <br />
                                            📦 Stock: <strong>{item.ProductDetails?.Stock}</strong> | 🛒 Qty: <strong>{item.Quantity}</strong> <br />
                                            💵 Total: <strong className="text-dark">${item.ProductDetails?.Price * item.Quantity}</strong>
                                        </Card.Text>

                                        {/* Payment Info */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Payment:</strong>
                                                <Badge bg={item.PaymentStatus === "Paid" ? "success" : "warning"} className="ms-2">
                                                    {item.PaymentStatus}
                                                </Badge>
                                            </div>
                                            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                🏦 {item.PaymentMethod || "Cash on Delivery"}
                                            </div>
                                        </div>

                                        {/* User Info Row */}
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                👤 {item.User?.Name} <br />
                                                ✉ {item.User?.Email} <br />
                                                📍 {item.User?.Address}
                                            </div>

                                            {/* Status Dropdown */}
                                            <Form.Select
                                                size="sm"
                                                className="w-50"
                                                value={selectedStatus[item.CartId] || item.DeliveryStatus}
                                                onChange={(e) => setSelectedStatus({ ...selectedStatus, [item.CartId]: e.target.value })}
                                                disabled={loading}>
                                                <option value="Not Shipped">Not Shipped</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancel</option>
                                            </Form.Select>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex gap-2 mt-3">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="w-50"
                                                disabled={loading}
                                                onClick={() => updateDeliveryStatus(item.CartId)}
                                            >
                                                Update Status
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="w-50"
                                                disabled={loading}
                                                onClick={() => cancelOrder(item.CartId)}
                                            >
                                                Cancel Order
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-center text-muted">No items in the cart.</p>
                    )}
                </Row>
            </Container>
        </motion.div>
    );
};

export default AllCart;
