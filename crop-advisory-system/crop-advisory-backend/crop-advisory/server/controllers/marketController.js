const MarketPrice = require("../models/MarketPrice");
const FarmProfile = require("../models/FarmProfile");

// ── @GET /api/market/prices ──────────────────────────────────────
const getMarketPrices = async (req, res) => {
  try {
    const profile = await FarmProfile.findOne({ userId: req.user._id }).populate("activeCrop");
    const district = profile?.district || req.query.district;
    const cropName = profile?.activeCrop?.name || req.query.crop;

    if (!cropName) {
      return res.status(400).json({ message: "No active crop. Please select a crop first." });
    }

    // Get last 30 days prices
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const prices = await MarketPrice.find({
      cropName: { $regex: cropName, $options: "i" },
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    // Today's price
    const todayPrice = prices[0] || null;

    // Nearby Markets (simulated by same district mandis)
    const nearbyMarkets = prices.filter(p => p.district === district && p.date.toDateString() === new Date().toDateString());
    
    // AI Decision Logic
    let aiSuggestion = {
      decision: "Hold",
      reason: "Insufficient data for trend analysis."
    };

    if (prices.length >= 5) {
      const avgPrice = prices.slice(1, 6).reduce((acc, curr) => acc + curr.modalPrice, 0) / 5;
      const currentPrice = todayPrice?.modalPrice || 0;
      
      if (currentPrice > avgPrice * 1.1) {
        aiSuggestion = {
          decision: "Sell Now",
          reason: `Current price (₹${currentPrice}) is 10% higher than the 5-day average. Demand is high.`
        };
      } else if (currentPrice < avgPrice * 0.9) {
        aiSuggestion = {
          decision: "Wait",
          reason: `Price is currently low (₹${currentPrice}). Trend suggests a potential recovery next week. Consider temporary storage.`
        };
      } else {
        aiSuggestion = {
          decision: "Sell/Hold",
          reason: "Market is stable. If you need immediate liquidity, sell; otherwise, wait for peak demand."
        };
      }
    }

    // Price trend for chart (last 30 days)
    const trend = prices.map((p) => ({
      date: p.date,
      price: p.modalPrice,
      mandi: p.mandiName,
    }));

    res.json({ 
      cropName, 
      district, 
      todayPrice, 
      trend, 
      nearbyMarkets, 
      aiSuggestion,
      demandLevel: todayPrice?.modalPrice > 2000 ? "High" : "Moderate"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch market prices", error: error.message });
  }
};

// ── @POST /api/market/prices (Admin only) ───────────────────────
const addMarketPrice = async (req, res) => {
  try {
    const { cropName, district, state, mandiName, minPrice, maxPrice, modalPrice } = req.body;

    const price = await MarketPrice.create({
      cropName,
      district,
      state,
      mandiName,
      minPrice,
      maxPrice,
      modalPrice,
      date: new Date(),
    });

    res.status(201).json({ message: "Market price added", price });
  } catch (error) {
    res.status(500).json({ message: "Failed to add market price", error: error.message });
  }
};

// ── @GET /api/market/all-crops ───────────────────────────────────
const getAllCropPrices = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prices = await MarketPrice.find({ date: { $gte: today } }).sort({ cropName: 1 });
    res.json({ prices });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch prices", error: error.message });
  }
};

module.exports = { getMarketPrices, addMarketPrice, getAllCropPrices };
