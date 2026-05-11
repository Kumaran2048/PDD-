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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
