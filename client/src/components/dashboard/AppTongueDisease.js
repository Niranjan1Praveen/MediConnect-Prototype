"use client";
import React, { useState } from "react";

export default function AppTongueDisease() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrediction("");
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";
    synth.speak(utter);
  };

  const getGeminiResponse = async (prediction) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const prompt = `
आप एक अनुभवी और सहानुभूतिपूर्ण डॉक्टर हैं। मरीज ने अपनी जीभ की एक तस्वीर अपलोड की है, और मशीन लर्निंग मॉडल द्वारा इसका वर्गीकरण '${prediction}' के रूप में किया गया है।

कृपया हिंदी में 2-3 वाक्यों का एक सहानुभूतिपूर्ण और देखभालपूर्ण संदेश दें जिसमें निम्न शामिल हो:
1. '${prediction}' जीभ की स्थिति का सरल स्पष्टीकरण
2. संभावित कारणों के बारे में संक्षिप्त जानकारी
3. मरीज को उचित मार्गदर्शन और सलाह

विशेष रूप से इन स्थितियों के लिए स्पष्टीकरण:
- 'black': काली जीभ की स्थिति क्या है और इसके संभावित कारण
- 'geographic': भौगोलिक जीभ क्या है, क्या यह चिंताजनक है
- 'coated': लेपित जीभ क्या दर्शाती है, इसके क्या मतलब हो सकते हैं
- 'red': लाल जीभ के संभावित कारण और महत्व
- 'yellow': पीली जीभ क्या संकेत दे सकती है
- 'normal': स्वस्थ जीभ की विशेषताएं

अगर स्थिति सामान्य है, तो बधाई दें और स्वस्थ जीभ के लिए टिप्स दें। अगर यह कोई समस्या दर्शाती है, तो मरीज को डॉक्टर से मिलने की सलाह दें और आश्वस्त करें कि जल्द ध्यान देने से मदद मिल सकती है।
`;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
          apiKey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const textResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return textResponse;
    } catch (err) {
      console.error("Gemini API Error:", err);
      return "हम क्षमा चाहते हैं, लेकिन कोई सुझाव प्राप्त नहीं हो सका। कृपया एक डॉक्टर से संपर्क करें।";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setPrediction("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const predicted = data.prediction;
      setPrediction(predicted);

      // If prediction is severe, get advice from Gemini
      const seriousLabels = ["black", "geographic"];
      let message = "";

      if (seriousLabels.includes(predicted.toLowerCase())) {
        message = await getGeminiResponse(predicted);
      } else {
        message = `आपकी जीभ की स्थिति '${predicted}' पाई गई है। चिंता न करें, यह सामान्य हो सकती है, लेकिन स्वस्थ जीवनशैली बनाए रखें।`;
      }

      speakText(message);
    } catch (err) {
      console.error("Prediction failed", err);
      setPrediction("Error occurred.");
      speakText("कुछ त्रुटि हुई है। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Tongue Disease Predictor</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-white text-black p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {prediction && (
        <div className="mt-6">
          <h2 className="text-xl text-green-400">Prediction: {prediction}</h2>
        </div>
      )}
    </div>
  );
}
