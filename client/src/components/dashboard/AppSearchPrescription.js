"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Search, User, Calendar, Heart, AlertCircle, Pill, UtensilsCrossed, FileText, Clock } from "lucide-react";

export default function AppSearchPrescription() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-prescription");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Search patients by name
  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/get-prescription?name=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();      
      setPatients(data);
      console.log(patients);
      
    } catch (error) {
      console.error("Error searching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (value) => {
    const patient = patients.find((p) => p.id === parseInt(value));
    setSelectedPatient(patient);
  };
  console.log(patients);
  
  return (
    <section className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-emerald-400 to-teal-400 p-3 rounded-xl">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Patient Records
                  </h1>
                  <p className="text-slate-300 mt-1">Search and manage patient prescriptions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 mb-6">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-emerald-300">
                <Search className="h-5 w-5" />
                Search Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  <Input
                    placeholder="Filter patient by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 bg-white/5 border-white/10 text-white  focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading} 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 px-6"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </div>
                  )}
                </Button>
              </div>
              
              <div className="flex justify-between gap-3"> 
                <Select onValueChange={handlePatientSelect}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300">
                    <SelectValue placeholder="Select a patient" className="text-slate-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {patients.map((patient) => (
                      <SelectItem 
                        key={patient.id} 
                        value={patient.id.toString()}
                        className="text-white hover:bg-slate-700 focus:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-emerald-400" />
                          {patient.name} ({patient.age})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="destructive"
                  className="bg-red-500/80 hover:bg-red-500 border-red-400/30 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patient Details Section */}
          {selectedPatient && (
            <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-emerald-300">
                  <User className="h-5 w-5" />
                  Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <User className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-slate-400">Patient Name</p>
                        <p className="text-white font-medium">{selectedPatient.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Calendar className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-slate-400">Age</p>
                        <p className="text-white font-medium">{selectedPatient.age} years</p>
                      </div>
                    </div>

                    {selectedPatient.createdAt && (
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <Clock className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-sm text-slate-400">Created At</p>
                          <p className="text-white font-medium">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    {selectedPatient.allergies && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <p className="text-sm text-slate-400">Allergies</p>
                        </div>
                        <p className="text-white">{selectedPatient.allergies}</p>
                      </div>
                    )}

                    {selectedPatient.conditions && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-red-400" />
                          <p className="text-sm text-slate-400">Existing Conditions</p>
                        </div>
                        <p className="text-white">{selectedPatient.conditions}</p>
                      </div>
                    )}

                    {selectedPatient.medications && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-blue-400" />
                          <p className="text-sm text-slate-400">Current Medications</p>
                        </div>
                        <p className="text-white">{selectedPatient.medications}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full-width sections */}
                <div className="mt-6 space-y-4">
                  {selectedPatient.keyIssues && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                        <p className="text-sm text-slate-400 font-medium">Key Issues</p>
                      </div>
                      <p className="text-white leading-relaxed">{selectedPatient.keyIssues}</p>
                    </div>
                  )}

                  {selectedPatient.healthGoals && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-5 w-5 text-emerald-400" />
                        <p className="text-sm text-slate-400 font-medium">Health Goals</p>
                      </div>
                      <p className="text-white leading-relaxed">{selectedPatient.healthGoals}</p>
                    </div>
                  )}

                  {selectedPatient.dietaryPreferences && selectedPatient.dietaryPreferences.length !== 0 && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <UtensilsCrossed className="h-5 w-5 text-teal-400" />
                        <p className="text-sm text-slate-400 font-medium">Dietary Preferences</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const parsed = JSON.parse(selectedPatient.dietaryPreferences);
                            const preferences = Array.isArray(parsed) ? parsed : [parsed];
                            return preferences.map((pref, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm"
                              >
                                {pref}
                              </span>
                            ));
                          } catch {
                            return (
                              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm">
                                {selectedPatient.dietaryPreferences}
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}