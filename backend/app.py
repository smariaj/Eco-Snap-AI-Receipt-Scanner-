from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import json
import cv2
import numpy as np
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# ---- Load AI model & dataset ----
model = SentenceTransformer('all-MiniLM-L6-v2')

with open("carbon_data.json", "r", encoding="utf-8") as f:
    carbon_data = json.load(f)

dataset_items = list(carbon_data.keys())
dataset_embeddings = model.encode(dataset_items, convert_to_tensor=True)

# ---- Tunable parameters ----
similarity_threshold = 0.5  # slightly relaxed for OCR noise tolerance

def preprocess_image(file_bytes):
    """Enhance image for better OCR accuracy."""
    # Read image bytes into OpenCV format
    file_array = np.frombuffer(file_bytes, np.uint8)
    image = cv2.imdecode(file_array, cv2.IMREAD_COLOR)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Denoise + Threshold
    gray = cv2.bilateralFilter(gray, 11, 17, 17)
    gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

    # Resize small images to improve text clarity
    h, w = gray.shape
    if h < 600 or w < 600:
        gray = cv2.resize(gray, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_LINEAR)

    return gray


@app.route("/analyze-receipt", methods=["POST"])
def analyze_receipt():
    # ---- Check for uploaded file ----
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    file_bytes = file.read()

    try:
        # ---- Image preprocessing ----
        processed_img = preprocess_image(file_bytes)

        # ---- OCR extraction ----
        custom_config = r'--oem 3 --psm 6'  # optimized for receipts
        text = pytesseract.image_to_string(processed_img, config=custom_config)
    except Exception as e:
        return jsonify({"error": f"OCR failed: {str(e)}"}), 500

    # ---- Clean text lines ----
    items = [line.strip() for line in text.split("\n") if line.strip()]

    results = []

    # ---- Semantic matching ----
    for item in items:
        query_emb = model.encode(item, convert_to_tensor=True)
        scores = util.cos_sim(query_emb, dataset_embeddings)[0]
        best_idx = int(scores.argmax())
        best_match = dataset_items[best_idx]
        similarity_score = float(scores[best_idx])

        # ---- Only accept if above threshold ----
        if similarity_score < similarity_threshold:
            continue

        entry = carbon_data.get(best_match, {})
        results.append({
            "item": best_match,
            "carbon": entry.get("carbon", 1),
            "swap": entry.get("swap", "No swap available"),
            "unit": entry.get("unit", "kg CO₂e"),
            "confidence": round(similarity_score * 100, 1)
        })

    return jsonify({
        "extracted_text": text.strip(),
        "results": results
    })


@app.route('/')
def home():
    return jsonify({"status": "Backend is running successfully"})


if __name__ == "__main__":
    app.run(debug=True)
