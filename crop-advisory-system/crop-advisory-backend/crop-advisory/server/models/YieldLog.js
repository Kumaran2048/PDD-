const mongoose = require("mongoose");

const yieldLogSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    season: {
      type: String,
      enum: ["Kharif", "Rabi", "Zaid"],
    },
    year: {
      type: Number,
    },
    quantityQuintals: {
      type: Number, // harvest amount
      required: true,
    },
    sellingPricePerQuintal: {
      type: Number,
      required: true,
    },
    totalRevenue: {
      type: Number, // auto calculated
    },
    totalExpenses: {
      type: Number, // pulled from Expense collection
    },
    netProfit: {
      type: Number, // totalRevenue - totalExpenses
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto calculate revenue and profit before saving
yieldLogSchema.pre("save", function (next) {
  this.totalRevenue = this.quantityQuintals * this.sellingPricePerQuintal;
  if (this.totalExpenses) {
    this.netProfit = this.totalRevenue - this.totalExpenses;
  }
  next();
});
module.exports = mongoose.model("YieldLog", yieldLogSchema);
