const mongoose = require("mongoose");

const diseaseReportSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null,
    },
    imageUrl: {
      type: String,
    },
    disease: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number, // percentage eg. 92.5
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    treatment: {
      type: String,
    },
    district: {
      type: String,
    },
    isAlertTriggered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiseaseReport", diseaseReportSchema);
