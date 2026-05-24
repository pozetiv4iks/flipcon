"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";

const letters = [
  { char: "f", src: "/images/letters/f.png" },
  { char: "l", src: "/images/letters/l.png" },
  { char: "i", src: "/images/letters/i.png" },
  { char: "p", src: "/images/letters/p.png" },
  { char: "c", src: "/images/letters/c.png" },
  { char: "o", src: "/images/letters/o.png" },
  { char: "n", src: "/images/letters/n.png" },
];

export const LoadingScreen = ({ 
  text, 
  showLogo = false 
}: { 
  text?: string; 
  showLogo?: boolean 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letterElements = containerRef.current.querySelectorAll(".loading-letter");

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(letterElements, {
      y: -20,
      opacity: 1,
      filter: "brightness(0) invert(1)", // Force white
      duration: 0.5,
      stagger: {
        each: 0.1,
        repeat: 1,
        yoyo: true,
      },
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#040035] bg-[radial-gradient(ellipse_120%_80%_at_50%_20%,#040035_0%,#000000_75%)]">
      {showLogo && (
        <div className="">
          <AuthPageLogo />
        </div>
      )}
      
      {text && (
        <h2 className="mb-6 text-[18px] font-bold tracking-tight text-white">
          {text}
        </h2>
      )}

      <div 
        ref={containerRef}
        className="flex items-center"
        style={{ gap: "7.47px" }}
      >
        {letters.map((letter, index) => (
          <div
            key={`${letter.char}-${index}`}
            className="loading-letter relative flex items-center justify-center"
            style={{ 
              height: "36.76px",
              opacity: 0.2, // Base state: very dimmed
              filter: "brightness(0) invert(1)", // Already white but transparent
            }}
          >
            <img
              src={letter.src}
              alt={letter.char}
              style={{
                height: "36.76px",
                width: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
