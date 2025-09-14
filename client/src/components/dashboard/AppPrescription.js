"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, FileText, Download, Send, Trash2, User, Calendar, Heart, AlertCircle, Pill, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import Loader from "../ui/loader";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import SignaturePad from "@/components/dashboard/AppSignaturePad";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AppPrescription() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    healthGoals: "",
    allergies: "",
    conditions: "",
    keyIssues: "",
    decisions: "",
    medications: "",
    dietaryPreferences: [],
  });
  console.log(formData);
  
  const [conversation, setConversation] = useState("");
  const [prescription, setPrescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [medications, setMedications] = useState([]);

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: "",
        dosage: "",
        frequency: "",
        instructions: "",
      },
    ]);
  };
  const printRef = useRef(null);

  const handleDownloadPdf = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        console.error("Element not found");
        return;
      }

      // Create a deep clone of the element to avoid modifying the original
      const clone = element.cloneNode(true);

      // Position the clone off-screen
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = `${element.offsetWidth}px`;
      clone.style.backgroundColor = "#ffffff";
      clone.style.color = "#000000";
      clone.style.padding = "20px";
      // Append to body temporarily
      document.body.appendChild(clone);

      // Convert all oklch/oklab colors to safe RGB/HEX
      const allElements = clone.querySelectorAll("*");
      allElements.forEach((el) => {
        const computed = window.getComputedStyle(el);

        const sanitizeColor = (value) => {
          if (value.includes("oklch") || value.includes("oklab")) {
            return "#000000"; // fallback text/border color
          }
          return value;
        };

        const sanitizeBg = (value) => {
          if (value.includes("oklch") || value.includes("oklab")) {
            return "#ffffff"; // fallback background
          }
          return value;
        };

        el.style.color = sanitizeColor(computed.color);
        el.style.backgroundColor = sanitizeBg(computed.backgroundColor);

        const colorProps = [
          "borderColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
        ];

        colorProps.forEach((prop) => {
          const current = computed.getPropertyValue(prop);
          if (current.includes("oklch") || current.includes("oklab")) {
            el.style.setProperty(prop, "#000000");
          }
        });
      });

      // Render to canvas
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        logging: true,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          return element.classList?.contains("no-print");
        },
      });

      document.body.removeChild(clone);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas is empty");
      }

      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(`report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please check console for details.");
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = [...medications];
    updatedMeds[index][field] = value;
    setMedications(updatedMeds);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchAutoFill = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/generate-prescription");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.error) {
          toast.error("Failed: " + data.error);
          return;
        }

        if (data.conversation) {
          setConversation(data.conversation);
        }
        if (data.digiPrescription) {
          setPrescription(data.digiPrescription);
        }
        if (data.fields) {
          setFormData((prev) => ({
            ...prev,
            ...data.fields,
            age: data.fields.age ? String(data.fields.age) : "",
            dietaryPreferences: data.fields.dietaryPreferences || [],
          }));
          toast.success("Form auto-filled from conversation");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to auto-fill from conversation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutoFill();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDietaryChange = (preference) => {
    setFormData((prev) => {
      const dietaryPreferences = prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference];
      return { ...prev, dietaryPreferences };
    });
  };

  const handleFinalize = async () => {
    try {
      const res = await fetch("/api/patient-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prescriptionText: prescription,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      toast.success("Prescription saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save prescription to database");
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      age: "",
      healthGoals: "",
      allergies: "",
      conditions: "",
      keyIssues: "",
      decisions: "",
      medications: "",
      dietaryPreferences: [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-75 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-emerald-400 to-teal-400 p-3 rounded-xl">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Digital Prescription
                    </h1>
                    <p className=" mt-1">Doctor & Patient Dialogue</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadPdf}
                    className="border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 hover:text-emerald-200 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Save as PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={printRef}>
            {/* Patient Information Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-emerald-300">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className=" flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Name
                      </Label>
                      <Input
                        value={formData.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter patient name"
                        className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className=" flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Age
                      </Label>
                      <Input
                        value={formData.age || ""}
                        onChange={(e) => handleChange("age", e.target.value)}
                        placeholder="Enter age"
                        className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                        type="text"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Details Card */}
              <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-emerald-300">
                    <AlertCircle className="h-5 w-5" />
                    Medical Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className=" font-medium">Key Issues</Label>
                    <Textarea
                      value={formData.keyIssues || ""}
                      onChange={(e) => handleChange("keyIssues", e.target.value)}
                      placeholder="e.g. fatigue, low energy, breathing issues"
                      className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className=" font-medium">Decisions & Recommendations</Label>
                    <Textarea
                      value={formData.decisions || ""}
                      onChange={(e) => handleChange("decisions", e.target.value)}
                      placeholder="e.g. perform blood tests, chest X-ray, follow-up in 2 weeks"
                      className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className=" font-medium">
                      Current Medications <span className="font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      value={formData.medications || ""}
                      onChange={(e) => handleChange("medications", e.target.value)}
                      placeholder="e.g. inhaler, blood pressure medication"
                      className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle & Preferences Card */}
              <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-emerald-300">
                    <Heart className="h-5 w-5" />
                    Lifestyle & Health Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <Label className=" font-medium flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Dietary Preferences <span className="font-normal">(Optional)</span>
                    </Label>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.dietaryPreferences.includes("Vegetarian")}
                          onCheckedChange={() => handleDietaryChange("Vegetarian")}
                          className="border-emerald-400/30 data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400"
                        />
                        <span className="">Vegetarian</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.dietaryPreferences.includes("Gluten-Free")}
                          onCheckedChange={() => handleDietaryChange("Gluten-Free")}
                          className="border-emerald-400/30 data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400"
                        />
                        <span className="">Gluten-Free</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className=" font-medium">
                        Health Goals <span className="font-normal">(Optional)</span>
                      </Label>
                      <Textarea
                        value={formData.healthGoals || ""}
                        onChange={(e) => handleChange("healthGoals", e.target.value)}
                        placeholder="Weight Loss, Heart Health, Muscle Gain"
                        className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className=" font-medium">
                        Allergies <span className="font-normal">(Optional)</span>
                      </Label>
                      <Input
                        value={formData.allergies || ""}
                        onChange={(e) => handleChange("allergies", e.target.value)}
                        placeholder="e.g. peanuts, dairy, penicillin"
                        className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className=" font-medium">
                      Existing Conditions <span className="font-normal">(Optional)</span>
                    </Label>
                    <Input
                      value={formData.conditions}
                      onChange={(e) => handleChange("conditions", e.target.value)}
                      placeholder="Hypertension, Diabetes, High Cholesterol"
                      className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Signature Section */}
              <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="text-emerald-300">Doctors Signature</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="no-print">
                    <SignaturePad
                      onSave={(signature) => handleChange("signature", signature)}
                    />
                  </div>

                  {formData.signature && (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">Saved signature:</p>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <img
                          src={formData.signature}
                          alt="Doctor's signature"
                          className="h-20 max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-between flex-wrap">
                <Button
                  className="no-print bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={handleFinalize}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Finalize & Send
                </Button>
                <Button
                  className="no-print bg-slate-700/50 hover:bg-slate-700  border border-slate-600 hover:border-slate-500 transition-all duration-300"
                  onClick={handleClear}
                  variant="outline"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </div>
            </div>

            {/* Medications Section */}
            <div className="space-y-6">
              <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 text-emerald-300">
                    <Pill className="h-5 w-5" />
                    Prescribed Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Button
                    variant="outline"
                    className="w-full no-print border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 hover:text-emerald-200 transition-all duration-300 mb-4"
                    onClick={addMedication}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Medication
                  </Button>

                  <div className="space-y-4">
                    {medications.map((med, index) => (
                      <Card key={index} className="backdrop-blur-xl bg-white/5 border-white/10 hover:border-emerald-400/30 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                          <CardTitle className="text-sm font-medium text-emerald-300">
                            Medication {index + 1}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMedication(index)}
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`med-name-${index}`} className="">
                              Medication Name
                            </Label>
                            <Input
                              id={`med-name-${index}`}
                              value={med.name || ""}
                              onChange={(e) =>
                                handleMedicationChange(index, "name", e.target.value)
                              }
                              placeholder="e.g., Amoxicillin"
                              className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor={`med-dosage-${index}`} className="">
                                Dosage
                              </Label>
                              <Input
                                id={`med-dosage-${index}`}
                                value={med.dosage || ""}
                                onChange={(e) =>
                                  handleMedicationChange(index, "dosage", e.target.value)
                                }
                                placeholder="e.g., 500mg"
                                className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`med-frequency-${index}`} className="">
                                Frequency
                              </Label>
                              <Input
                                id={`med-frequency-${index}`}
                                value={med.frequency}
                                onChange={(e) =>
                                  handleMedicationChange(index, "frequency", e.target.value)
                                }
                                placeholder="e.g., Twice daily"
                                className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`med-instructions-${index}`} className="">
                              Special Instructions
                            </Label>
                            <Input
                              id={`med-instructions-${index}`}
                              value={med.instructions}
                              onChange={(e) =>
                                handleMedicationChange(index, "instructions", e.target.value)
                              }
                              placeholder="e.g., Take with food"
                              className="bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}