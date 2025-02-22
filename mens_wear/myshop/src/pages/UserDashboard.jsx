import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Navbar, Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import '../components/NavbarComponent.css';
import CustomerNavbar from "../components/CustomerNavbar";
import MainFooter from "../components/MainFooter";

const UserDashboard = () => {

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



  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem"
      }}
    >
      <CustomerNavbar />
      <Container className="text-white mt-5 flex-grow-1" >
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
