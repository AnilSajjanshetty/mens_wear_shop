import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./NavbarComponent.css"; // Import styles

const CustomerNavbar = () => {

    const buttonVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.3 },
        },
    };
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            const response = await fetch("http://localhost:8000/api/v1/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: refreshToken }),
            });

            if (response.ok) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userId");
                localStorage.removeItem("roleId");
                navigate("/"); // Redirect to home/login page
            } else {
                alert("Logout failed, please try again!");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Navbar expand="lg" className="custom-navbar py-3 shadow">
                <Container>
                    <Navbar.Brand href="/user" className="fw-bold text-white">
                        User Dashboard
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/user/products" className="text-white fw-semibold">
                                Products
                            </Nav.Link>  <Nav.Link href="/user/allcategory" className="text-white fw-semibold">
                                Categories
                            </Nav.Link>
                            <Nav.Link href="/user/mycart" className="text-white fw-semibold">
                                My Cart
                            </Nav.Link>
                        </Nav>
                        <motion.button
                            className="btn btn-primary me-2"
                            variants={buttonVariants}
                            whileHover="hover"
                            onClick={() => alert("Navigating to Profile...")}
                        >
                            Profile
                        </motion.button>
                        <motion.button
                            className="btn btn-danger fw-bold"
                            whileHover={{ scale: 1.1 }}
                            onClick={handleLogout}
                        >
                            Logout
                        </motion.button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </motion.div>
    );
};

export default CustomerNavbar;
