# ml-service/app.py
# Run: python app.py
# Runs on: http://localhost:8000

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# ── Disease Labels (PlantVillage Dataset Classes) ────────────────
LABELS = [
    "Apple Apple Scab",
    "Apple Black Rot",
    "Apple Cedar Apple Rust",
    "Apple Healthy",
    "Corn Cercospora Leaf Spot",
    "Corn Common Rust",
    "Corn Northern Leaf Blight",
    "Corn Healthy",
    "Grape Black Rot",
    "Grape Esca Black Measles",
    "Grape Leaf Blight",
    "Grape Healthy",
    "Potato Early Blight",
    "Potato Late Blight",
    "Potato Healthy",
    "Strawberry Leaf Scorch",
    "Strawberry Healthy",
    "Tomato Bacterial Spot",
    "Tomato Early Blight",
    "Tomato Late Blight",
    "Tomato Leaf Mold",
    "Tomato Septoria Leaf Spot",
    "Tomato Spider Mites",
    "Tomato Target Spot",
    "Tomato Mosaic Virus",
    "Tomato Yellow Leaf Curl Virus",
    "Tomato Healthy",
]

# Load model once at startup
model = None

def load_model():
    global model
    try:
        import tensorflow as tf
        # Load your downloaded model file
        model = tf.keras.models.load_model("plant_model.h5")
        print("Model loaded successfully")
    except Exception as e:
        print(f"Model not found: {e}")
        print("Running in DEMO mode - will return mock predictions")
        model = None

def preprocess_image(image_bytes):
    """Convert image bytes to model input format"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")          # ensure RGB
    img = img.resize((224, 224))      # resize to model input size
    img_array = np.array(img) / 255.0 # normalize 0-1
    img_array = np.expand_dims(img_array, axis=0)  # add batch dimension
    return img_array

# ── Health Check ─────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "Plant Disease Detection API running ✅",
        "model_loaded": model is not None,
        "mode": "production" if model else "demo"
    })

# ── Main Prediction Endpoint ──────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Check if image was uploaded
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]
        image_bytes = file.read()

        if model is not None:
            # Real prediction with loaded model
            img_array = preprocess_image(image_bytes)
            predictions = model.predict(img_array)
            class_index = int(np.argmax(predictions))
            confidence = float(np.max(predictions)) * 100
            disease = LABELS[class_index] if class_index < len(LABELS) else "Unknown"
        else:
            # Demo mode — return mock result so you can test frontend
            # Replace this with real model when you download it
            disease = "Tomato Late Blight"
            confidence = 87.5
            print("DEMO MODE: Returning mock prediction")

        return jsonify({
            "disease": disease,
            "confidence": round(confidence, 2),
            "is_healthy": "Healthy" in disease,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Run ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    load_model()
    print("Starting Flask on http://localhost:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)
