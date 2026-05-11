const mongoose = require("mongoose");

const weatherLogSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    temperature: {
      type: Number, // in Celsius
    },
    humidity: {
      type: Number, // percentage
    },
    rainfall: {
      type: Number, // mm
    },
    windSpeed: {
      type: Number,
    },
    description: {
      type: String, // e.g. "light rain", "clear sky"
    },
    forecast: [
      {
        date: Date,
        temp: Number,
        humidity: Number,
        rainfall: Number,
        description: String,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeatherLog", weatherLogSchema);
