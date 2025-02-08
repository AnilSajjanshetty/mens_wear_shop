
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NavbarCollapse } from 'react-bootstrap';
import FooterGuest from '../components/FooterGuest';
import NavbarGuest from '../components/NavBarGuest';

const RegisterPage = ({ closeModal, openLoginModal }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const handleRegister = async (data) => {
    try {
      const response = await axios.post('http://192.168.223.231:8000/api/v1/register-customer', {
        userName: data.name,
        Email: data.email,
        Password: data.password,
        MobileNo: data.mobile,
        Address: data.address,
      });
      console.log('Registration successful:', response.data);
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
        className=" d-flex justify-content-center align-items-center"
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)',
          zIndex: 1050,
        }}
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
          <form onSubmit={handleSubmit(handleRegister)}>
            {/* Name Field */}
            <div className="mb-1">
              <label className="form-label text-white">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter your name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <small className="text-danger">{errors.name.message}</small>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-1">
              <label className="form-label text-white">Email ID</label>
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
            {/* Mobile Number Field */}
            <div className="mb-1">
              <label className="form-label text-white">Mobile Number</label>
              <input
                type="text"
                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                placeholder="Enter your mobile number"
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit mobile number',
                  },
                })}
              />
              {errors.mobile && (
                <small className="text-danger">{errors.mobile.message}</small>
              )}
            </div>

            {/* Address Field */}
            <div className="mb-1">
              <label className="form-label text-white">Address</label>
              <input
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="Enter your address"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && (
                <small className="text-danger">{errors.address.message}</small>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-1">
              <label className="form-label text-white">Password</label>
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

            {/* Confirm Password Field */}
            <div className="mb-2">
              <label className="form-label text-white">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm password"
                {...register('confirmPassword', {
                  required: 'Confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword.message}</small>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>

          {/* Redirect to Login */}
          <p className="text-center text-white mt-3">
            Already have an account?{' '}
            <span
              className="text-primary cursor-pointer text-white"
              style={{ cursor: 'pointer' }}
              onClick={handleLoginRedirect}
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
