from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import json
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# ---- Load AI model & dataset ----
model = SentenceTransformer('all-MiniLM-L6-v2')

# Make sure your file is named exactly like this
with open("carbon_data.json") as f:
    carbon_data = json.load(f)

similarity_threshold = 0.5  # only accept matches above this score

@app.route("/analyze-receipt", methods=["POST"])
def analyze_receipt():
    # ---- Check for uploaded file ----
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    try:
        image = Image.open(io.BytesIO(file.read()))
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {str(e)}"}), 400

    # ---- OCR extraction ----
    text = pytesseract.image_to_string(image)
    items = text.split("\n")
    items = [i.strip() for i in items if i.strip()]

    # ---- Semantic matching ----
    dataset_items = list(carbon_data.keys())
    dataset_embeddings = model.encode(dataset_items, convert_to_tensor=True)

    results = []
    for item in items:
        query_emb = model.encode(item, convert_to_tensor=True)
        scores = util.cos_sim(query_emb, dataset_embeddings)[0]
        best_idx = int(scores.argmax())
        best_match = dataset_items[best_idx]
        similarity_score = float(scores[best_idx])

        # ---- Only accept if above threshold ----
        if similarity_score < similarity_threshold:
            continue

        # ---- Safely get data from dataset ----
        carbon_val = carbon_data[best_match].get("carbon", 1)
        swap_val = carbon_data[best_match].get("swap", "No swap available")
        unit_val = carbon_data[best_match].get("unit", "kg CO₂e")

        results.append({
            "item": best_match,
            "carbon": carbon_val,
            "swap": swap_val,
            "unit": unit_val,
            "confidence": round(similarity_score * 100, 0)
        })

    return jsonify({"extracted_text": text, "results": results})

if __name__ == "__main__":
    app.run(debug=True)
