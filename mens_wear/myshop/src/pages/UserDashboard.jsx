import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Navbar, Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import '../components/NavbarComponent.css';
import CustomerNavbar from "../components/CustomerNavbar";
import MainFooter from "../components/MainFooter";

const UserDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

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

  // Logout Functionality
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken"); // Get stored refresh token

      const response = await fetch("http://localhost:8000/api/v1/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }), // Send refresh token for logout
      });

      if (response.ok) {
        localStorage.removeItem("access_token"); // Remove tokens from storage
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem" }}
    >
      <CustomerNavbar />
      {/* <Navbar bg="dark" expand="lg" className="custom-navbar py-3 shadow">
        <Container>
          <Navbar.Brand href="#home">User Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#products">Products</Nav.Link>
              <Nav.Link href="#cart">Cart</Nav.Link>
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
              className="btn btn-danger"
              variants={buttonVariants}
              whileHover="hover"
              onClick={handleLogout} // Call logout function
            >
              Logout
            </motion.button>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <Container className="text-white mt-5">
        <h1 className="text-center">Welcome to the User Dashboard</h1>
        <p className="text-center mt-3">
          Browse products, add items to your cart, and enjoy shopping!
        </p>
      </Container>
      <MainFooter />
    </motion.div>
  );
};

export default UserDashboard;
