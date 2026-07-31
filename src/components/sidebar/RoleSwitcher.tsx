"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ShieldCheck, Plus, X } from "lucide-react";

interface Role {
  id: string;
  name: string;
}

export const RoleSwitcher = ({ isHovered }: { isHovered: boolean }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial roles
    const baseRoles = [
      { id: 'admin', name: 'Администратор' },
      { id: 'manager', name: 'Менеджер' },
      { id: 'accountant', name: 'Бухгалтер' },
      { id: 'teamlead', name: 'Тимлид' },
      { id: 'developer', name: 'Разработчик' },
      { id: 'hr', name: 'HR' }
    ];

    // Load custom roles from localStorage
    const savedCustomRoles = localStorage.getItem('custom-roles');
    const customRoles = savedCustomRoles ? JSON.parse(savedCustomRoles) : [];
    
    const allRoles = [...baseRoles, ...customRoles];
    setRoles(allRoles);
    
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    
    if (user?.role) {
      const foundRole = allRoles.find(r => r.id === user.role);
      setSelectedRole(foundRole || baseRoles[0]);
    } else {
      setSelectedRole(baseRoles[0]);
      localStorage.setItem('user', JSON.stringify({ ...user, role: baseRoles[0].id }));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (role: Role) => {
    setSelectedRole(role);
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : {};
    localStorage.setItem('user', JSON.stringify({ ...user, role: role.id }));
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative px-[14px] mt-2" ref={dropdownRef}>
      <button
        onClick={() => isHovered && setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center rounded-xl border border-white/5 bg-white/5 px-2 transition-colors hover:bg-white/10 ${
          !isHovered ? "justify-center" : ""
        }`}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
          <ShieldCheck size={18} />
        </div>
        {isHovered && (
          <>
            <div className="ml-3 flex flex-1 flex-col overflow-hidden text-left">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                Роль
              </span>
              <span className="text-[13px] font-medium text-white truncate">
                {selectedRole?.name || "Select Role"}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`ml-2 text-white/50 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {isHovered && isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 px-[14px]">
          <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-1 shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleSelect(role)}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-colors ${
                  selectedRole?.id === role.id
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
