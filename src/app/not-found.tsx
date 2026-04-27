'use client'

import React, { useEffect, useRef } from 'react';
import Link from "next/link";
import { gsap } from 'gsap';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Анимация появления контента
      gsap.from(".not-found-content > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      });

      // Пульсация фонового свечения
      gsap.to(".bg-glow", {
        scale: 1.2,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="text-slate-100 min-h-screen flex items-center justify-center font-sans relative overflow-hidden px-6">
      
      {/* Анимированный шум на фоне */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Фоновое свечение */}
      <div className="bg-glow absolute w-[300px] md:w-[500px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full z-0"></div>

      <div className="not-found-content relative z-10 text-center space-y-8 max-w-lg">
        {/* Иконка с эффектом стекла */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-blue-500 shadow-2xl">
            <AlertCircle size={40} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic italic uppercase leading-none">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Путь потерян
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Нить Flipcon оборвалась. Похоже, этот ресурс был перемещен или никогда не существовал в нашей системе.
          </p>
        </div>

        <div className="pt-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Home size={18} />
            ВЕРНУТЬСЯ НА ГЛАВНУЮ
          </Link>
        </div>
      </div>

      {/* Декоративная подпись внизу */}
      <div className="absolute bottom-12 text-[10px] text-slate-700 uppercase tracking-[0.8em] font-medium">
        Error Code: RESOURCE_NOT_FOUND_404
      </div>
    </div>
  );
}