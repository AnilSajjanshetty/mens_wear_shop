import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "../components/NavbarComponent";

const AdminDashboard = () => {
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
