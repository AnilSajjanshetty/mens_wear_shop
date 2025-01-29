import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import NavbarGuest from '../components/NavBarGuest';
import FooterGuest from '../components/FooterGuest';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // To handle redirection after login

  const handleLogin = async (data) => {
    const urlParams = new URLSearchParams(window.location.search);
    const challenge = "anils"; // Replace this with actual logic if needed

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
      const response = await axios.post('http://192.168.68.231:8000/api/v1/login', loginData);
      console.log('Login successful:', response.data);

      // Store the access token and role in localStorage
      const { access_token, userId, roleId, roleDetails } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('roleId', roleId);
      localStorage.setItem('roleDetails', JSON.stringify(roleDetails));

      // Redirect user based on their role
      if (roleId === 1) {
        // Admin
        navigate('/admin');
      } else if (roleId === 2) {
        // User
        navigate('/user');
      } else {
        // Handle unexpected roles
        console.error('Unknown role');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  const redirectToRegister = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
   <> 
   <NavbarGuest/>
   <motion.div
   initial={{ opacity: 0, scale: 0.95 }}
   animate={{ opacity: 1, scale: 1 }}
   exit={{ opacity: 0, scale: 0.95 }}
   className="d-flex justify-content-center align-items-center"
   style={{
    minHeight:"80vh",
    background: 'linear-gradient(0deg, #ff7f50,  #ff1493, #ff7f50)',
     padding: '20px',
   }}
 >
   <div
     className="shadow-lg p-4"
     style={{
       width: '400px',
       background: 'linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)',
       borderRadius: '15px',
       color: '#333',
     }}
   >
     <h2 className="text-center text-white  mb-4">Login</h2>
     <form onSubmit={handleSubmit(handleLogin)}>
       {/* Email Field */}
       <div className="mb-3">
         <label className="form-label text-white">Email ID</label>
         <input
           type="email"
           className={`form-control ${errors.email ? 'is-invalid' : ''}`}
           placeholder="Enter email"
           {...register('email', { required: 'Email is required' })}
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
           className={`form-control ${errors.password ? 'is-invalid' : ''}`}
           placeholder="Enter password"
           {...register('password', { required: 'Password is required' })}
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
       Don't have an account?{' '}
       <span
         className="text-primary text-white"
         style={{ cursor: 'pointer' }}
         onClick={redirectToRegister}
       >
         Register
       </span>
     </p>
   </div>
 </motion.div>
 <FooterGuest/>
 </>
  );
};



export default LoginPage;
