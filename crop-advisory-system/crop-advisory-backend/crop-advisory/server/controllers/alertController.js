const Alert = require("../models/Alert");

// ── @GET /api/alert/my-alerts ────────────────────────────────────
const getMyAlerts = async (req, res) => {
  try {
    const query =
      req.user.role === "officer"
        ? { officerId: req.user._id }
        : { farmerId: req.user._id };

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = alerts.filter((a) => !a.isRead).length;
    res.json({ alerts, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alerts", error: error.message });
  }
};

// ── @PUT /api/alert/:id/read ─────────────────────────────────────
const markAsRead = async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Alert marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark alert", error: error.message });
  }
};

// ── @PUT /api/alert/read-all ─────────────────────────────────────
const markAllAsRead = async (req, res) => {
  try {
    const query =
      req.user.role === "officer"
        ? { officerId: req.user._id }
        : { farmerId: req.user._id };

    await Alert.updateMany(query, { isRead: true });
    res.json({ message: "All alerts marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update alerts", error: error.message });
  }
};

module.exports = { getMyAlerts, markAsRead, markAllAsRead };
