const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All admin routes are protected and require admin role
router.get("/users", protect, admin, getAllUsers);

module.exports = router;
