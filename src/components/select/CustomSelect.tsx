"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Выбрать...", 
  className = "" 
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 text-[13px] transition-all hover:bg-white/10 focus:border-blue-500/50 outline-none ${
          isOpen ? "border-blue-500/50 ring-2 ring-blue-500/5" : ""
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon}
          <span className={`truncate ${selectedOption ? "text-white" : "text-white/40"}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-[100] mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D0D0D] shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-h-[240px] overflow-y-auto custom-scrollbar p-1">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-[13px] transition-colors ${
                  value === option.id 
                    ? "bg-blue-500 text-white" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                {option.icon}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
