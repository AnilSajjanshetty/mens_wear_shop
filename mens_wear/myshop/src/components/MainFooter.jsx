import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert
import config from "../../config";

const MainFooter = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");
    const [contact, setContact] = useState({ name: "", email: "", mobileNo: "", address: "" });
    const [feedbackExists, setFeedbackExists] = useState(false);
    const userId = 1; // Replace with actual user ID
    const server = config.server;

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axiosInstance.get(`/get-feedback/${userId}`);
                if (response.data) {
                    setRating(response.data.rating);
                    setFeedback(response.data.feedbackText);
                    setFeedbackExists(true);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };
        fetchFeedback();
    }, [userId]);

    const handleContactChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const submitFeedback = async () => {
        try {
            const feedbackData = { userId, rating, feedbackText: feedback };

            if (feedbackExists) {
                await axiosInstance.put(`/update-feedback`, feedbackData);
                Swal.fire({
                    title: "Feedback Updated!",
                    text: "Your feedback has been successfully updated.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                await axiosInstance.post(`/add-feedback`, feedbackData);
                setFeedbackExists(true);
                Swal.fire({
                    title: "Feedback Submitted!",
                    text: "Thank you for your feedback!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
            document.getElementById("feedbackModalClose").click();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            Swal.fire({
                title: "Submission Failed",
                text: "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    const submitContact = async () => {
        try {
            const contactData = { ...contact, message };
            await axiosInstance.post(`/add-contact`, contactData);
            Swal.fire({
                title: "Message Sent!",
                text: "We have received your message and will get back to you soon.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
            document.getElementById("contactModalClose").click();
        } catch (error) {
            console.error("Error submitting contact message:", error);
            Swal.fire({
                title: "Submission Failed",
                text: "Could not send your message. Please try again later.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    const modalStyle = {
        background: "linear-gradient(135deg, #ff7f50, #ff1493, #8a2be2, #ff1493, #ff7f50)",
        borderRadius: "8px",
        color: "#fff",
        padding: "20px",
    };

    return (
        <footer className="text-center py-3 bg-dark text-white"
            style={{ background: 'linear-gradient(135deg, #ff7f50, #ff1493)', color: '#fff' }}>
            <p>© 2025 My Shop. All rights reserved.</p>
            <div className="mt-3">
                <a href="#" className="text-decoration-none text-white me-3" data-bs-toggle="modal" data-bs-target="#contactModal">
                    Contact Us
                </a>
                <a href="#" className="text-decoration-none text-white" data-bs-toggle="modal" data-bs-target="#feedbackModal">
                    Give Feedback
                </a>
            </div>

            {/* Contact Modal */}
            <div className="modal fade" id="contactModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={modalStyle}>
                        <div className="modal-header">
                            <h5 className="modal-title">Contact Us</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="contactModalClose"></button>
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
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-warning" onClick={submitContact}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <div className="modal fade" id="feedbackModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={modalStyle}>
                        <div className="modal-header">
                            <h5 className="modal-title">Give Feedback</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="feedbackModalClose"></button>
                        </div>
                        <div className="modal-body">
                            <label className="form-label">Rate Us</label>
                            <div className="d-flex justify-content-center mb-3">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <FaStar
                                            key={index}
                                            size={30}
                                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onClick={() => setRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(null)}
                                            style={{ cursor: "pointer", marginRight: "5px" }}
                                        />
                                    );
                                })}
                            </div>

                            <label className="form-label">Your Feedback</label>
                            <textarea className="form-control" rows="3" placeholder="Your Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-warning" onClick={submitFeedback}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
