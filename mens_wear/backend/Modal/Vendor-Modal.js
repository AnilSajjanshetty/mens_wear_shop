const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");

const vendorSchema = new mongoose.Schema({
  VendorId: {
    type: Number,
    required: [true, "Vendor ID is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isInt(value.toString(), { min: 1 }),
      message: "Vendor ID must be a valid positive integer",
    },
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Category model
    ref: "category",
    required: [true, "Category ID is required"],
  },
  VendorName: {
    type: String,
    required: [true, "Vendor name is required"],
    trim: true,
    minlength: [3, "Vendor name must be at least 3 characters long"],
    maxlength: [100, "Vendor name cannot exceed 100 characters"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
  City: {
    type: String,
    required: [true, "City is required"],
    trim: true,
    minlength: [2, "City name must be at least 2 characters long"],
    maxlength: [50, "City name cannot exceed 50 characters"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
});

// Apply the AutoIncrement plugin for VendorId
vendorSchema.plugin(AutoIncrement, { inc_field: "VendorId" });

const vendors = mongoose.model("vendor", vendorSchema);

module.exports = vendors;
