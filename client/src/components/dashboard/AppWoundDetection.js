"use client";
import { useState } from "react";

export default function AppWoundDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null);
  const [hindiExplanation, setHindiExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const FLASK_URL = "http://localhost:5003/classify";
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPredictedClass(null);
    setHindiExplanation(null);
    setError(null);
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const speakHindi = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    speechSynthesis.speak(utterance);
  };

  const getHindiExplanation = async (englishClass) => {
    const prompt = `
This is a wound type: "${englishClass}"

Explain this in simple Hindi in one or two lines, so that a rural person can easily understand what kind of injury it is. Speak as if a friendly village doctor is explaining it. Do not translate. Only explain in Hindi. Be empathetic and very simple.
`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const explanation =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "जानकारी उपलब्ध नहीं है।";
      return explanation;
    } catch (err) {
      console.error("Gemini error:", err);
      return "जानकारी लाने में दिक्कत हुई।";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(FLASK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get classification result.");
      }

      const data = await response.json();
      const predicted = data.predicted_class;
      setPredictedClass(predicted);

      const hindi = await getHindiExplanation(predicted);
      setHindiExplanation(hindi);
      speakHindi(hindi);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Wound Type Classifier
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />

        {previewURL && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
            <img
              src={previewURL}
              alt="Preview"
              className="rounded-lg border shadow w-fit"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Analyzing..." : "Classify Wound"}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
      )}

      {predictedClass && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded space-y-2">
          <h3 className="text-lg font-semibold text-green-700">
            Predicted Wound Type:
          </h3>
          <p className="text-xl text-green-800">{predictedClass}</p>

          {hindiExplanation && (
            <div>
              <p className="text-base text-green-800 whitespace-pre-wrap">
                {hindiExplanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
