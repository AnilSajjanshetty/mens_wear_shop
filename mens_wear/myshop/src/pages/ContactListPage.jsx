import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import NavbarComponent from "../components/NavbarComponent";

const ContactListPage = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const server = config.server;

    const fetchContacts = async () => {
        try {
            const response = await axios.get(`${server}/all-contacts`); // Adjust endpoint if needed
            setContacts(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching contacts:", err);
            setError("Failed to fetch contacts.");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);
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
                    <h2 className="text-center text-white mb-2"> Customer Enquiries</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    <Row>
                        {contacts.length === 0 ? (
                            <Col>
                                <p className="text-center">No contact messages available.</p>
                            </Col>
                        ) : (
                            contacts.map((contact) => (
                                <Col md={6} lg={4} key={contact._id} className="mb-4">
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Card.Title>{contact.name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                {contact.email}
                                            </Card.Subtitle>
                                            <Card.Text>
                                                <strong>Mobile:</strong> {contact.mobileNo} <br />
                                                <strong>Address:</strong> {contact.address} <br />
                                                <strong>Message:</strong> {contact.message}
                                            </Card.Text>
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

export default ContactListPage;
