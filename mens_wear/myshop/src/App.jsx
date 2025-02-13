import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AllProducts from './pages/AllProducts';
import AllCategory from './pages/AllCategory';
import AllCustomers from './pages/AllCustomers';
import AllCart from './pages/AllCart';
import UserDashboard from './pages/UserDashboard';
import MyProducts from './pages/MyProducts';
import MyCart from './pages/MyCart';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductsOfSingleCategory from './pages/ProductsOfSingleCategory';

function App() {
  // Access the roleIds from environment variables defined in .env
  const adminRoleId = Number(import.meta.env.VITE_ADMIN_ROLE_ID); // 1
  const userRoleId = Number(import.meta.env.VITE_USER_ROLE_ID); // 3

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes for Admin (roleId = 1) */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={[adminRoleId]} />} />
        <Route path="/admin/allproducts" element={<ProtectedRoute element={<AllProducts />} allowedRoles={[adminRoleId]} />} />
        <Route path="/admin/allcategory" element={<ProtectedRoute element={<AllCategory />} allowedRoles={[adminRoleId]} />} />
        <Route path="/admin/allcustomers" element={<ProtectedRoute element={<AllCustomers />} allowedRoles={[adminRoleId]} />} />
        <Route path="/admin/allcart" element={<ProtectedRoute element={<AllCart />} allowedRoles={[adminRoleId]} />} />
        <Route path="/admin/category/:categoryId" element={<ProtectedRoute element={<ProductsOfSingleCategory />} allowedRoles={[adminRoleId]} />} />

        {/* Protected Routes for User (roleId = 3) */}
        <Route path="/user" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={[userRoleId]} />} />
        <Route path="/user/products" element={<ProtectedRoute element={<MyProducts />} allowedRoles={[userRoleId]} />} />
        <Route path="/user/mycart" element={<ProtectedRoute element={<MyCart />} allowedRoles={[userRoleId]} />} />
      </Routes>
    </Router>
  );
}

export default App;
