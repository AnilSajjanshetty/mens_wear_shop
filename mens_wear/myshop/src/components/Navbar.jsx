import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { useNavigate } from 'react-router-dom';
import config from "../../config"
const Navbar = () => {

  const navigate = useNavigate()
  const openRegisterModal = () => navigate("/register");
  const onLoginHandle = () => {
    navigate("/login")
    // window.location = config.server + "/authorize";
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark  fixed-top" style={{
        background: 'linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)', // Reversed gradient

        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adding soft shadow for depth
      }}>
        <div className="container-fluid">
          <div className="navbar-brand" style={{ lineHeight: '1' }}>
            <a className="fs-2 d-block text-white text-decoration-none text-shadow pb-1" href="#"
              style={{ textShadow: "5px 5px 5px rgba(0, 0, 0, 0.7)" }}>
              श्रद्धा मेन्स वेअर
            </a>
            <span className="fs-6 text-white ps-3">
              प्रो. प्रा. अमोल सज्जनशेट्टी
            </span>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#slider">
                  Slider
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#about">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#products">
                  Products
                </a>
              </li>
              <li className="nav-item">
                <button
                  // onClick={openLoginModal}
                  onClick={onLoginHandle}
                  className="btn btn-outline-light me-2"
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  onClick={openRegisterModal}
                  className="btn btn-light"
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {/* {showLoginModal && (
        <LoginModal
          closeModal={closeLoginModal}
          openRegisterModal={openRegisterModal}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          closeModal={closeRegisterModal}
          openLoginModal={openLoginModal}
        />
      )} */}
    </>
  );
};

export default Navbar;
