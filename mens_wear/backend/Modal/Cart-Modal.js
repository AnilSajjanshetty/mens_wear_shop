const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const cartSchema = new mongoose.Schema(
  {
    UserId: {
      type: Number, // TODO add ref for  profile use _id
      required: true,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    Quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    // ✅ Order Status
    OrderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    // ✅ Delivery Status
    DeliveryStatus: {
      type: String,
      enum: [
        "Not Shipped",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Not Shipped",
    },

    // ✅ Payment Method (Required only when OrderStatus is 'Confirmed')
    PaymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "PayPal", "UPI", "Cash on Delivery"],
      validate: {
        validator: function (value) {
          // If OrderStatus is 'Confirmed', PaymentMethod must be provided
          return this.OrderStatus !== "Confirmed" || !!value;
        },
        message: "PaymentMethod is required when OrderStatus is Confirmed.",
      },
    },

    // ✅ Payment Status
    PaymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    // ✅ Transaction ID
    TransactionId: {
      type: String,
      default: null, // Will be updated when payment is completed
    },
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

// Apply the AutoIncrement plugin to the schema
cartSchema.plugin(AutoIncrement, { inc_field: "CartId" });

const carts = mongoose.model("cart", cartSchema);

module.exports = carts;
