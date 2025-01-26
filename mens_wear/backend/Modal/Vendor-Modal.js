const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const vendorSchema = new mongoose.Schema({
  VendorId: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
    ref: "category",
    required: true,
  },
  VendorName: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
});
vendorSchema.plugin(AutoIncrement, { inc_field: "VendorId" });

const vendors = mongoose.model("vendor", vendorSchema);

module.exports = vendors;
