import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";
import axios from 'axios';

const AllCustomers = () => {
    const [customers, setCustomers] = useState([]);

    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    // Fetch customers from the API
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/get-customer');
                setCustomers(response.data || []);
            } catch (error) {
                console.error("Error fetching customers", error);
            }
        };

        fetchCustomers();
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
        >
            <NavbarComponent />
            <Container>
                <h2 className="text-center mb-4">Manage Customers</h2>
                <Row>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <Col key={customer._id} xs={12} sm={6} md={4} lg={3} className="mb-5 mt-5">
                                <Card style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Image or SVG half inside, half outside */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-70px', // Adjust top positioning to move it higher and prevent overlap
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '5px solid white', // White border for separation
                                        boxShadow: '0 8px 8px rgba(0, 0, 0, 0.2)', // Optional shadow for better visibility
                                        backgroundColor: "white",
                                        padding: "5px"
                                    }}>
                                        {customer.imageUrl ? (
                                            <Image
                                                src={customer.imageUrl}
                                                roundedCircle
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Customer details */}
                                    <Card.Body style={{ marginTop: '80px' }} className="text-center"> {/* Increased marginTop for spacing */}
                                        <Card.Title>{customer.userName || 'No Name'}</Card.Title>
                                        <Card.Text>
                                            <strong>Email:</strong> {customer.Email || 'No Email'}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Phone:</strong> {customer.MobileNo || 'No Phone'}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Address:</strong> {customer.Address || 'No Address'}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No customers found.</p>
                    )}
                </Row>
            </Container>
        </motion.div>
    );
};

export default AllCustomers;
