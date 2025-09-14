"use client";
import React, { useState } from "react";
import AppTongueDisease from "@/components/dashboard/AppTongueDisease";
import GLBModelViewer from "@/components/dashboard/GLBModelViewer";
import AppTBDetector from "@/components/dashboard/AppTBDetector";
import AppWoundDetection from "@/components/dashboard/AppWoundDetection";

export default function Page() {
  const [selectedModel, setSelectedModel] = useState("null");

  const renderModel = () => {
    switch (selectedModel) {
      case "model1":
        return <AppTongueDisease />;
      case "model2":
        return <div className="text-white"><AppTBDetector/></div>;
      case "model3":
        return <div className="text-white"><AppWoundDetection/></div>;
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-6 gap-6">
      
      <GLBModelViewer url="/assets/models/assistant.glb" height={500} />

      <label className="1text-lg mt-4">What kind of diagnosis do you need?</label>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white"
      >
        <option value="null">No Model Selected</option>
        <option value="model1">Model 1 - Tongue Disease</option>
        <option value="model2">Model 2 - TB Detector</option>
        <option value="model3">Model 3 - Wound Detection</option>
      </select>

      <div className="mt-6 w-full">{renderModel()}</div> 
    </main>
  );
}
