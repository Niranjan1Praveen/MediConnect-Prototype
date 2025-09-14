import FeatureCard from "@/components/ui/featureCard";
import Tags from "@/components/ui/tags";
import Image from "next/image";
import dashboard from "@/assets/images/dashboard-new.png";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import Key from "@/components/ui/key";
import { ShineBorder } from "@/components/magicui/shine-border";
import { AuroraText } from "@/components/magicui/aurora-text";

const features = [
  "Voice-Guided Symptom Input",
  "AI-Based Triage Assistant",
  "Doctor Escalation Triggers",
  "Offline Sync Capability",
  "CSR Impact Analytics",
  "Emergency Hospital Referrals",
  "Jan Aushadhi Medicine Orders",
];

export default function Features() {
  return (
    <section
      className="py-24 px-4 flex items-center justify-center"
      id="features"
    >
      <div className="container">
        <div className="flex justify-center">
          <Tags title={"Platform Features"} />
        </div>
        <h2 className="text-5xl font-medium text-center mt-6 max-w-3xl mx-auto">
          Built for <span className="text-primary-400">Connected Rural Care</span>
        </h2>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
          {/* Card-1 */}
          <FeatureCard
            title={"CSR Health Impact Dashboards"}
            description={
              "Corporates can monitor rural diagnostic usage, doctor escalations, and medicine access in real-time—supporting Section 135 CSR compliance with visual proof of impact."
            }            
            className="md:col-span-2 lg:col-span-1"
          >
            <div className="aspect-video flex items-center justify-center">
              <Image
                src={dashboard}
                className="rounded-xl"
                height={650}
                width={650}
                alt="CSR-dashboard-design"
              />
            </div>
          </FeatureCard>

          {/* Card-2 */}
          <FeatureCard
            title={"Smart Voice-to-Prescription System"}
            description={
              "Doctors receive structured symptoms and audio diagnostics from the field, enabling them to issue AI-assisted prescriptions, dietary guidance, and alerts with one click."
            }                        
            className="md:col-span-2 lg:col-span-1"
          >
            <div className="relative aspect-video flex items-center justify-center overflow-hidden">
              <p className="text-3xl font-bold text-white/20 text-center leading-relaxed z-10">
                Even limited data can drive smarter care.{" "}
                <span className="bg-gradient-to-r from-primary-500 via-[#30f6d5] to-[#5EF7BA] bg-clip-text">
                  Precision
                </span>{" "}
                starts local.
              </p>
            </div>
          </FeatureCard>

          {/* Card-3 */}
          <FeatureCard
            title={"AI-Powered Clinic-to-Doctor Triage"}
            description={
              "Local clinics use voice to record symptoms and vitals—AI triages the case instantly, escalating to a verified doctor only when needed. No typing. No delay."
            }
            className="md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto"
          >
            <div className="aspect-video flex items-center justify-center relative w-full overflow-hidden min-h-[200px]">
              <OrbitingCircles radius={100}>
                <Key className={"w-28 p-5 text-sm md:text-lg"}>Vitals</Key>
                <Key className={"w-28 p-5 text-sm md:text-lg"}>Symptoms</Key>
                <Key className={"w-28 p-5 text-sm md:text-lg"}>History</Key>
              </OrbitingCircles>
            </div>
          </FeatureCard>
        </div>

        {/* Other Features */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {features.map((feature) => (
            <div
              key={feature}
              className="border-white/10 inline-flex gap-3 items-center px-3 md:px-5 py-1.5 md:py-2 rounded-2xl hover:scale-105 transition duration-500 group"
            >
              <span className="bg-primary-400 text-neutral-950 size-5 rounded-full inline-flex items-center justify-center text-xl group-hover:rotate-45 transition duration-500">
                &#10038;
              </span>
              <span className="font-medium md:text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
