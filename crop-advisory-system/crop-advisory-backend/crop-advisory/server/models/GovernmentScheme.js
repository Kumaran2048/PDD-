const mongoose = require("mongoose");

const governmentSchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibility: {
      landSizeMax: Number,
      cropTypes: [String],
    },
    benefits: {
      type: String,
    },
    link: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Subsidy", "Insurance", "Fertilizer", "Water Management", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovernmentScheme", governmentSchemeSchema);
