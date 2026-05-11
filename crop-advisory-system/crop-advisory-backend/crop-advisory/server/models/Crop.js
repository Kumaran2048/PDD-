const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    localName: {
      type: String, // name in regional language
      trim: true,
    },
    season: {
      type: [String],
      enum: ["Kharif", "Rabi", "Zaid"],
      required: true,
    },
    soilTypes: {
      type: [String],
      enum: ["Red Soil", "Black Soil", "Loamy Soil", "Sandy Soil", "Alluvial Soil", "Laterite Soil"],
      required: true,
    },
    waterNeed: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    waterRequirementMM: {
      type: Number, // water in mm per season
    },
    growingDurationDays: {
      type: Number, // how many days to harvest
    },
    expectedYieldPerAcre: {
      type: String, // e.g. "20-25 quintals"
    },
    commonDiseases: {
      type: [String],
    },
    states: {
      type: [String], // states where this crop is common
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    // New Day-to-Day Guidance
    maintenanceTips: [String],
    fertilizerSchedule: [{
      day: Number, // days after sowing
      instruction: String,
      fertilizerType: String
    }],
    wateringSchedule: {
      frequency: String, // e.g., "Daily", "Alternate Days"
      instructions: String
    },
    pestRisks: [{
      name: String,
      prevention: String
    }],
    idealConditions: {
      tempRange: String,
      humidityRange: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);
