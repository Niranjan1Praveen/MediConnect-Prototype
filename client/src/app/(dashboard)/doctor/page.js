"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Mic,
  Stethoscope,
  Search,
  FileText,
  Utensils,
  Dumbbell,
  BarChart,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
} from "lucide-react";

const features = [
  {
    title: "Teleconsultation",
    url: "/dashboard/liveConversation",
    icon: Mic,
    description:
      "Secure video/audio consultations between patients and doctors",
  },
  {
    title: "e-Prescriptions",
    url: "/dashboard/digiPrescription",
    icon: Stethoscope,
    description: "AI-powered structured prescriptions from basic symptoms",
  },
  {
    title: "Personalized Care Plans",
    url: "/dashboard/fitnessGenerator",
    icon: Utensils,
    description: "Diet and exercise recommendations based on patient data",
  },
  {
    title: "Diagnostic Triaging",
    url: "http://127.0.0.1:5001",
    icon: BarChart,
    description: "AI suggests relevant lab tests based on symptoms",
  },
  {
    title: "Health Records",
    url: "/dashboard/searchPrescription",
    icon: Search,
    description: "Maintains longitudinal care records for patients",
  },
  {
    title: "Medicine Ordering",
    url: "/dashboard/liveConversation",
    icon: FileText,
    description: "Integrated ordering from low-cost government pharmacies",
  },
];

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = parseInt(value);
    const duration = 2000;
    const increment = target / (duration / 16);

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-bold text-2xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
      {count}
      {suffix}
    </span>
  );
};

export default function MediConnectDashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-6">
        <main className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <section className="lg:col-span-3 w-full">
            {/* Hero Section */}
            <section className="mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl" />
                <div className="relative backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-emerald-400 to-teal-400 flex-1" />
                  </div>

                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    Bridging Rural Healthcare with{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
                      MediConnect
                    </span>
                  </h1>

                  <p className="text-xl text-slate-200 max-w-4xl leading-relaxed">
                    Smart telehealth platform connecting village clinics to
                    urban specialists, reducing care gaps by{" "}
                    <span className="text-emerald-400 font-semibold">70%</span>{" "}
                    through AI-powered diagnostics and minimal-data workflows.
                  </p>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={feature.title}
                    className="group relative h-full overflow-hidden border-0 transition-all duration-500 hover:scale-105"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Card background */}
                    <div className="absolute inset-0 backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-lg group-hover:border-emerald-500/30 transition-all duration-500" />

                    <div className="relative z-10 p-6 h-full flex flex-col">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl mb-4 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-500">
                          <feature.icon className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-500" />
                        </div>
                        <CardTitle className="text-white text-lg group-hover:text-emerald-400 transition-colors duration-500">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-0 flex-grow">
                        <CardDescription className="text-slate-300 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>

                      <CardFooter className="p-0 mt-6">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/25"
                          onClick={() => (window.location.href = feature.url)}
                        >
                          Explore Now
                          <div className="ml-2 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-500">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </section>

          {/* Sidebar */}
          <section className="lg:col-span-1 w-full">
            <div className="relative">
              {/* Sidebar background glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl" />

              <div className="relative backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    Why NGOs Choose{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      MediConnect
                    </span>
                    ?
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* Stat 1 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 group-hover:border-emerald-500/30 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          <AnimatedCounter value="70" suffix="%" /> Faster
                          Access
                        </h3>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Reduces time to specialist care in rural areas
                      </p>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 group-hover:border-teal-500/30 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          <AnimatedCounter value="60" suffix="%" /> Cost Savings
                        </h3>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Affordable care through Jan Aushadhi integration
                      </p>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6 group-hover:border-emerald-500/30 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          CSR-Ready Platform
                        </h3>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Built for corporate social responsibility healthcare
                        projects
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
