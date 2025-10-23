import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axiosInstance";

const ContactModal = ({ closeModal }) => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  const validateInput = () => {
    if (!contact.name || contact.name.trim().length < 3 || contact.name.length > 50) {
      return "Name must be between 3 and 50 characters.";
    }
    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      return "Enter a valid email address.";
    }
    if (!contact.mobileNo || !/^\d{10}$/.test(contact.mobileNo)) {
      return "Enter a valid mobile number (10 digits).";
    }
    if (!contact.address || contact.address.trim().length > 100) {
      return "Address cannot exceed 100 characters.";
    }
    if (!message || message.trim().length < 5 || message.length > 500) {
      return "Message must be between 5 and 500 characters.";
    }
    return null;
  };

  const submitContact = async () => {
    const errorMessage = validateInput();
    if (errorMessage) {
      Swal.fire({
        title: "Validation Error",
        text: errorMessage,
        icon: "warning",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    try {
      const contactData = { ...contact, message };
      await axiosInstance.post(`/add-contact`, contactData);

      Swal.fire({
        title: "Message Sent!",
        text: "Your contact message has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setContact({ name: "", email: "", mobileNo: "", address: "" });
      setMessage("");
      closeModal();
    } catch (error) {
      console.error("Error submitting contact message:", error);
      Swal.fire({
        title: "Submission Failed!",
        text: "Failed to submit your message. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div
          className="modal-content"
          style={{
            background:
              "linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)",
            borderRadius: "8px",
            color: "#fff",
            padding: "20px",
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Contact Us</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Name</label>
            <input
              className="form-control mb-2"
              name="name"
              placeholder="Your Name"
              value={contact.name}
              onChange={(e) =>
                setContact({ ...contact, name: e.target.value })
              }
            />

            <label className="form-label">Email</label>
            <input
              className="form-control mb-2"
              name="email"
              type="email"
              placeholder="Your Email"
              value={contact.email}
              onChange={(e) =>
                setContact({ ...contact, email: e.target.value })
              }
            />

            <label className="form-label">Mobile Number</label>
            <input
              className="form-control mb-2"
              name="mobileNo"
              placeholder="Mobile Number"
              value={contact.mobileNo}
              onChange={(e) =>
                setContact({ ...contact, mobileNo: e.target.value })
              }
            />

            <label className="form-label">Address</label>
            <input
              className="form-control mb-2"
              name="address"
              placeholder="Your Address"
              value={contact.address}
              onChange={(e) =>
                setContact({ ...contact, address: e.target.value })
              }
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
