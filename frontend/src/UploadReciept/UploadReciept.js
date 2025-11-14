import React, { useState } from "react";
import axios from "axios";
import "./UploadReciept.css";

export default function UploadReciept() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/analyze-receipt",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResults(res.data.results);
      setOcrText(res.data.extracted_text);
    } catch (err) {
      console.error(err);
      alert("Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>EcoSnap AI Receipt Scanner</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Receipt"}
      </button>

      {ocrText && (
        <div className="ocr-text">
          <h3>OCR Text</h3>
          <pre>{ocrText}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div className="results">
          <h3>Detected Items</h3>
          {results.map((r, i) => (
            <div key={i} className="card">
              <p><strong>Item:</strong> {r.item}</p>
              <p><strong>Carbon:</strong> {r.carbon} kg CO₂</p>
              <p><strong>Eco Swap:</strong> {r.swap}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
