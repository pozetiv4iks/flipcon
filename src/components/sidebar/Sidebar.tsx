"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { 
  Calendar, 
  LayoutGrid, 
  Bot, 
  Settings, 
  BarChart3,
  Activity,
  Users,
  Zap,
  Clock
} from "lucide-react";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";
import { ProjectSwitcher } from "./ProjectSwitcher";

export const Sidebar = () => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  // In a real app, this would check permissions
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { icon: Calendar, label: t.sidebar.calendar, href: "/calendar" },
    { icon: LayoutGrid, label: t.sidebar.board, href: "/table" },
    { icon: Activity, label: t.sidebar.dashboard, href: "/" },
    { icon: Bot, label: t.sidebar.aiAssistant, href: "/ai-assistant" },
    { icon: Zap, label: "AI Аналитика", href: "/ai-insights" },
    { icon: Clock, label: "Таймлоги", href: "/timelogs" },
    ...(isAdmin ? [{ icon: Users, label: "Команда", href: "/team" }] : []),
  ];

  const bottomItems = [
    { icon: Settings, label: t.sidebar.settings, href: "/settings" },
    { icon: BarChart3, label: "Аналитика", href: "/analytics" },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 z-[80] flex h-full flex-col bg-[var(--sidebar-background)] transition-all duration-300 ease-in-out ${
        isHovered ? "w-[336px]" : "w-[64px]"
      } border-r border-white/5 rounded-r-[24px] overflow-hidden`}
    >
      <div className="flex h-20 items-center px-[12px] overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-black/30">
          <img
            src="/images/logo.png"
            alt="flipcon"
            className="h-full w-full object-contain"
          />
        </div>
        <img
          src="/images/text-logo.png"
          alt="flipcon"
          className={`ml-2 h-[21px] transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        />
      </div>
      
      <ProjectSwitcher isHovered={isHovered} />

      <nav className="mt-8 flex-1 space-y-4 px-[14px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (isActive) e.preventDefault();
              }}
              className={`group flex h-9 items-center rounded-xl transition-colors ${
                isActive ? "text-white bg-white/5" : "text-white/70 hover:text-white"
              }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-white/10" : "group-hover:bg-white/5"
              }`}>
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <span
                className={`ml-4 whitespace-nowrap text-[15px] font-medium transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="mb-8 space-y-4 px-[14px]">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (isActive) e.preventDefault();
              }}
              className={`group flex h-9 items-center rounded-xl transition-colors ${
                isActive ? "text-white bg-white/5" : "text-white/70 hover:text-white"
              }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-white/10" : "group-hover:bg-white/5"
              }`}>
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <span
                className={`ml-4 whitespace-nowrap text-[15px] font-medium transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
