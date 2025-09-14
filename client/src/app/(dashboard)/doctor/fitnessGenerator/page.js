"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://bnminmdgnjnkfkxfdgcf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubWlubWRnbmpua2ZreGZkZ2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMDU0NzAsImV4cCI6MjA2NDc4MTQ3MH0.SoQYKjq_QMNKs5W6zK-ujVE2t9i1Zr-uiiEHJyzqifk";

const supabase = createClient(supabaseUrl, supabaseKey);

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyDHYdZDd5hyGPyw47CW0SDB8-WcMlgvYgs";

export default function AIDietPage() {
  const [patientName, setPatientName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fullPlan, setFullPlan] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState("");
  const [error, setError] = useState("");

  // Search patient names
  const searchPatients = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Patient")
        .select("name")
        .ilike("name", `%${query}%`)
        .limit(10);

      if (error) throw error;
      setSuggestions(data.map((item) => item.name));
    } catch (err) {
      console.error("Error searching patients:", err);
      setSuggestions([]);
    }
  };

  // Get patient by name
  const getPatientByName = async (name) => {
    try {
      const { data, error } = await supabase
        .from("Patient")
        .select("*")
        .eq("name", name)
        .limit(1);

      if (error) throw error;
      return data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error("Error getting patient:", err);
      return null;
    }
  };

  // Generate fitness plan using Gemini API
  const generateFitnessPlan = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate plan");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error("Gemini API error:", err);
      throw new Error("Sorry, could not generate the plan at the moment.");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPatientName(value);
    searchPatients(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (name) => {
    setPatientName(name);
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!patientName.trim()) {
      setError("Patient name is required.");
      return;
    }

    setIsLoading(true);

    try {
      const patient = await getPatientByName(patientName);

      if (!patient) {
        setError(`No patient found with name '${patientName}'.`);
        setIsLoading(false);
        return;
      }

      const prompt = `
You are a certified health expert. Create a customized **diet plan** and **exercise routine** for the following patient:

Name: ${patient.name || "N/A"}
Age: ${patient.age || "N/A"}
Dietary Preferences: ${patient.dietaryPreferences || "N/A"}
Health Goals: ${patient.healthGoals || "N/A"}
Conditions: ${patient.conditions || "N/A"}
Allergies: ${patient.allergies || "N/A"}
Key Issues: ${patient.keyIssues || "N/A"}
Medications: ${patient.medications || "N/A"}
Prescription Text: ${patient.prescriptionText || "N/A"}

Instructions:
1. The diet plan should be practical, economical, and for lower, middle class indian people.
2. The exercise plan should consider the patient's health conditions and be suitable for daily practice.
3. Avoid any special characters, markdown, or formatting like asterisks and use only numbers as pointers.
4. Use plain text and clear headings like 'Diet Plan:' and 'Exercise Plan:'.
5. Provide a complete and friendly plan for both diet and fitness.
6. Do not include any medical disclaimers, suggestions to consult a doctor or dietitian, or generic safety notes. Provide only the requested personalized diet and exercise plan.
`;

      const plan = await generateFitnessPlan(prompt);
      setFullPlan(plan);
      setEditedPlan(plan);
      setSelectedPatientName(patientName);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      setFullPlan(editedPlan);
    }
    setIsEditing(!isEditing);
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".suggestions-container") &&
        !e.target.closest("#patient_name")
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                AI-Powered Fitness Generator
              </h1>
              <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
            </div>
            <p className="text-slate-300 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
              Transform your health journey with personalized AI-driven fitness
              and nutrition plans
            </p>
          </div>

          {/* Form Section */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <label
                    htmlFor="patient_name"
                    className="block mb-3 text-emerald-400 font-semibold text-lg"
                  >
                    Patient Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="patient_name"
                      value={patientName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-slate-800/70 hover:border-emerald-500/50"
                      placeholder="Enter patient name..."
                      autoComplete="off"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-teal-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {suggestions.length > 0 && (
                    <div className="suggestions-container absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-xl z-50 shadow-2xl">
                      {suggestions.map((name, index) => (
                        <div
                          key={index}
                          className="p-4 text-slate-200 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 border-b border-slate-700 last:border-b-0 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
                          onClick={() => handleSuggestionClick(name)}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 disabled:hover:scale-100 disabled:hover:shadow-none group"
                >
                  <span className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Plan...</span>
                      </div>
                    ) : (
                      "Generate Plan"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl text-red-400 text-center animate-pulse">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {fullPlan && (
            <div className="w-full animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  Fitness Plan for {selectedPatientName}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                  {!isEditing ? (
                    <div className="relative">
                      <pre className="text-slate-200 whitespace-pre-wrap text-sm md:text-base leading-relaxed min-h-96 overflow-x-auto p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                        {fullPlan}
                      </pre>
                      <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <textarea
                        value={editedPlan}
                        onChange={(e) => setEditedPlan(e.target.value)}
                        className="w-full text-slate-200 p-6 rounded-xl bg-slate-900/50 border border-slate-700 min-h-96 text-sm md:text-base leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                      />
                      <div className="absolute top-4 right-4 w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <button
                      type="button"
                      onClick={toggleEdit}
                      className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25 group"
                    >
                      <span className="relative z-10">
                        {isEditing ? "💾 Save Changes" : "✏️ Edit Plan"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
