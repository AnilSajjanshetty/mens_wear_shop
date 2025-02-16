import React, { useState } from "react";
import axios from "axios";
import config from "../../config";

const ContactModal = ({ closeModal }) => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: ""
  });
  const [message, setMessage] = useState("");
  const server = config.server;

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const submitContact = async () => {
    try {
      const contactData = { ...contact, message };
      await axios.post(`${server}/add-contact`, contactData);
      alert("Contact message submitted successfully!");
      closeModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting contact message:", error);
      alert("Failed to submit message. Please try again.");
    }
  };

  const modalStyle = {
    background: "linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)",
    borderRadius: "8px",
    color: "#fff",
    padding: "20px"
  };

  return (
    // Using "modal show d-block" to force display via React state
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={modalStyle}>
          <div className="modal-header">
            <h5 className="modal-title">Contact Us</h5>
            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Name</label>
            <input
              className="form-control mb-2"
              name="name"
              placeholder="Your Name"
              value={contact.name}
              onChange={handleContactChange}
            />

            <label className="form-label">Email</label>
            <input
              className="form-control mb-2"
              name="email"
              type="email"
              placeholder="Your Email"
              value={contact.email}
              onChange={handleContactChange}
            />

            <label className="form-label">Mobile Number</label>
            <input
              className="form-control mb-2"
              name="mobileNo"
              placeholder="Mobile Number"
              value={contact.mobileNo}
              onChange={handleContactChange}
            />

            <label className="form-label">Address</label>
            <input
              className="form-control mb-2"
              name="address"
              placeholder="Your Address"
              value={contact.address}
              onChange={handleContactChange}
            />

            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={closeModal}>
              Close
            </button>
            <button type="button" className="btn btn-warning" onClick={submitContact}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
