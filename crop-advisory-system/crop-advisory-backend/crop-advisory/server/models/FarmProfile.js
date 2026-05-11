const mongoose = require("mongoose");

const farmProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    landSize: {
      type: Number, // in acres
      required: [true, "Land size is required"],
    },
    soilType: {
      type: String,
      enum: ["Red Soil", "Black Soil", "Loamy Soil", "Sandy Soil", "Alluvial Soil", "Laterite Soil"],
      required: [true, "Soil type is required"],
    },
    waterSource: {
      type: String,
      enum: ["Well", "Canal", "Rain-fed", "Borewell", "River"],
      required: [true, "Water source is required"],
    },
    village: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    activeCrop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null,
    },
    sowingDate: {
      type: Date,
      default: null,
    },
    sowingSeason: {
      type: String,
      enum: ["Kharif", "Rabi", "Zaid", null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FarmProfile", farmProfileSchema);
