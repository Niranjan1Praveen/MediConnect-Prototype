"use client";
import Tags from "@/components/ui/tags";
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const text = `Millions in rural India still struggle to receive basic diagnosis — not because they don't seek help, but due to disconnected systems, unreachable doctors, and inaccessible tools.`;
const words = text.split(" ");

export default function Introduction() {
  const scrollTarget = useRef();
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start end", "end end"],
  });

  const [currentWord, setCurrentWord] = useState(0);
  const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);

  useEffect(() => {
    wordIndex.on("change", (latest) => {
      setCurrentWord(latest);
    });
  }, [wordIndex]);

  return (
    <section className="relative py-28 px-4 lg:py-30 flex items-center justify-center">
      <div className="container">
        <div className="sticky top-20 md:top-28 lg:top-40">
          <div className="flex justify-center">
            <Tags title={"Introduction"} />
          </div>
          <div className="text-4xl md:text-5xl text-center font-light mt-10">
            <span>
              Rural diagnosis needs to be voice-first, mobile-ready, and
              AI-assisted.
            </span>{" "}
            <span className="text-white/15 leading-snug">
              {words.map((word, index) => {
                const isVisible = index < currentWord;
                const shouldHightlight =
                  isVisible &&
                  (word.toLowerCase().includes("disconnected") ||
                    word.toLowerCase().includes("unreachable") ||
                    word.toLowerCase().includes("unaffordable"));

                return (
                  <span
                    key={index}
                    className={twMerge(
                      "transition duration-500",
                      isVisible ? "text-white" : "text-white/15",
                      isVisible &&
                        shouldHightlight &&
                        "text-red-500 italic transition"
                    )}
                  >
                    {word + " "}
                  </span>
                );
              })}
            </span>
            <span className="text-primary-400 block mt-3">
              That’s why we built MediConnect!
            </span>
          </div>
        </div>
        <div className="h-[150vh]" ref={scrollTarget}></div>
      </div>
    </section>
  );
}
