import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import NavbarGuest from "../components/NavBarGuest";
import FooterGuest from "../components/FooterGuest";
import config from "../../config";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // To handle redirection after login
  const server = config.server;
  const admin = config.admin;
  const user = config.user;

  const handleLogin = async (data) => {
    try {
      const response = await axiosInstance.post(`/login`, data);

      // Store the access token and role in localStorage
      const { accessToken, userId, roleId, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("roleId", roleId);

      // Show Swal success message before redirecting
      Swal.fire({
        title: "Login Successful!",
        text: "You have logged in successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect user based on their role
      setTimeout(() => {
        if (roleId == admin) {
          navigate("/admin/allproducts");
        } else if (roleId == user) {
          navigate("/user/products");
        } else {
          console.error("Unknown role");
        }
      }, 2000); // Delay redirect to allow Swal message to be seen
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      // Show Swal error message
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials, please try again.",
        icon: "error",
      });
    }
  };

  const redirectToRegister = () => {
    navigate("/register"); // Navigate to the register page
  };

  return (
    <>
      <NavbarGuest />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "80vh",
          background: "linear-gradient(0deg, #ff7f50, #ff1493, #ff7f50)",
          padding: "20px",
        }}
      >
        <div
          className="shadow-lg p-4"
          style={{
            width: "400px",
            background:
              "linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)",
            borderRadius: "15px",
            color: "#333",
          }}
        >
          <h2 className="text-center text-white mb-4">Login</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label text-white">Email ID</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <small className="text-white">{errors.email.message}</small>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <small className="text-white">{errors.password.message}</small>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          {/* Redirect to Register */}
          <p className="text-center mt-3 text-white">
            Don't have an account?{" "}
            <span
              className="text-primary text-white"
              style={{ cursor: "pointer" }}
              onClick={redirectToRegister}
            >
              Register
            </span>
          </p>
        </div>
      </motion.div>
      <FooterGuest />
    </>
  );
};

export default LoginPage;
