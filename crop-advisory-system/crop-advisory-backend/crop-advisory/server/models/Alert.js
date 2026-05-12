const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["Disease Outbreak", "Low Market Price", "Weather Warning", "General"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    district: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    allowReplies: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        farmerName: String,
        message: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
