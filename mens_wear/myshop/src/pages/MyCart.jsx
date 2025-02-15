import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, Image, Badge } from "react-bootstrap";
import CustomerNavbar from "../components/CustomerNavbar";
import { motion } from "framer-motion";
import axios from "axios";
import config from "../../config";

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCartId, setSelectedCartId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const server = config.server;

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const userId = Number(localStorage.getItem("userId"));
        try {
            const response = await axios.get(`${server}/get-cart/${userId}`);
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Error fetching cart data", error);
        }
    };

    const handleConfirmOrder = (cartId) => {
        setSelectedCartId(cartId);
        setShowModal(true);
    };

    const confirmOrder = async () => {
        try {
            setLoading(true);
            await axios.put(`${server}/confirm-cart/${selectedCartId}`, {
                OrderStatus: "Confirmed",
                PaymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
                PaymentMethod: paymentMethod,
                TransactionId: paymentMethod === "Cash on Delivery" ? null : transactionId,
            });
            setShowModal(false);
            fetchCart();
        } catch (error) {
            console.error("Error confirming order", error);
        } finally {
            setLoading(false);
        }
    };


    const cancelOrder = async (cartId) => {
        try {
            setLoading(true);
            await axios.put(`${server}/edit-cart/${cartId}`, {
                OrderStatus: "Cancelled",
                PaymentStatus: "Refunded",
                TransactionId: null,
            });
            fetchCart();
        } catch (error) {
            console.error("Error cancelling order", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
        >
            <CustomerNavbar />
            <Container className="text-white mt-5">
                <h2 className="mb-4">My Cart</h2>
                <Row>
                    {cartItems.map((item) => (
                        <Col key={item.CartId} md={6} lg={6}>
                            <Card className="mb-4 shadow-lg">
                                <Row className="g-0">
                                    {/* Left: Image */}
                                    <Col md={4} className="d-flex align-items-center">
                                        <Image
                                            src={item.Images?.[0] ? `http://localhost:8000/${item.Images[0]}` : "/placeholder.jpg"}
                                            alt={item.ProductName}
                                            fluid
                                            className="rounded-start"
                                            style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
                                        />
                                    </Col>

                                    {/* Right: Product Details */}
                                    <Col md={8}>
                                        <Card.Body>
                                            <Card.Title>{item.ProductName}</Card.Title>
                                            <Card.Text>
                                                💰 <strong>${item.Price}</strong> <br />
                                                📦 Quantity: <strong>{item.Quantity}x</strong> <br />
                                                🏷Order Status:{" "}
                                                <Badge bg={item.OrderStatus === "Confirmed" ? "success" : "warning"}>
                                                    {item.OrderStatus}
                                                </Badge>{" "}
                                                <br />
                                                {item.OrderStatus === "Confirmed" && (
                                                    <>
                                                        🚚 Delivery Status: <Badge bg="info">{item.DeliveryStatus}</Badge> <br />
                                                        💳 Payment Method: <strong>{item.PaymentMethod}</strong> <br />
                                                    </>
                                                )}
                                                🏦 Payment Status:
                                                <Badge bg={item.PaymentStatus === "Paid" ? "success" : "warning"}>
                                                    {item.PaymentStatus}
                                                </Badge>
                                            </Card.Text>

                                            {/* Buttons for Order Actions */}
                                            {item.OrderStatus === "Pending" ? (
                                                <Button variant="success" onClick={() => handleConfirmOrder(item.CartId)}>
                                                    Confirm Order
                                                </Button>
                                            ) : item.OrderStatus === "Confirmed" ? (
                                                <Button variant="danger" onClick={() => cancelOrder(item.CartId)}>
                                                    Cancel Order
                                                </Button>
                                            ) : item.OrderStatus === "Cancelled" ? (
                                                <Badge bg="danger">Order Cancelled</Badge>
                                            ) : null}
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Order Confirmation Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Select onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="">Select Payment Method</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Cash on Delivery">Cash on Delivery</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Transaction ID</Form.Label>
                            <Form.Control
                                type="text"
                                disabled={paymentMethod === "Cash on Delivery"}
                                onChange={(e) => setTransactionId(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>

                        <Button disabled={loading} onClick={confirmOrder}>
                            {loading ? "Processing..." : "Confirm"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </motion.div>
    );
};

export default MyCart;
