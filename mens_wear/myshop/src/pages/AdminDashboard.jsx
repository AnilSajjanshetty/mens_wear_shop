import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";

const AdminDashboard = () => {
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
  const navigate = useNavigate()
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
        <Container className="text-black mt-5">
          <h1 className="text-center">Welcome to the Admin Dashboard</h1>
          <p className="text-center mt-3">
            Manage products, categories, orders, and customers seamlessly.
          </p>
        </Container>
      </motion.div>
    </>
  );
};

export default AdminDashboard;
