"use client";
import React, { useState, useRef } from "react";

export default function CoughAnalyzer() {
  const [audioFile, setAudioFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
    setAnalysisResult(null);
  };

  const speakText = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "hi-IN"; // Speak in Hindi
      synth.speak(utter);
    }
  };

  const getGeminiResponse = async (result) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const score = result.score;
    const verdict = result.verdict;
    
    const prompt = `
आप एक अनुभवी और सहानुभूतिपूर्ण डॉक्टर हैं। मरीज ने अपनी खांसी की आवाज़ रिकॉर्ड की है, 
और हमारे विश्लेषण के अनुसार खांसी का स्कोर ${score}% है और वर्डिक्ट है: "${verdict}"।

कृपया हिंदी में 2-3 वाक्यों का एक सहानुभूतिपूर्ण और देखभालपूर्ण संदेश दें, 
जिससे मरीज को उचित मार्गदर्शन और समझ मिल सके।

अगर स्थिति सामान्य है, तो बधाई दें। अगर यह कोई समस्या दर्शाती है, 
तो मरीज को डॉक्टर से मिलने की सलाह दें और आवश्यक सावधानियाँ बताएं।
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], 'recorded_cough.wav', { type: 'audio/wav' });
        setAudioFile(file);
        setAnalysisResult(null);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Please allow microphone access");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const analyzeCough = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      // Send to your Flask backend
      const res = await fetch("http://localhost:5001/analyze-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data);

      // Get Gemini advice for all results
      const message = await getGeminiResponse(data);
      speakText(message);

    } catch (err) {
      console.error("Analysis failed", err);
      setAnalysisResult({ error: err.message });
      speakText("कुछ त्रुटि हुई है। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) return;
    await analyzeCough(audioFile);
  };

  const handleRecordedSubmit = async () => {
    if (!audioFile) return;
    await analyzeCough(audioFile);
  };

  return (
    <div className="text-white flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Cough Analyzer</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        {/* File Upload Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Audio File</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept=".wav,.mp3,.ogg,.flac"
              onChange={handleFileChange}
              className="bg-white text-black p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading || !audioFile}
            >
              {loading ? "Analyzing..." : "Analyze Cough"}
            </button>
          </form>
        </div>

        {/* Recording Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Or Record Directly</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`px-6 py-2 rounded ${
                recording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {recording ? 'Stop Recording' : 'Record Cough'}
            </button>
            
            {audioFile && !recording && (
              <button
                onClick={handleRecordedSubmit}
                className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Recorded Cough"}
              </button>
            )}
          </div>
          
          {recording && (
            <div className="mt-2 text-yellow-400 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Recording in progress... Cough and then stop
            </div>
          )}
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            {analysisResult.error ? (
              <div className="text-red-400">
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p>{analysisResult.error}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4 text-green-400">Analysis Results</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-600 p-3 rounded">
                    <h3 className="font-semibold">File:</h3>
                    <p>{analysisResult.file}</p>
                  </div>
                  
                  <div className="bg-gray-600 p-3 rounded">
                    <h3 className="font-semibold">Score:</h3>
                    <p className="text-2xl font-bold">{analysisResult.score}</p>
                  </div>
                </div>

                <div className="bg-gray-600 p-3 rounded mb-4">
                  <h3 className="font-semibold">Verdict:</h3>
                  <p className={`text-lg ${
                    analysisResult.verdict.includes('TB Likely') ? 'text-red-400' :
                    analysisResult.verdict.includes('Normal') ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {analysisResult.verdict}
                  </p>
                </div>

                {/* Features */}
                {analysisResult.features && (
                  <div className="bg-gray-600 p-3 rounded mb-4">
                    <h3 className="font-semibold mb-2">Audio Features:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p><span className="font-medium">Spectral Centroid:</span> {analysisResult.features.centroid_hz} Hz</p>
                      <p><span className="font-medium">Rolloff (95%):</span> {analysisResult.features.rolloff95_hz} Hz</p>
                      <p><span className="font-medium">Dominant Frequency:</span> {analysisResult.features.dom_freq_hz} Hz</p>
                      <p><span className="font-medium">Zero Crossing Rate:</span> {analysisResult.features.zcr}</p>
                      <p><span className="font-medium">RMS Energy:</span> {analysisResult.features.rms}</p>
                      <p><span className="font-medium">Crest Factor:</span> {analysisResult.features.crest}</p>
                    </div>
                  </div>
                )}

                {/* Frequency Bands */}
                {analysisResult.features?.band_fracs && (
                  <div className="bg-gray-600 p-3 rounded">
                    <h3 className="font-semibold mb-2">Frequency Band Distribution:</h3>
                    <div className="space-y-1">
                      <p><span className="font-medium">0-300 Hz:</span> {(analysisResult.features.band_fracs['0_300'] * 100).toFixed(2)}%</p>
                      <p><span className="font-medium">300-600 Hz:</span> {(analysisResult.features.band_fracs['300_600'] * 100).toFixed(2)}%</p>
                      <p><span className="font-medium">600-1200 Hz:</span> {(analysisResult.features.band_fracs['600_1200'] * 100).toFixed(2)}%</p>
                      <p><span className="font-medium">1200-2400 Hz:</span> {(analysisResult.features.band_fracs['1200_2400'] * 100).toFixed(2)}%</p>
                      <p><span className="font-medium">2400-4000 Hz:</span> {(analysisResult.features.band_fracs['2400_4000'] * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Information Section */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>This tool is for research purposes only. Not for medical diagnosis.</p>
        <p>Please consult a doctor for any health concerns.</p>
      </div>
    </div>
  );
}