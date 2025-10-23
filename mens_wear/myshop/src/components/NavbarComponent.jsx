import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import "./NavbarComponent.css";
import axiosInstance from "../utils/axiosInstance";

const NavbarComponent = () => {
    const navbarVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    const buttonVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.3 },
        },
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    const response = await axiosInstance.post("/logout", {
                        token: refreshToken
                    });

                    if (response.status === 200) {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("roleId");

                        Swal.fire({
                            title: "Logged Out!",
                            text: "You have been successfully logged out.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });

                        navigate("/"); // Redirect to home/login page
                    } else {
                        Swal.fire({
                            title: "Logout Failed",
                            text: "Something went wrong. Please try again.",
                            icon: "error",
                        });
                    }
                } catch (error) {
                    console.error("Logout error:", error);
                    Swal.fire({
                        title: "Error",
                        text: "An unexpected error occurred. Please try again.",
                        icon: "error",
                    });
                }
            }
        });
    };

    return (
        <Navbar bg="dark" expand="lg" className="custom-navbar py-3 shadow">
            <Container>
                <Navbar.Brand href="/admin">Admin Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/admin/allproducts">Products</Nav.Link>
                        <Nav.Link href="/admin/allcategory">Categories</Nav.Link>
                        <Nav.Link href="/admin/allcustomers">Customers</Nav.Link>
                        <Nav.Link href="/admin/allcart">Orders</Nav.Link>
                        <Nav.Link href="/admin/allenquiry">Enquiries</Nav.Link>
                        <Nav.Link href="/admin/allfeedback">Feedbacks</Nav.Link>
                    </Nav>
                    <motion.button
                        className="btn btn-primary me-2"
                        variants={buttonVariants}
                        whileHover="hover"
                        onClick={() => navigate("/admin/profile")}
                    >
                        Profile
                    </motion.button>
                    <motion.button
                        className="btn btn-danger"
                        variants={buttonVariants}
                        whileHover="hover"
                        onClick={handleLogout}
                    >
                        Logout
                    </motion.button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
