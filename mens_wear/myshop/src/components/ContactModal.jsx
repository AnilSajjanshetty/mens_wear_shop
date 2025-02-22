import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axiosInstance";

const ContactModal = ({ closeModal }) => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: ""
  });
  const [message, setMessage] = useState("");

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const submitContact = async () => {
    try {
      const contactData = { ...contact, message };
      await axiosInstance.post(`/add-contact`, contactData);

      // **Success Message**
      Swal.fire({
        title: "Message Sent!",
        text: "Your contact message has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      // **Reset form after success**
      setContact({ name: "", email: "", mobileNo: "", address: "" });
      setMessage("");
      closeModal(); // Close modal after success
    } catch (error) {
      console.error("Error submitting contact message:", error);

      // **Error Message**
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
        <div className="modal-content" style={{ background: "linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)", borderRadius: "8px", color: "#fff", padding: "20px" }}>
          <div className="modal-header">
            <h5 className="modal-title">Contact Us</h5>
            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Name</label>
            <input className="form-control mb-2" name="name" placeholder="Your Name" value={contact.name} onChange={handleContactChange} />

            <label className="form-label">Email</label>
            <input className="form-control mb-2" name="email" type="email" placeholder="Your Email" value={contact.email} onChange={handleContactChange} />

            <label className="form-label">Mobile Number</label>
            <input className="form-control mb-2" name="mobileNo" placeholder="Mobile Number" value={contact.mobileNo} onChange={handleContactChange} />

            <label className="form-label">Address</label>
            <input className="form-control mb-2" name="address" placeholder="Your Address" value={contact.address} onChange={handleContactChange} />

            <label className="form-label">Message</label>
            <textarea className="form-control" rows="3" placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={closeModal}>Close</button>
            <button type="button" className="btn btn-warning" onClick={submitContact}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
