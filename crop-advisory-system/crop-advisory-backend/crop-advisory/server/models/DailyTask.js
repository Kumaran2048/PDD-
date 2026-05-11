const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Irrigation", "Fertilizer", "Pesticide", "Harvesting", "Weather Precaution", "General"],
      default: "General",
    },
    date: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyTask", dailyTaskSchema);
