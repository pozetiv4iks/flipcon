"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { 
  Settings as SettingsIcon, 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Globe,
  Check
} from "lucide-react";

const customPalette = [
  "#040035", "#0A0A0A", "#1A1A1A", "#1E1E2E", "#0F172A", "#020617",
  "#111827", "#171717", "#050505", "#0F0F0F", "#121212",
  "#1A0B2E", "#2D0B2E", "#2E0B0B", "#0B2E1A", "#0B2E2E",
  "#1E1B4B", "#312E81", "#1E3A8A", "#2E1A0B", "#2E2E0B"
];

export const SettingsPage = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeColor, setActiveColor] = useState("#040035");
  const [activeSection, setActiveSection] = useState("appearance");

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem("flipcon-theme-color");
    if (savedColor) {
      setActiveColor(savedColor);
      applyTheme(savedColor);
    }
  }, []);

  const applyTheme = (hex: string) => {
    const gradient = `radial-gradient(ellipse 120% 80% at 50% 20%, ${hex} 0%, #000000 75%)`;
    
    document.documentElement.style.setProperty('--background', hex);
    document.documentElement.style.setProperty('--sidebar-background', hex);
    document.documentElement.style.setProperty('--background-gradient', gradient);
    localStorage.setItem("flipcon-theme-color", hex);
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    applyTheme(color);
  };

  return (
    <div className="flex h-screen text-white overflow-hidden transition-all duration-500">
      <div className="flex flex-1 transition-all duration-300 h-full overflow-y-auto custom-scrollbar">
        <main className="max-w-4xl mx-auto w-full p-12">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                <SettingsIcon size={24} />
              </div>
              <h1 className="text-[32px] font-bold">{t.settings.title}</h1>
            </div>
            <p className="text-white/40">{t.settings.subtitle}</p>
          </header>

          <div className="grid grid-cols-[240px_1fr] gap-16">
            {/* Nav */}
            <nav className="space-y-2">
              {[
                { id: "appearance", icon: Palette, label: t.settings.appearance },
                { id: "profile", icon: User, label: t.settings.profile },
                { id: "notifications", icon: Bell, label: t.settings.notifications },
                { id: "security", icon: Shield, label: t.settings.security },
                { id: "language", icon: Globe, label: t.sidebar.calendar === "Календарь" ? "Язык" : "Language" }, // Fallback logic or just use t.settings.language
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${
                    activeSection === item.id ? "bg-white/5 text-white" : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className="space-y-12">
              {activeSection === "appearance" && (
                <section className="animate-in">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[18px] font-bold flex items-center gap-2">
                      <Palette size={20} className="text-blue-400" />
                      {t.settings.theme}
                    </h3>
                    {activeColor !== "#040035" && (
                      <button 
                        onClick={() => handleColorChange("#040035")}
                        className="text-[13px] text-white/40 hover:text-white transition-all underline underline-offset-4"
                      >
                        {t.settings.resetTheme}
                      </button>
                    )}
                  </div>
                  <p className="text-white/40 text-[14px] mb-8">
                    {t.settings.themeDesc}
                  </p>

                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
                    <div className="grid grid-cols-10 gap-3">
                      {customPalette.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`h-8 w-8 rounded-full border transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                            activeColor === color 
                              ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                              : "border-white/10"
                          }`}
                          style={{ background: color }}
                        >
                          {activeColor === color && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="h-10 w-10 rounded-xl border border-white/10" style={{ background: activeColor }} />
                      <div>
                        <p className="text-[14px] font-medium">{t.settings.currentColor}</p>
                        <p className="text-[12px] text-white/30 uppercase">{activeColor}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "language" && (
                <section className="animate-in">
                  <h3 className="text-[18px] font-bold mb-6 flex items-center gap-2">
                    <Globe size={20} className="text-green-400" />
                    {t.settings.language}
                  </h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-4">
                    {[
                      { id: "ru", label: "Русский", flag: "🇷🇺" },
                      { id: "en", label: "English", flag: "🇺🇸" },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id as any)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          language === lang.id
                            ? "bg-white/5 border-white/20 text-white"
                            : "bg-transparent border-white/5 text-white/40 hover:bg-white/[0.02] hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{lang.flag}</span>
                          <span className="font-medium">{lang.label}</span>
                        </div>
                        {language === lang.id && <Check size={20} className="text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === "profile" && (
                <section className="animate-in">
                  <h3 className="text-[18px] font-bold mb-6 flex items-center gap-2">
                    <User size={20} className="text-purple-400" />
                    {t.settings.accountInfo}
                  </h3>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-1">{t.settings.username}</p>
                        <p className="text-[15px]">Stepan Dyleuski</p>
                      </div>
                      <button className="text-[13px] text-blue-400 hover:underline">{t.settings.change}</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-1">{t.settings.email}</p>
                        <p className="text-[15px]">stepan@flipcon.app</p>
                      </div>
                      <button className="text-[13px] text-blue-400 hover:underline">{t.settings.change}</button>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>


      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
