import React from 'react';

const ContactModal = ({ closeModal }) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div
          className="modal-content"
          style={{
            background: 'linear-gradient(135deg, #ff7f50,#ff1493, #8a2be2, #ff1493, #ff7f50)', // Reversed gradient            borderRadius: '8px', // Rounded corners for the modal
          }}
        >
          <button
            type="button"
            className="btn-close"
            onClick={closeModal}
            aria-label="Close"
            style={{
              color: '#ffffff', // White color for the close button
              border: 'none', // Remove default border
              fontSize: '1.5rem', // Larger close button
              transition: 'color 0.3s ease', // Smooth transition for color change
            }}
            onMouseEnter={(e) => e.target.style.color = '#ff4081'} // Light pink on hover
            onMouseLeave={(e) => e.target.style.color = '#ffffff'} // Revert back to white
          ></button>
          <div className="modal-header">
            <h5 className="modal-title" id="contactModalLabel" style={{ color: '#ffffff' }}>
              Contact Us
            </h5>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-control"
                  style={{ backgroundColor: '#ffffff', borderColor: '#2575fc' }} // Light blue borders
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-control"
                  style={{ backgroundColor: '#ffffff', borderColor: '#2575fc' }} // Light blue borders
                />
              </div>
              <div className="mb-3">
                <textarea
                  placeholder="Your Message"
                  className="form-control"
                  rows="4"
                  style={{ backgroundColor: '#ffffff', borderColor: '#2575fc' }} // Light blue borders
                ></textarea>
              </div>
              <button
                className="btn w-100"
                style={{
                  backgroundColor: 'green', // Teal color for the submit button
                  color: '#ffffff', // White text
                  borderColor: '#00bcd4', // Matching border color
                  padding: '10px', // Some padding for a more balanced look
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
