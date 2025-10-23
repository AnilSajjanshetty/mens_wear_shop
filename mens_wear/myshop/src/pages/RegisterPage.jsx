import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";
import { FaUserCircle } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

import FooterGuest from "../components/FooterGuest";
import NavbarGuest from "../components/NavBarGuest";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const password = watch("password"); // Watching password field for validation

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setValue("mobile", value);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setValue("name", value);
  };

  const handleRegister = async (data) => {

    const isValid = await trigger();
    if (!isValid) return;

    try {
      const formData = new FormData();
      formData.append("userName", data.name);
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("MobileNo", data.mobile);
      formData.append("Address", data.address);
      if (selectedFile) {
        formData.append("Image", selectedFile);
      }

      await axiosInstance.post(`/register-customer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Registration successful!", "success");

      reset();
      setSelectedFile(null);
      setPreviewImage(null);

      setTimeout(() => {
        navigate("/login"); // Redirect after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      Swal.fire("Error", error.response?.data?.error || "An unexpected error occurred.", "error");
    }
  };

  return (
    <>
      <NavbarGuest />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)",
        }}
      >
        <div
          className="modal-content shadow-lg px-4 my-4"
          style={{
            width: "400px",
            background: "linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)",
            borderRadius: "15px",
            position: "relative",
            color: "#333",
          }}
        >
          <h2 className="text-center text-white mb-2">Register</h2>

          <div className="text-center mb-3">
            <div className="position-relative mx-auto mb-2" style={{ width: "7.5rem", height: "7.5rem" }}>
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="rounded-circle" style={{ width: "100%", height: "100%" }} />
              ) : (
                <FaUserCircle size={120} className=" text-white" />
              )}
            </div>
            <div className="d-flex justify-content-center">
              <input type="file" accept="image/*" onChange={handleFileChange} className="d-none" id="fileUpload" />
              <label htmlFor="fileUpload" className="btn btn-outline-light d-flex align-items-center">
                <FiUpload className="me-2" /> Upload Image
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="mb-1">
              <label className="form-label text-white">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                onChange={handleNameChange}
              />
              {errors.name && <small className="text-white">{errors.name.message}</small>}
            </div>

            <div className="mb-1">
              <label className="form-label text-white">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" } })}
              />
              {errors.email && <small className="text-white">{errors.email.message}</small>}
            </div>

            <div className="mb-1">
              <label className="form-label text-white">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your mobile number"
                {...register("mobile", { required: "Mobile number is required", minLength: { value: 10, message: "Must be 10 digits" }, maxLength: { value: 10, message: "Must not be more than 10 digits" } })}
                onChange={handleMobileChange}
              />
              {errors.mobile && <small className="text-white">{errors.mobile.message}</small>}
            </div>

            {/* Address Field */}
            <div className="mb-1">
              <label className="form-label text-white">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your address"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <small className="text-white">{errors.address.message}</small>}
            </div>

            {/* Password Field */}
            <div className="mb-1">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Must include uppercase, lowercase, number & special character",
                  },
                })}
              />
              {errors.password && <small className="text-white">{errors.password.message}</small>}
            </div>

            <div className="mb-2">
              <label className="form-label text-white">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && <small className="text-white">{errors.confirmPassword.message}</small>}
            </div>

            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>



          <p className="text-center text-white mt-3">
            Already have an account?{" "}
            <span
              className="text-white"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>

          </p>
        </div>
      </motion.div>
      <FooterGuest />
    </>
  );
};

export default RegisterPage;
