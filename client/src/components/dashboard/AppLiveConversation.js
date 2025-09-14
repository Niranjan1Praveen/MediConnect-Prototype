"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, CircleDot, Keyboard, Zap, Sparkles, Waves, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
const barHeights = [20, 32, 16, 40, 24, 40, 16, 32, 20];

// Pulse animation component
const PulseRing = ({ recording, size = "w-32 h-32" }) => (
  <div className={`relative ${size}`}>
    {recording && (
      <>
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-emerald-400/30 animate-ping animation-delay-75" />
        <div className="absolute inset-4 rounded-full bg-emerald-400/40 animate-ping animation-delay-150" />
      </>
    )}
  </div>
);

export default function AppLiveConversation() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [language, setLanguage] = useState("en-US");
  const [activeTab, setActiveTab] = useState("voice");
  const recognitionRef = useRef(null);
  const [patientId, setPatientId] = useState("");

  // Mock implementations for dependencies
  const toast = {
    loading: (message) => console.log('Loading:', message),
    success: (message, options) => console.log('Success:', message),
    error: (message, options) => console.log('Error:', message),
  };

  const router = useRouter(); 

  const uuidv4 = () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9);

  useEffect(() => {
    setPatientId(uuidv4());
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript((prev) => prev + finalTranscript + " ");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const handleSave = async (content) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("Content is empty.");
      return;
    }

    const toastId = toast.loading("Saving content...");

    try {
      const res = await fetch("/api/voice-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: trimmedContent,
          patientId: patientId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to save content");
      }

      toast.success("Content saved successfully!", { id: toastId });

      // Clear inputs after successful save
      if (activeTab === "voice") {
        setTranscript("");
      } else {
        setManualInput("");
      }
    } catch (error) {
      toast.error(`Failed to save content: ${error.message}`, {
        id: toastId,
      });
    }
    setTimeout(() => router.push("/doctor/digiPrescription"), 1000);
  };

  const handleStartRecording = () => {
    setRecording(true);
    setStartTime(Date.now());
    setEndTime(null);
    setTranscript("");
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } else {
      console.error("Speech recognition not available");
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleStopRecording = () => {
    setRecording(false);
    setEndTime(Date.now());
    if (!recognitionRef.current) {
      console.error("No recognition instance available");
      alert("Speech recognition is not available.");
      return;
    }
    recognitionRef.current.stop();
  };

  const getDuration = () => {
    if (startTime && endTime) {
      const durationInSeconds = Math.floor((endTime - startTime) / 1000);
      return `${durationInSeconds}s`;
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
    
      <div className="relative z-10 flex items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="h-px bg-gradient-to-r from-emerald-400 to-teal-400 w-24" />
              <Waves className="w-8 h-8 text-emerald-400" />
              <div className="h-px bg-gradient-to-r from-teal-400 to-emerald-400 w-24" />
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Live Conversation Capture
            </h2>
            <p className="text-slate-300 text-lg">
              Doctor & Patient Dialogue
            </p>
          </div>

          {/* Main Content Card */}
          <div className="relative">
            {/* Card Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl" />
            
            <div className="relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
              {/* Tab Selector */}
              <div className="flex mb-8 justify-center">
                <div className="flex bg-slate-900/60 backdrop-blur-sm rounded-2xl p-1 border border-slate-700/50">
                  <Button
                    variant="ghost"
                    className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === "voice"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                    onClick={() => setActiveTab("voice")}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Input
                  </Button>
                  <Button
                    variant="ghost"
                    className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === "text"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                    onClick={() => setActiveTab("text")}
                  >
                    <Keyboard className="w-4 h-4 mr-2" />
                    Text Input
                  </Button>
                </div>
              </div>

              {activeTab === "voice" ? (
                <div className="flex flex-col items-center space-y-8">
                  {/* Language Selector and Record Button */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 focus:outline-none transition-all duration-300"
                      >
                        <option value="en-US" className="bg-slate-900">
                          English
                        </option>
                        <option value="hi-IN" className="bg-slate-900">
                          Hindi
                        </option>
                      </select>
                    </div>

                    <Button
                      className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                        recording
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25"
                      }`}
                      onClick={
                        recording ? handleStopRecording : handleStartRecording
                      }
                    >
                      {recording ? (
                        <>
                          <CircleDot className="w-4 h-4 mr-2 animate-pulse" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Start Now
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Recording Visualization */}
                  <div className="relative flex flex-col items-center space-y-6">
                    {/* Microphone with Pulse Effect */}
                    <div className="relative flex items-center justify-center">
                      <PulseRing recording={recording} size="w-32 h-32" />
                      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        recording 
                          ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50" 
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50"
                      }`}>
                        <Mic className="text-white w-10 h-10" />
                      </div>
                      {recording && (
                        <div className="absolute top-0 right-0">
                          <CircleDot className="text-red-400 animate-ping w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Audio Visualizer */}
                    <div className="flex items-center gap-1">
                      {barHeights.map((height, i) => (
                        <div
                          key={i}
                          className={`w-2 rounded-full transition-all duration-300 ${
                            recording 
                              ? "bg-gradient-to-t from-emerald-500 to-teal-400" 
                              : "bg-slate-600"
                          }`}
                          style={{ 
                            height: `${recording ? height : 20}px`,
                            animation: recording ? `pulse 2s infinite ${i * 0.1}s` : 'none'
                          }}
                        />
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-80 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300 ${
                          recording ? 'w-full animate-pulse' : 'w-0'
                        }`}
                      />
                    </div>

                    {/* Recording Status */}
                    {startTime && (
                      <div className="text-center space-y-2">
                        <p className="text-slate-300">
                          {recording ? (
                            <span className="flex items-center justify-center gap-2">
                              <CircleDot className="w-4 h-4 text-red-400 animate-pulse" />
                              Recording in progress...
                            </span>
                          ) : (
                            `Duration: ${getDuration()}`
                          )}
                        </p>
                        {recording && (
                          <button
                            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 text-sm underline"
                            onClick={handleStopRecording}
                          >
                            Click to stop recording
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Transcript Display */}
                  {!recording && transcript && (
                    <div className="w-full max-w-2xl space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur" />
                        <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-lg font-semibold text-white">Transcript</h3>
                          </div>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {transcript}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSave(transcript)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Save Transcript
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="manual-input" className="text-lg font-semibold text-white flex items-center gap-2">
                      <Keyboard className="w-5 h-5 text-emerald-400" />
                      Enter Conversation Manually
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur" />
                      <Textarea
                        id="manual-input"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="Type the conversation here..."
                        className="relative min-h-[300px] bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:border-emerald-500/50 focus:outline-none resize-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSave(manualInput)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!manualInput.trim()}
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Save Text
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.8); }
        }
      `}</style>
    </div>
  );
}