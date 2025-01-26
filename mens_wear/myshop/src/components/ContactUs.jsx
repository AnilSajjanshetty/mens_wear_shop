import React from 'react';

const ContactUs = () => {
  return (
    <section id="contact" className="bg-blue-50 py-12">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-4">Got questions? Reach out to us!</p>
        <form className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300"
            rows="4"
          ></textarea>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
