import React, { useState } from "react";
import Tesseract from "tesseract.js";
import stringSimilarity from "string-similarity";
import carbonData from "../data/carbonData.json";

export default function UploadReceipt() {
  const [results, setResults] = useState([]);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [ocrText, setOcrText] = useState("");

  const fractionMap = { "½": 0.5, "¼": 0.25, "¾": 0.75 };

  // ---- FILE UPLOAD & OCR ----
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResults([]);
    setTotalCarbon(0);
    setScanned(false);

    Tesseract.recognize(file, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        const cleanText = text.replace(/[^\x20-\x7E\n]/g, "").trim();
        setOcrText(cleanText);
        processText(cleanText);
        setLoading(false);
        setScanned(true);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // ---- PRODUCT NAME CLEANUP ----
  const preprocessProductName = (line) => {
    if (!line) return "";
    let processed = line.toLowerCase();
    processed = processed.replace(/\b(xz|id|ce|#|hsn|sgst|cgst)\w*\b/g, " ");
    processed = processed.replace(/\b(kg|g|lb|oz|liter|l|dozen|pcs|ct)\b/gi, " ");
    processed = processed.replace(/[0-9]+(\.[0-9]+)?/g, " ");
    processed = processed.replace(/\s{2,}/g, " ").trim();
    return processed;
  };

  // ---- QUANTITY DETECTION ----
  const parseQuantity = (line) => {
    if (!line) return 1;
    Object.keys(fractionMap).forEach((f) => {
      if (line.includes(f)) line = line.replace(f, fractionMap[f]);
    });

    const match = line.match(/(\d+)\s*[xX]\s*(\d+)/);
    if (match) return parseFloat(match[1]);
    const match2 = line.match(/^\d+$/);
    if (match2) return parseFloat(match2[0]);

    return 1;
  };

  // ---- MAIN TEXT PARSER ----
  const processText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.toLowerCase().trim())
      .filter((line) => line.length > 2);

    const datasetKeys = Object.keys(carbonData);
    const matchedItems = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const productName = preprocessProductName(line);
      if (!productName) continue;

      // Try to find numeric data below (quantity or price)
      const nextLine = lines[i + 1] || "";
      const quantity = parseQuantity(nextLine);

      // Combined fuzzy + substring matching
      const { bestMatch } = stringSimilarity.findBestMatch(productName, datasetKeys);
      const exactMatch = datasetKeys.find((k) => productName.includes(k));

      let finalProduct = null;
      let confidence = 0;

      if (exactMatch) {
        finalProduct = exactMatch;
        confidence = 1;
      } else if (bestMatch.rating > 0.45) {
        finalProduct = bestMatch.target;
        confidence = bestMatch.rating;
      }

      if (finalProduct) {
        const productInfo = carbonData[finalProduct];
        const carbonValue = (productInfo.carbon || 1) * quantity;

        matchedItems.push({
          product: finalProduct,
          quantity,
          carbon: parseFloat(carbonValue.toFixed(2)),
          confidence: (confidence * 100).toFixed(0),
          swap: productInfo.swap || "No swap available",
          unit: productInfo.unit || "kg CO₂e",
        });
      }
    }

    setResults(matchedItems);
    const total = matchedItems.reduce((sum, item) => sum + item.carbon, 0);
    setTotalCarbon(parseFloat(total.toFixed(2)));
  };

  const handleRetry = () => {
    setResults([]);
    setTotalCarbon(0);
    setScanned(false);
    setOcrText("");
  };

  // ---- UI ----
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>🧾 AI Receipt Scanner</h2>
      <p>Upload a receipt to calculate the carbon footprint of your purchase.</p>

      {!scanned && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ margin: "10px 0", padding: "10px" }}
        />
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Processing your receipt with AI... please wait ⏳</p>
        </div>
      )}

      {scanned && results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>🛒 Detected Products</h3>
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px" }}>
            {results.map((item, idx) => (
              <div key={idx} style={{ marginBottom: "12px" }}>
                <strong>
                  {item.quantity} × {item.product}
                </strong>{" "}
                ({item.confidence}% confidence)
                <div style={{ fontSize: "0.9em", color: "#555" }}>
                  Carbon: {item.carbon} {item.unit}
                </div>
                <div style={{ fontSize: "0.85em", color: "#666" }}>
                  🌱 Suggestion: Try <b>{item.swap}</b> next time!
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#e9f7ef",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>🌍 Total Carbon Footprint: {totalCarbon} kg CO₂e</h3>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={handleRetry}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
              }}
            >
              🔁 Scan Another Receipt
            </button>
          </div>

          <details style={{ marginTop: "20px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>View OCR Text</summary>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#f8f9fa",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              {ocrText}
            </pre>
          </details>
        </div>
      )}

      {!loading && scanned && results.length === 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>📄 No recognizable items found in the dataset.</p>
          <button
            onClick={handleRetry}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "6px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔁 Try Again
          </button>
        </div>
      )}
    </div>
  );
}
