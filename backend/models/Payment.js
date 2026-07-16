const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    injectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Injection",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    screenshot: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    walletAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
