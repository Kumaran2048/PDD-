const axios = require("axios");
const FormData = require("form-data");
const DiseaseReport = require("../models/DiseaseReport");
const FarmProfile = require("../models/FarmProfile");
const Alert = require("../models/Alert");
const User = require("../models/User");

// Disease treatment database
const treatments = {
  "Tomato Late Blight": {
    treatment: "Remove infected leaves immediately. Apply copper-based fungicide. Avoid overhead watering.",
    pesticide: "Mancozeb 75% WP or Metalaxyl + Mancozeb",
    severity: "High",
  },
  "Tomato Early Blight": {
    treatment: "Improve air circulation. Apply chlorothalonil fungicide. Remove lower infected leaves.",
    pesticide: "Chlorothalonil 75% WP",
    severity: "Medium",
  },
  "Potato Late Blight": {
    treatment: "Apply fungicide at first sign. Destroy infected plants. Avoid waterlogging.",
    pesticide: "Cymoxanil + Mancozeb",
    severity: "High",
  },
  "Corn Common Rust": {
    treatment: "Apply foliar fungicide. Use resistant varieties next season.",
    pesticide: "Propiconazole 25% EC",
    severity: "Medium",
  },
  Healthy: {
    treatment: "Your plant looks healthy! Continue regular care and monitoring.",
    pesticide: "None required",
    severity: "Low",
  },
};

// ── @POST /api/disease/detect ────────────────────────────────────
const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a leaf image" });
    }

    // Build form data to send to Flask
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Call Python Flask ML service
    const flaskResponse = await axios.post(
      `${process.env.FLASK_URL}/predict`,
      form,
      { headers: form.getHeaders(), timeout: 30000 }
    );

    const { disease, confidence } = flaskResponse.data;

    // Get treatment info
    const treatmentInfo = treatments[disease] || {
      treatment: "Consult your local agriculture officer for advice.",
      pesticide: "Unknown",
      severity: "Medium",
    };

    // Get farmer's district for alert check
    const profile = await FarmProfile.findOne({ userId: req.user._id });
    const district = profile?.district || req.user.district;

    // Save disease report to DB
    const report = await DiseaseReport.create({
      farmerId: req.user._id,
      disease,
      confidence,
      treatment: treatmentInfo.treatment,
      severity: treatmentInfo.severity,
      district,
    });

    // Check if alert should be triggered
    // (If same disease reported 5+ times in same district in last 7 days)
    if (disease !== "Healthy") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentReports = await DiseaseReport.countDocuments({
        disease,
        district,
        createdAt: { $gte: sevenDaysAgo },
        isAlertTriggered: false,
      });

      if (recentReports >= 5) {
        // Find officer for this district
        const officer = await User.findOne({ role: "officer", district });
        if (officer) {
          await Alert.create({
            officerId: officer._id,
            type: "Disease Outbreak",
            message: `Disease Outbreak Alert: ${disease} detected in ${recentReports} farms in ${district} district in last 7 days. Immediate inspection recommended.`,
            district,
            severity: "High",
          });

          // Mark these reports as alerted
          await DiseaseReport.updateMany(
            { disease, district, createdAt: { $gte: sevenDaysAgo } },
            { isAlertTriggered: true }
          );
        }
      }
    }

    res.json({
      disease,
      confidence,
      treatment: treatmentInfo.treatment,
      pesticide: treatmentInfo.pesticide,
      severity: treatmentInfo.severity,
      reportId: report._id,
    });
  } catch (error) {
    // If Flask is not running, return a helpful error
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "Disease detection service is currently unavailable. Please try again later.",
      });
    }
    res.status(500).json({ message: "Disease detection failed", error: error.message });
  }
};

// ── @GET /api/disease/history ────────────────────────────────────
const getDiseaseHistory = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ farmerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch disease history", error: error.message });
  }
};

// ── @GET /api/disease/district/:district (Officer) ───────────────
const getDistrictDiseases = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ district: req.params.district })
      .populate("farmerId", "name phone")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch district reports", error: error.message });
  }
};

module.exports = { detectDisease, getDiseaseHistory, getDistrictDiseases };
