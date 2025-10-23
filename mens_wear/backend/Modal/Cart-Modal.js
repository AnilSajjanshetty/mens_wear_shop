const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");

// Function to sanitize input (Allowed only basic HTML formatting)
const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: ["b", "i", "em", "strong", "p", "ul", "ol", "li"],
    allowedAttributes: { a: ["href", "title"] },
  });
};

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
      min: [1, "Quantity must be at least 1"],
      max: [100, "Quantity cannot exceed 100"], // Prevent bulk order exploits
    },

    OrderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      set: (value) => sanitizeInput(value.trim()),
    },

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
      set: (value) => sanitizeInput(value.trim()),
    },

    PaymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "PayPal", "UPI", "Cash on Delivery"],
      default: null,
      set: (value) => (value ? sanitizeInput(value.trim()) : null),
      validate: {
        validator: function (value) {
          return this.OrderStatus !== "Confirmed" || !!value;
        },
        message: "PaymentMethod is required when OrderStatus is Confirmed.",
      },
    },

    PaymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
      set: (value) => sanitizeInput(value.trim()),
    },

    TransactionId: {
      type: String,
      default: null,
      minlength: [6, "TransactionId must be at least 6 characters long"],
      maxlength: [50, "TransactionId cannot exceed 50 characters"],
      set: (value) => (value ? sanitizeInput(validator.escape(value)) : null),
      validate: {
        validator: function (value) {
          return this.PaymentStatus !== "Paid" || !!value;
        },
        message: "TransactionId is required when PaymentStatus is 'Paid'.",
      },
    },
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

// Apply AutoIncrement plugin
cartSchema.plugin(AutoIncrement, { inc_field: "CartId" });

const carts = mongoose.model("cart", cartSchema);

module.exports = carts;
