"use client";

import React, { useRef, useState, useEffect } from "react";

interface CodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  status: "idle" | "error" | "success";
}

export const CodeInput = ({ length = 6, onComplete, status }: CodeInputProps) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1).toUpperCase();
    setCode(newCode);

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every((char) => char !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const getBorderColor = (index: number) => {
    if (status === "error") return "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    if (status === "success") return "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    return code[index] ? "border-white" : "border-white/25";
  };

  return (
    <div className="flex justify-center gap-2">
      {code.map((char, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          maxLength={1}
          value={char}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`h-12 w-10 rounded-xl border bg-transparent text-center text-xl font-bold text-white outline-none transition-all ${getBorderColor(
            index
          )}`}
        />
      ))}
    </div>
  );
};
