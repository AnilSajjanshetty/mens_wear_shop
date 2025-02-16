import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import config from "../../config";
import { FaUserCircle } from "react-icons/fa"; // Default profile icon
import CustomerNavbar from "../components/CustomerNavbar";
import NavbarComponent from "../components/NavbarComponent";

const AdminProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    const server = config.server;
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${server}/get-customer/${userId}`);
                setUserProfile(response.data);
                setUpdatedProfile(response.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to fetch user profile.");
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("userName", updatedProfile.userName);
            formData.append("Email", updatedProfile.Email);
            formData.append("MobileNo", updatedProfile.MobileNo);
            formData.append("Address", updatedProfile.Address);
            if (selectedFile) {
                formData.append("Image", selectedFile);
            }

            const response = await axios.put(`${server}/edit-customer/${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUserProfile(response.data);
            setEditing(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ff512f, #dd2476)",
                padding: "1.25rem",
            }}
        >
            <NavbarComponent />
            <Container className="text-black mt-5">
                <Row className="justify-content-center mt-5">
                    <Col md={6}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {userProfile ? (
                            <Card className="shadow-sm text-center p-4">
                                {/* Profile Image */}
                                {userProfile.Image ? (
                                    <img
                                        src={`http://localhost:8000/${userProfile.Image}`}
                                        alt="Profile"
                                        className="rounded-circle mb-3"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <FaUserCircle size={120} className="text-muted mb-3" />
                                )}

                                <Card.Body>
                                    {editing ? (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Profile Picture</Form.Label>
                                                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    value={updatedProfile.userName}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="Email"
                                                    value={updatedProfile.Email}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Mobile Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="MobileNo"
                                                    value={updatedProfile.MobileNo}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="Address"
                                                    value={updatedProfile.Address}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                            <Button variant="success" onClick={handleUpdateProfile} disabled={loading}>
                                                {loading ? "Updating..." : "Save Changes"}
                                            </Button>
                                            <Button variant="secondary" className="ms-2" onClick={() => setEditing(false)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Card.Title>{userProfile.userName}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{userProfile.Email}</Card.Subtitle>
                                            <Card.Text>
                                                <strong>Mobile:</strong> {userProfile.MobileNo} <br />
                                                <strong>Address:</strong> {userProfile.Address}
                                            </Card.Text>
                                            <Button variant="warning" onClick={() => setEditing(true)}>Edit Profile</Button>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        ) : (
                            <p className="text-center">Loading profile...</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default AdminProfilePage;
