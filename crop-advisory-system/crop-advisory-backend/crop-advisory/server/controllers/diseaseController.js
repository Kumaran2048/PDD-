const axios = require("axios");
const FormData = require("form-data");
const DiseaseReport = require("../models/DiseaseReport");
const FarmProfile = require("../models/FarmProfile");
const Alert = require("../models/Alert");
const User = require("../models/User");

// Real-world Disease Treatment Database
const treatments = {
  "Tomato Late Blight": { treatment: "Remove infected leaves. Apply copper fungicide.", pesticide: "Mancozeb", severity: "High" },
  "Tomato Early Blight": { treatment: "Improve air circulation. Apply chlorothalonil.", pesticide: "Chlorothalonil", severity: "Medium" },
  "Tomato Bacterial Spot": { treatment: "Apply copper bactericides. Rotate crops.", pesticide: "Copper Oxychloride", severity: "High" },
  "Tomato Yellow Leaf Curl Virus": { treatment: "Control whiteflies. Remove infected plants.", pesticide: "Imidacloprid", severity: "Critical" },
  "Potato Late Blight": { treatment: "Apply fungicide. Destroy infected plants.", pesticide: "Metalaxyl", severity: "High" },
  "Potato Early Blight": { treatment: "Maintain soil fertility. Apply protectants.", pesticide: "Dithane M-45", severity: "Medium" },
  "Corn Common Rust": { treatment: "Apply foliar fungicide.", pesticide: "Propiconazole", severity: "Medium" },
  "Apple Scab": { treatment: "Prune for airflow. Apply fungicide.", pesticide: "Captan", severity: "Medium" },
  "Healthy": { treatment: "Plant is healthy! Maintain regular care.", pesticide: "None", severity: "Low" },
};

const detectDisease = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Upload an image" });

    const form = new FormData();
    form.append("image", req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    const flaskResponse = await axios.post(`${process.env.FLASK_URL}/predict`, form, { 
      headers: form.getHeaders(), timeout: 30000 
    });

    const aiData = flaskResponse.data;

    // ── Handle Validation Errors ───────────────────────────────────────
    if (aiData.status === "invalid" || aiData.status === "not_found") {
      return res.status(422).json({ 
        message: aiData.message,
        type: aiData.status 
      });
    }

    const { disease, confidence } = aiData;

    let matchedKey = "Unknown";
    for (let key in treatments) {
      if (disease.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(disease.toLowerCase())) {
        matchedKey = key;
        break;
      }
    }

    const info = treatments[matchedKey] || {
      treatment: `Detected: ${disease}. Consult an expert for treatment.`,
      pesticide: "Consult Expert",
      severity: "Medium"
    };

    const profile = await FarmProfile.findOne({ userId: req.user._id });
    const report = await DiseaseReport.create({
      farmerId: req.user._id,
      disease,
      confidence,
      treatment: info.treatment,
      severity: info.severity,
      district: profile?.district || req.user.district,
    });

    res.json({ disease, confidence, ...info, reportId: report._id });

  } catch (error) {
    res.status(500).json({ message: "Detection failed", error: error.message });
  }
};

const getDiseaseHistory = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: "Failed history", error: error.message });
  }
};

const resolveReport = async (req, res) => {
  try {
    const report = await DiseaseReport.findByIdAndUpdate(req.params.id, { status: "resolved" }, { new: true });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report marked as resolved", report });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
const getDistrictDiseases = async (req, res) => {
  try {
    let district = req.params.district;

    // If requester is an officer, force their own district
    if (req.user.role === "officer") {
      district = req.user.district;
    }

    const reports = await DiseaseReport.find({ district }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch district reports", error: error.message });
  }
};

module.exports = { detectDisease, getDiseaseHistory, getDistrictDiseases, resolveReport };
