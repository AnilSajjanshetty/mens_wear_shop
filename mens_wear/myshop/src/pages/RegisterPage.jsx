import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axiosInstance from "../utils/axiosInstance";
import { FaUserCircle } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

import FooterGuest from '../components/FooterGuest';
import NavbarGuest from '../components/NavBarGuest';
import config from '../../config';

const RegisterPage = ({ closeModal, openLoginModal }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleRegister = async (data) => {
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

      closeModal(); // Close modal on successful registration
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  const handleLoginRedirect = () => {
    closeModal();
    openLoginModal();
  };

  return (
    <>
      <NavbarGuest />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="d-flex justify-content-center align-items-center"
        style={{ width: '100%', background: 'linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)' }}
      >
        <div
          className="modal-content shadow-lg px-4 my-4"
          style={{
            width: '400px',
            background: 'linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)', // Reversed gradient
            borderRadius: '15px',
            position: 'relative',
            color: '#333',
          }}
        >
          <h2 className="text-center text-white mb-2">Register</h2>
          {/* Profile Image Upload */}
          <div className="text-center mb-3">
            <div className="position-relative mx-auto mb-2" style={{ width: "120px", height: "120px" }}>
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="rounded-circle" style={{ width: "100%", height: "100%" }} />
              ) : (
                <FaUserCircle size={120} className="text-muted" />
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
            {/* Name Field */}
            <div className="mb-1">
              <label className="form-label text-white">Name</label>
              <input type="text" className="form-control" placeholder="Enter your name" {...register('name', { required: 'Name is required' })} />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </div>

            {/* Email Field */}
            <div className="mb-1">
              <label className="form-label text-white">Email</label>
              <input type="email" className="form-control" placeholder="Enter email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </div>

            {/* Mobile Field */}
            <div className="mb-1">
              <label className="form-label text-white">Mobile Number</label>
              <input type="text" className="form-control" placeholder="Enter your mobile number" {...register('mobile', { required: 'Mobile number is required' })} />
              {errors.mobile && <small className="text-danger">{errors.mobile.message}</small>}
            </div>

            {/* Address Field */}
            <div className="mb-1">
              <label className="form-label text-white">Address</label>
              <input type="text" className="form-control" placeholder="Enter your address" {...register('address', { required: 'Address is required' })} />
              {errors.address && <small className="text-danger">{errors.address.message}</small>}
            </div>

            {/* Password Field */}
            <div className="mb-1">
              <label className="form-label text-white">Password</label>
              <input type="password" className="form-control" placeholder="Enter password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <small className="text-danger">{errors.password.message}</small>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-2">
              <label className="form-label text-white">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Confirm password" {...register('confirmPassword', { required: 'Confirm your password' })} />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>

          {/* Redirect to Login */}
          <p className="text-center text-white mt-3">
            Already have an account?{' '}
            <span className="text-primary" style={{ cursor: 'pointer' }} onClick={handleLoginRedirect}>Login</span>
          </p>
        </div>
      </motion.div>
      <FooterGuest />
    </>
  );
};

export default RegisterPage;
