import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";


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
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #11998e, #38ef7d)" }}
    >
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow">
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
              onClick={() => alert("Logging out...")}
            >
              Logout
            </motion.button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="text-white mt-5">
        <h1 className="text-center">Welcome to the User Dashboard</h1>
        <p className="text-center mt-3">
          Browse products, add items to your cart, and enjoy shopping!
        </p>
      </Container>
    </motion.div>
  );
};

export default UserDashboard;