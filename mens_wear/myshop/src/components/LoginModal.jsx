import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ closeModal, openRegisterModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // To handle redirection after login

  const handleLogin = async (data) => {
    const urlParams = new URLSearchParams(window.location.search);
    const challenge = "anils";

    if (!challenge) {
      console.error("Login challenge is missing.");
      return;
    }

    const loginData = {
      email: data.email,
      password: data.password,
      login_challenge: challenge, // Pass the challenge here
    };


    try {
      const response = await axiosInstance.post('/login', loginData);

      const { roleId, } = response.data;

      if (roleId === 1) {
        // Admin
        navigate('/admin');
      } else if (roleId === 2) {
        // User
        navigate('/user');
      } else {
        // Handle unexpected roles
        console.error('Unknown role');
        closeModal();
      }

      closeModal(); // Close modal on successful login
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  const handleRegisterRedirect = () => {
    closeModal();
    openRegisterModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="modal-backdrop d-flex justify-content-center align-items-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1050,
      }}
    >
      <div
        className="modal-content shadow-lg p-4"
        style={{
          width: '400px',
          background: 'linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)', // Reversed gradient
          borderRadius: '15px',
          position: 'relative',
          color: '#333',
        }}
      >
        {/* Close Button */}
        <button
          className="btn-close position-absolute top-0 end-0 m-2"
          onClick={closeModal}
          style={{ backgroundColor: '#fff', borderRadius: '50%' }}
        ></button>

        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email ID</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Redirect to Register */}
        <p className="text-center mt-3">
          Don't have an account?{' '}
          <span
            className="text-primary cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={handleRegisterRedirect}
          >
            Register
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginModal;
