const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const productSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Rating: {
    type: Object,
    required: true,
    trim: true,
  },
  Stock: {
    type: String,
    required: true,
    trim: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
    ref: "category",
    required: true,
  },
  //   VendorId: {
  //     type: mongoose.Schema.Types.ObjectId, // Reference to the Vendor model
  //     ref: "vendor",
  //     required: true,
  //   },
  Image: {
    type: String,
    required: true,
    trim: true,
  },
});

// Apply the AutoIncrement plugin to the schema
productSchema.plugin(AutoIncrement, { inc_field: "ProductId" });
const products = mongoose.model("product", productSchema);

module.exports = products;
