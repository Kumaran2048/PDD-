const express = require("express");
const router = express.Router();
const { getMarketPrices, addMarketPrice, getAllCropPrices } = require("../controllers/marketController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/prices", protect, getMarketPrices);
router.get("/all-crops", protect, getAllCropPrices);
router.post("/prices", protect, authorize("admin"), addMarketPrice);

module.exports = router;
