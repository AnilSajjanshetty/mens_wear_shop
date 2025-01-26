import React, { useState } from 'react';
import ContactModal from './ContactModal';

const Footer = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  const openContactModal = () => setShowContactModal(true);
  const closeContactModal = () => setShowContactModal(false);

  return (
    <>
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p>&copy; 2025 Men's Wear Shop. All rights reserved.</p>
          <p>
            Designed and Developed by <strong>Compiler Technologies</strong>
          </p>
          <div className="row mt-3">
            <div className="col-md-6">
              <h6>Office Address</h6>
              <p>Pune, Maharashtra</p>
            </div>
            <div className="col-md-6">
              <h6>Shop Address</h6>
              <p>Ahmedpur, Latur, Maharashtra</p>
            </div>
          </div>
          <div className="mt-3">
            <a
              href="#"
              className="text-decoration-none text-white"
              onClick={(e) => {
                e.preventDefault();
                openContactModal();
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && <ContactModal closeModal={closeContactModal} />}
    </>
  );
};

export default Footer;
