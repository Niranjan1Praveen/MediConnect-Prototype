"use client";
import GLBModelViewer from "@/components/dashboard/GLBModelViewer";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import HeroGLB from "./HeroGLB";

export default function Hero() {
  const heroStrong = useMemo(
    () => ["Quality Care", "Digital Clinics", "Rural Access"],
    []
  );

  const [currentText, setCurrentText] = useState(heroStrong[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const currentIndex = heroStrong.indexOf(currentText);
        const nextIndex = (currentIndex + 1) % heroStrong.length;
        setCurrentText(heroStrong[nextIndex]);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [currentText, heroStrong]);

  return (
    <section className="py-4 px-4 flex items-center justify-center overflow-x-clip">
      <div className="container relative">
        <HeroGLB/>
        <div className="flex items-center justify-center">
          <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
            🩺 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText
              className="text-sm font-medium"
              speed={1}
              colorFrom="#4ade80"
              colorTo="#06b6d4"
            >
              Introducing MediConnect
            </AnimatedGradientText>
            <ChevronRight
              className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
            />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-medium text-center mt-6 max-w-6xl mx-auto leading-[1.15]">
          Bring{" "}
          <strong
            className={`transition font-medium fade-up ${
              fade ? "fade-in" : "fade-out"
            }`}
          >
            <AuroraText colors={["#4ade80", "#30f6d5", "#5EF7BA", "#06b6d4"]}>
              {currentText}
            </AuroraText>
          </strong>{" "}
          to India’s Heartlands
        </h1>

        <p className="text-center text-xl text-white/50 mt-8 max-w-4xl mx-auto leading-relaxed">
          MediConnect is a mobile-first diagnostic assistant for rural clinics —
          enabling voice-guided triage of wounds, skin conditions, cough (TB),
          and tongue health with zero typing. Powered by Supabase and AI
          triggers, with optional doctor escalation and real-time reporting.
        </p>

        <div className="flex mt-8 md:max-w-lg mx-auto items-center justify-center gap-5">
          <RainbowButton variant={"outline"} className="rounded-full p-5">
            Explore Platform
          </RainbowButton>
          <RainbowButton className="rounded-full p-5">
            <a href="#signUpOptions">Join the Mission</a>
          </RainbowButton>
        </div>
      </div>
    </section>
  );
}
