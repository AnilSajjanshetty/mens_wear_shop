const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const cartSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "profile",
      required: true,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
      ref: "product",
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Ordered", "Cancelled", "Delivered"], // Added "Delivered"
      default: "Pending",
    },
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

// Apply the AutoIncrement plugin to the schema
cartSchema.plugin(AutoIncrement, { inc_field: "CartId" });

const carts = mongoose.model("cart", cartSchema);

module.exports = carts;
