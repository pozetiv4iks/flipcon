"use client";

import React, { useState } from "react";
import { UserPlus, Copy, Check, Trash2, Shield } from "lucide-react";
import { useToast } from "@/src/components/notifications/ToastContext";
import { Button } from "@/src/components/buttons/Buttons";
import { Input } from "@/src/components/inputs/Input";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  inviteCode: string;
  inviteUrl: string;
  status: "pending" | "active";
}

const ROLES = [
  "Frontend Разработчик",
  "Backend Разработчик",
  "Fullstack Разработчик",
  "Бухгалтер",
  "Дизайнер",
  "Тестировщик",
  "Менеджер проектов",
  "HR Менеджер",
];

const CAPABILITIES = [
  { id: "manage_team", label: "Управление командой" },
  { id: "edit_timelogs", label: "Редактирование таймлогов" },
  { id: "access_ai", label: "AI Аналитика" },
  { id: "access_finance", label: "Финансовая отчетность" },
  { id: "manage_projects", label: "Управление проектами" },
];

const inputBaseClass =
  "w-full rounded-xl border border-white/25 bg-transparent px-4 py-3.5 text-[15px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/35 focus:border-white/55 focus:ring-2 focus:ring-white/15";

export const TeamPage = () => {
  const { showToast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [customRoles, setCustomRoles] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Role Creation State
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "CREATE_NEW") {
      setIsCreatingRole(true);
    } else {
      setRole(e.target.value);
    }
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      showToast("Введите название роли", "error");
      return;
    }
    setCustomRoles([...customRoles, newRoleName]);
    setRole(newRoleName);
    setIsCreatingRole(false);
    setNewRoleName("");
    setSelectedCapabilities([]);
    showToast(`Роль "${newRoleName}" создана`, "success");
  };

  const toggleCapability = (id: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      showToast("Заполните имя и фамилию", "error");
      return;
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      firstName,
      lastName,
      role,
      inviteCode: code,
      inviteUrl: `${window.location.origin}/accept?code=${code}`,
      status: "pending",
    };

    setMembers([newMember, ...members]);
    setFirstName("");
    setLastName("");
    showToast(`Приглашение для ${firstName} создано`, "success");
  };

  const handleCopy = (member: TeamMember) => {
    navigator.clipboard.writeText(member.inviteUrl);
    setCopiedId(member.id);
    showToast("Ссылка скопирована", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <header className="mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-blue-400" />
          Управление командой
        </h1>
        <p className="text-white/60 mt-2">
          Добавляйте новых участников и управляйте их ролями.
        </p>
      </header>

      {/* Add Member Form */}
      <section className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-12 backdrop-blur-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <UserPlus size={20} className="text-green-400" />
          Добавить участника
        </h2>
        <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-white/35 uppercase ml-1 tracking-wider">Имя</label>
            <Input
              placeholder="Иван"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              inputClassName={inputBaseClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-white/35 uppercase ml-1 tracking-wider">Фамилия</label>
            <Input
              placeholder="Иванов"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              inputClassName={inputBaseClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-white/35 uppercase ml-1 tracking-wider">Роль</label>
            <select
              value={role}
              onChange={handleRoleChange}
              className={`${inputBaseClass} cursor-pointer appearance-none`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1em',
                paddingRight: '2.5rem'
              }}
            >
              {[...ROLES, ...customRoles].map((r) => (
                <option key={r} value={r} className="bg-[#1A1A1A]">
                  {r}
                </option>
              ))}
              <option value="CREATE_NEW" className="bg-[#1A1A1A] font-bold text-blue-400">+ Создать новую роль</option>
            </select>
          </div>
          <Button type="submit" text="Создать инвайт" className="h-[52px] w-full" />
        </form>
      </section>

      {/* Role Creation Modal */}
      {isCreatingRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCreatingRole(false)}
          />
          <div className="relative w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="text-blue-400" size={24} />
                Создание новой роли
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white/35 uppercase ml-1">Название роли</label>
                  <Input
                    placeholder="Например: Senior Frontend"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    inputClassName={inputBaseClass}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-white/35 uppercase ml-1">Возможности</label>
                  <div className="grid gap-2">
                    {CAPABILITIES.map((cap) => (
                      <button
                        key={cap.id}
                        onClick={() => toggleCapability(cap.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          selectedCapabilities.includes(cap.id)
                            ? "bg-blue-500/10 border-blue-500/30 text-white"
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/[0.07]"
                        }`}
                      >
                        <span className="text-[14px] font-medium">{cap.label}</span>
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                          selectedCapabilities.includes(cap.id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-white/20"
                        }`}>
                          {selectedCapabilities.includes(cap.id) && <Check size={14} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsCreatingRole(false)}
                    className="flex-1 h-12 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreateRole}
                    className="flex-1 h-12 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
                  >
                    Создать роль
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-white/80 mb-6">Список приглашений</h3>
        {members.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[32px]">
            <p className="text-white/30">Пока нет созданных приглашений</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px]">
                      {member.firstName} {member.lastName}
                    </h4>
                    <p className="text-[13px] text-white/40">{member.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <span className="text-[12px] font-mono text-white/60">Код:</span>
                    <span className="text-[14px] font-bold text-blue-400">{member.inviteCode}</span>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(member)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                      copiedId === member.id
                        ? "bg-green-500 text-white"
                        : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {copiedId === member.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === member.id ? "Скопировано" : "Копировать ссылку"}
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
