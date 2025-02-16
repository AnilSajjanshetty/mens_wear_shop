const contact = require("../Modal/Contact-Modal");

// Submit a contact message
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, mobileNo, address, message } = req.body;

    if (!name || !email || !mobileNo || !address || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new contact({ name, email, mobileNo, address, message });
    await newContact.save();
    res.status(201).json({ message: "Contact message submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all contact messages
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching all contact messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { submitContactMessage, getAllContacts };
