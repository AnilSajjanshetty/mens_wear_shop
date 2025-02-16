import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import NavbarComponent from "../components/NavbarComponent";

const FeedbackListPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [error, setError] = useState(null);
    const server = config.server;

    const fetchFeedback = async () => {
        try {
            const response = await axios.get(`${server}/all-feedbacks`); // Adjust endpoint if needed
            setFeedbackList(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setError("Failed to fetch feedback.");
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const deleteFeedback = async (feedbackId) => {
        try {
            await axios.delete(`${server}/delete-feedback/${feedbackId}`);
            alert("Feedback deleted successfully!");
            fetchFeedback(); // Refresh list after deletion
        } catch (err) {
            console.error("Error deleting feedback:", err);
            alert("Failed to delete feedback.");
        }
    };
    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={navbarVariants}
                style={{
                    minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem",
                }}
            >
                <NavbarComponent />
                <Container className="text-black mt-3">
                    <h2 className="text-center text-white mb-2">Customer Feedback</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    <Row>
                        {feedbackList.length === 0 ? (
                            <Col>
                                <p className="text-center">No feedback available.</p>
                            </Col>
                        ) : (
                            feedbackList.map((item) => (
                                <Col md={6} lg={4} key={item._id} className="mb-4">
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Card.Title>User ID: {item.userId}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                Rating: {item.rating}
                                            </Card.Subtitle>
                                            <Card.Text>{item.feedback}</Card.Text>
                                            <Button variant="danger" onClick={() => deleteFeedback(item._id)}>
                                                Delete
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Container>
            </motion.div>
        </>
    );
};

export default FeedbackListPage;
