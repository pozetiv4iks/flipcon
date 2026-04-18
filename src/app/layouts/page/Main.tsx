'use client'

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { LayoutGrid, Users, Zap, Sparkles, ChevronRight, Menu, X, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Main = () => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const magneticBtnRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const path = pathRef.current;
      if (!path || !mainRef.current) return;
      const pathLength = path.getTotalLength();
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        }
      });

      const mBtn = magneticBtnRef.current;
      const handleMagnetic = (e: MouseEvent) => {
        if (!mBtn || window.innerWidth < 768) return;
        const rect = mBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(mBtn, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: "power2.out" });
      };
      
      mBtn?.addEventListener('mousemove', handleMagnetic);
      mBtn?.addEventListener('mouseleave', () => gsap.to(mBtn, { x: 0, y: 0, duration: 0.6 }));

      gsap.utils.toArray<HTMLElement>(".parallax-card").forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -30 : 30,
          scrollTrigger: {
            trigger: card,
            scrub: true,
            start: "top bottom",
          }
        });
      });

      gsap.from(".hero-title span", {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
      });

      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((stat) => {
        gsap.from(stat, {
          textContent: 0,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
          }
        });
      });

    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#020408] text-slate-100 min-h-screen font-sans selection:bg-blue-500 relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <svg 
        className="absolute left-1/2 -translate-x-1/2 top-0 z-0 pointer-events-none hidden md:block"
        width="1000" 
        height="100%" 
        viewBox="0 0 1000 6000" 
        fill="none" 
        preserveAspectRatio="xMidYMin slice"
      >
        <path 
          ref={pathRef}
          d="M500,0 C600,500 400,800 500,1500 C650,2200 350,2800 500,3500 C700,4200 300,4800 500,5500 L500,6000" 
          stroke="url(#lineGradient)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          className="opacity-30"
        />
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>

      <nav className="fixed top-0 w-full z-[70] backdrop-blur-xl border-b border-white/5 bg-[#020408]/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold">F</div>
            <span className="text-xl font-bold tracking-tighter">Flipcon</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Product', 'Features', 'Pricing'].map(item => (
              <a key={item} href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
            <div ref={magneticBtnRef}>
              <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all">
                GET STARTED
              </button>
            </div>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#020408] border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-5">
            {['Product', 'Features', 'Pricing'].map(item => (
              <a key={item} href="#" className="text-lg font-medium">{item}</a>
            ))}
            <button className="w-full bg-blue-600 py-4 rounded-xl font-bold">Get Started</button>
          </div>
        )}
      </nav>

      <section className="relative pt-40 md:pt-60 pb-20 md:pb-40 px-6 z-10 text-center">
        <div ref={glowRef} className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full"></div>
        <h1 className="hero-title text-5xl sm:text-7xl md:text-[110px] font-black tracking-tighter mb-8 leading-[1] md:leading-[0.8] flex flex-col items-center">
          <span className="block">STREAMLINE</span>
          <span className="text-blue-500 block uppercase">EVERY TASK.</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-base md:text-xl font-medium mb-10 px-4">
          Мы проложили путь. Вам остается только следовать за нитью вашего успеха.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <button className="w-full sm:w-auto bg-blue-600 px-10 py-4 rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
             Попробовать сейчас
           </button>
        </div>
      </section>

      <section className="py-20 px-6 z-10 relative border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { label: "Active Users", val: "1500", suffix: "+" },
            { label: "Tasks Done", val: "42", suffix: "k" },
            { label: "Efficiency", val: "99", suffix: "%" },
            { label: "Countries", val: "24", suffix: "" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-5xl font-black text-blue-500 mb-2 flex justify-center">
                <span className="stat-value">{stat.val}</span>{stat.suffix}
              </div>
              <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { t: "Automated", d: "ИИ сам строит структуру проекта и назначает дедлайны.", icon: <Zap /> },
            { t: "Collaborative", d: "Команды синхронны как никогда в режиме реального времени.", icon: <Users /> },
            { t: "Fast", d: "От идеи до релиза за считанные часы благодаря шаблонам.", icon: <Sparkles /> }
          ].map((item, i) => (
            <div key={i} className="parallax-card p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl group hover:border-blue-500/30 transition-all">
              <div className="mb-6 text-blue-500 w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.t}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-40 px-6 z-10 relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-6 border border-blue-500/20">
              SMART INTERFACE
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">Нить управления в <br className="hidden md:block"/><span className="italic text-blue-500">ваших руках.</span></h2>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto lg:mx-0">
              Flipcon использует алгоритмы глубокого обучения для приоритизации задач. Больше никакой рутины — только чистый прогресс.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-blue-400 font-bold cursor-pointer group">
               Explore Intelligence <ArrowRight className="group-hover:translate-x-2 transition-transform"/>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full scale-75"></div>
            <div className="floating-card p-6 md:p-10 rounded-[2.5rem] bg-[#0a0f18]/90 border border-blue-500/20 shadow-2xl relative z-20 backdrop-blur-2xl">
              <div className="flex justify-between items-center mb-10">
                <div className="h-2 w-20 bg-blue-500/40 rounded-full"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              </div>
              <div className="space-y-4 mb-10">
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-2/3 shadow-[0_0_15px_rgba(37,99,235,1)]"></div>
                </div>
                <div className="h-3 w-4/5 bg-white/5 rounded-full"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5"></div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Processing Data...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 z-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic">Global Ecosystem</h2>
            <p className="text-slate-500">Все инструменты в одной связке.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex gap-6 items-start">
              <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500"><ShieldCheck size={32}/></div>
              <div>
                <h4 className="text-xl font-bold mb-2">Security First</h4>
                <p className="text-sm text-slate-500">Ваши данные зашифрованы по протоколу AES-256. Полная приватность ваших идей.</p>
              </div>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex gap-6 items-start">
              <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500"><Globe size={32}/></div>
              <div>
                <h4 className="text-xl font-bold mb-2">Remote Ready</h4>
                <p className="text-sm text-slate-500">Работайте из любой точки мира. Оффлайн режим с последующей синхронизацией.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-40 md:py-60 text-center z-10 relative px-6">
        <div className="flex flex-col items-center">
          <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter italic uppercase">Finish Line.</h2>
          <div className="relative group w-full max-w-md">
            <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <button className="relative w-full bg-blue-600 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all">
              GET STARTED
            </button>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center text-[10px] text-slate-600 uppercase tracking-[0.5em] z-10 relative">
        Flipcon — Digital Management System — 2026
      </footer>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .hero-title span { display: inline-block; }
      `}</style>
    </div>
  );
};

export default Main;