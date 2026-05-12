const Alert = require("../models/Alert");
const User = require("../models/User");

// ── @GET /api/alert/my-alerts ────────────────────────────────────
const getMyAlerts = async (req, res) => {
  try {
    const query =
      req.user.role === "officer"
        ? { district: req.user.district, officerId: req.user._id }
        : { farmerId: req.user._id };

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = alerts.filter((a) => !a.isRead).length;
    res.json({ alerts, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alerts", error: error.message });
  }
};

// ── @POST /api/alert/broadcast ───────────────────────────────────
const createBroadcast = async (req, res) => {
  try {
    const { message, type, severity, allowReplies } = req.body;
    const district = req.user.district;

    // Find all farmers in the officer's district
    const farmers = await User.find({ district, role: "farmer" });

    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found in this district" });
    }

    // Create alerts for all farmers
    const alerts = farmers.map(farmer => ({
      farmerId: farmer._id,
      officerId: req.user._id,
      type: type || "General",
      severity: severity || "Medium",
      message,
      district,
      allowReplies: allowReplies || false
    }));

    await Alert.insertMany(alerts);

    res.status(201).json({ 
      message: `Broadcast sent to ${farmers.length} farmers in ${district}`,
      count: farmers.length
    });
  } catch (error) {
    res.status(500).json({ message: "Broadcast failed", error: error.message });
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

// ── @POST /api/alert/:id/reply ─────────────────────────────────────
const replyToAlert = async (req, res) => {
  try {
    const { message } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) return res.status(404).json({ message: "Alert not found" });
    if (!alert.allowReplies) return res.status(403).json({ message: "Replies not allowed for this broadcast" });

    alert.replies.push({
      farmerId: req.user._id,
      farmerName: req.user.name,
      message,
      createdAt: new Date()
    });

    await alert.save();
    res.status(201).json({ message: "Reply sent successfully", alert });
  } catch (error) {
    res.status(500).json({ message: "Failed to reply", error: error.message });
  }
};

module.exports = { getMyAlerts, createBroadcast, markAsRead, markAllAsRead, replyToAlert };
