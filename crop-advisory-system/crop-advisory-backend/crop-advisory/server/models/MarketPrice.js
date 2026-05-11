const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    mandiName: {
      type: String,
      trim: true,
    },
    minPrice: {
      type: Number, // Rs per quintal
    },
    maxPrice: {
      type: Number,
    },
    modalPrice: {
      type: Number, // most common price
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
