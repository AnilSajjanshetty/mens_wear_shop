import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";
import axios from 'axios';

const AllCart = () => {
    const [cartItems, setCartItems] = useState([]);

    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/get-cart');
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Error fetching cart data", error);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
        >
            <NavbarComponent />
            <Container>
                <h2 className="text-center text-white mb-4">Manage Orders</h2>
                <Row>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <Col key={item._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <Card className="shadow-sm p-3" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                    <div style={{ position: "relative", textAlign: "center" }}>
                                        <Image
                                            src={item.imageUrl || "https://via.placeholder.com/150"}
                                            rounded
                                            fluid
                                            style={{ width: "100%", height: "180px", objectFit: "cover" }}
                                        />
                                    </div>
                                    <Card.Body className="text-center">
                                        <Card.Title className="mb-2">{item.productName || "Unknown Product"}</Card.Title>
                                        <Card.Text>
                                            <strong>Price:</strong> ${item.price} <br />
                                            <strong>Quantity:</strong> {item.quantity} <br />
                                            <strong>Total:</strong> ${item.price * item.quantity}
                                        </Card.Text>
                                        <Button variant="danger" size="sm">Remove</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-center text-white">No items in the cart.</p>
                    )}
                </Row>
            </Container>
        </motion.div>
    );
};

export default AllCart;
