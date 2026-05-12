const axios = require("axios");

const recommendCrop = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.FLASK_URL}/recommend-crop`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Crop recommendation failed", error: error.message });
  }
};

const predictFertilizer = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.FLASK_URL}/predict-fertilizer`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Fertilizer prediction failed", error: error.message });
  }
};

module.exports = { recommendCrop, predictFertilizer };
