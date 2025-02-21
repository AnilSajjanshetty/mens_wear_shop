import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";
import config from "../../config";
import { FaUserCircle } from "react-icons/fa"; // Default profile icon
import { FiUpload } from "react-icons/fi"; // Upload icon
import CustomerNavbar from "../components/CustomerNavbar";

const UserProfilePage = () => {
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
                const response = await axiosInstance.get(`/get-customer/${userId}`);
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

            const response = await axiosInstance.put(`/edit-customer/${userId}`, formData, {
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
                background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                padding: "1.25rem",
            }}
        >
            <CustomerNavbar />
            <Container className="text-white mt-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {userProfile ? (
                            <Card className="shadow-lg p-4 text-center rounded-4 border-0" style={{ background: "#fff", color: "#333" }}>
                                {/* Profile Image */}
                                <div className="position-relative mx-auto mb-3" style={{ width: "140px", height: "140px" }}>
                                    {userProfile.Image ? (
                                        <motion.img
                                            src={`http://localhost:8000/${userProfile.Image}`}
                                            alt="Profile"
                                            className="rounded-circle border border-2 shadow"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            whileHover={{ scale: 1.1 }}
                                        />
                                    ) : (
                                        <FaUserCircle size={140} className="text-muted" />
                                    )}
                                </div>

                                <Card.Body>
                                    {editing ? (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Profile Picture</Form.Label>
                                                <div className="d-flex align-items-center justify-content-center border rounded p-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="d-none"
                                                        id="fileUpload"
                                                    />
                                                    <label htmlFor="fileUpload" className="btn btn-outline-primary d-flex align-items-center">
                                                        <FiUpload className="me-2" /> Upload Image
                                                    </label>
                                                    {selectedFile && <span className="ms-2">{selectedFile.name}</span>}
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    value={updatedProfile.userName}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="Email"
                                                    value={updatedProfile.Email}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Mobile Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="MobileNo"
                                                    value={updatedProfile.MobileNo}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Address</Form.Label>
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
                                            <Button variant="outline-secondary" className="ms-2" onClick={() => setEditing(false)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Card.Title className="fw-bold fs-4">{userProfile.userName}</Card.Title>
                                            <Card.Subtitle className="mb-3 text-muted">{userProfile.Email}</Card.Subtitle>
                                            <Card.Text className="fw-medium">
                                                <strong>📞 Mobile:</strong> {userProfile.MobileNo} <br />
                                                <strong>🏠 Address:</strong> {userProfile.Address}
                                            </Card.Text>
                                            <motion.button
                                                className="btn btn-warning"
                                                onClick={() => setEditing(true)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Edit Profile
                                            </motion.button>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        ) : (
                            <p className="text-center fs-5">Loading profile...</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default UserProfilePage;
