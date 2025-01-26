const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const cartSchema = new mongoose.Schema({
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
    ref: "category",
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    trim: true,
  },
  Image: {
    type: String,
    required: true,
    trim: true,
  },
});

// Apply the AutoIncrement plugin to the schema
cartSchema.plugin(AutoIncrement, { inc_field: "CartId" });

const carts = mongoose.model("cart", cartSchema);

module.exports = carts;
