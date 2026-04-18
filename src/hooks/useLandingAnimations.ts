"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLandingAnimations(refs: {
  mainRef: RefObject<HTMLElement | null>;
  pathRef: RefObject<SVGPathElement | null>;
  magneticBtnRef: RefObject<HTMLDivElement | null>;
}) {
  const { mainRef, pathRef, magneticBtnRef } = refs;

  useEffect(() => {
    const path = pathRef.current;
    const root = mainRef.current;
    const mBtn = magneticBtnRef.current;

    if (!path || !root) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.set(path, { strokeDashoffset: 0 });
      gsap.utils.toArray<HTMLElement>(".landing-reveal").forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const kinetic = gsap.utils.toArray<HTMLElement>(".landing-kinetic-char");
      if (kinetic.length) {
        gsap.set(kinetic, { yPercent: 100, opacity: 0 });
        gsap.to(kinetic, {
          yPercent: 0,
          opacity: 1,
          duration: 0.78,
          ease: "power4.out",
          stagger: 0.011,
          delay: 0.12,
        });
      }

      const toolsPin = root.querySelector<HTMLElement>(".landing-tools-pin");
      const toolsViewport = root.querySelector<HTMLElement>(".landing-tools-viewport");
      const toolsTrack = root.querySelector<HTMLElement>(".landing-tools-track");
      if (toolsPin && toolsViewport && toolsTrack) {
        const buildToolsScroll = () => {
          const maxX = Math.max(0, toolsTrack.scrollWidth - toolsViewport.clientWidth);

          ScrollTrigger.getAll()
            .filter((t) => t.vars.id === "landing-tools-horizontal")
            .forEach((t) => t.kill());

          gsap.set(toolsTrack, { x: 0 });
          if (maxX === 0) return;

          gsap.to(toolsTrack, {
            x: -maxX,
            ease: "none",
            scrollTrigger: {
              id: "landing-tools-horizontal",
              trigger: toolsPin,
              start: "top top",
              end: () => `+=${maxX}`,
              scrub: 0.9,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        };

        buildToolsScroll();
        ScrollTrigger.addEventListener("refreshInit", buildToolsScroll);
      }

      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });

      const handleMagnetic = (e: MouseEvent) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        if (!mBtn) return;
        const rect = mBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(mBtn, {
          x: x * 0.22,
          y: y * 0.22,
          duration: 0.45,
          ease: "power3.out",
        });
      };

      const handleMagneticLeave = () => {
        if (!mBtn) return;
        gsap.to(mBtn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.6)" });
      };

      mBtn?.addEventListener("mousemove", handleMagnetic);
      mBtn?.addEventListener("mouseleave", handleMagneticLeave);

      // Горизонтальная секция уже "едет" треком, доп.параллакс карточек не нужен.

      gsap.utils.toArray<HTMLElement>(".landing-stat-value").forEach((stat) => {
        const raw = stat.textContent?.replace(/\D/g, "") ?? "0";
        const end = parseInt(raw, 10) || 0;
        const obj = { n: 0 };
        gsap.to(obj, {
          n: end,
          duration: 1.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stat,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            stat.textContent = Math.round(obj.n).toString();
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".landing-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [mainRef, pathRef, magneticBtnRef]);
}
