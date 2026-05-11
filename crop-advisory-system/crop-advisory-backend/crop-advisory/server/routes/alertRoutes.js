const express = require("express");
const router = express.Router();
const { getMyAlerts, markAsRead, markAllAsRead } = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my-alerts", protect, getMyAlerts);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

module.exports = router;
