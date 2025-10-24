const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

const productSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [3, "Product name must be at least 3 characters long"],
    maxlength: [100, "Product name cannot exceed 100 characters"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
  Description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
    set: (value) =>
      sanitizeHtml(validator.escape(value), {
        allowedTags: [],
        allowedAttributes: {},
      }),
  },
  Price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0.01, "Price must be at least 0.01"],
    validate: {
      validator: (value) => validator.isFloat(value.toString(), { min: 0.01 }),
      message: "Invalid price format",
    },
  },
  Rating: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be negative"],
    max: [5, "Rating cannot exceed 5"],
    validate: {
      validator: (value) =>
        validator.isFloat(value.toString(), { min: 0, max: 5 }),
      message: "Invalid rating value",
    },
  },
  Stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
    validate: {
      validator: (value) => validator.isInt(value.toString(), { min: 0 }),
      message: "Stock must be a valid integer",
    },
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  Image: {
    type: [String],
    required: [true, "At least one image is required"],
    validate: {
      validator: function (images) {
        return (
          images.length > 0 &&
          images.every((img) => {
            // return validator.isURL(img) || img.startsWith("UploadedFiles/");
            return (
              images.length > 0 && images.every((img) => validator.isURL(img))
            );
          })
        );
      },
      message: "Each image must be a valid URL or a valid uploaded file path",
    },
  },
});

// Apply the AutoIncrement plugin for ProductId
productSchema.plugin(AutoIncrement, { inc_field: "ProductId" });

const products = mongoose.model("product", productSchema);

module.exports = products;
