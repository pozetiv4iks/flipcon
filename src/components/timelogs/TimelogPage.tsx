"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clock, Send, SendHorizontal, User, ExternalLink, Calendar as CalendarIcon, Wallet, Pencil, X, Eraser, Check, Lock, Unlock, RotateCcw, ShieldCheck } from "lucide-react";
import { useToast } from "@/src/components/notifications/ToastContext";
import { Button } from "@/src/components/buttons/Buttons";

interface DayLog {
  date: string;
  hours: number;
  comment: string;
}

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Mock Project Data
const CURRENT_PROJECT = {
  id: "1",
  name: "Проект Альфа",
  rate: 15, // $ per hour
  teamLead: {
    name: "Александр Волков",
    telegram: "@alex_lead",
  },
  accountant: {
    name: "Елена Петрова",
    telegram: "@elena_fin",
  }
};

export const TimelogPage = () => {
  const { showToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [isSubmitting, setIsLoading] = useState(false);
  const [rate, setRate] = useState(CURRENT_PROJECT.rate);
  const [canEditRate, setCanEditRate] = useState(false);
  const [isAuthority, setIsAuthority] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Current real date info
  const realToday = new Date();
  const realMonth = realToday.getMonth();
  const realYear = realToday.getFullYear();

  const isCurrentMonth = selectedMonth === realMonth && selectedYear === realYear;
  const canEditLogs = isCurrentMonth && !isLocked;

  // Edit Modal State
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [tempHours, setTempHours] = useState<number>(0);
  const [tempComment, setTempComment] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCanEditRate(user?.role === 'admin' || user?.role === 'Team Lead');
      setIsAuthority(user?.role === 'admin' || user?.role === 'Team Lead' || user?.role === 'Бухгалтер');
    }
  }, []);

  // Simulation: Load mock data when month changes
  useEffect(() => {
    // Reset lock status when changing month
    // In a real app, you'd fetch this from the backend
    if (selectedYear < realYear || (selectedYear === realYear && selectedMonth < realMonth)) {
      setIsLocked(true); // Past months are usually locked
    } else {
      setIsLocked(false);
    }

    // Random mock data for demo
    const mockLogs: Record<string, DayLog> = {};
    const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= days; i++) {
      if (Math.random() > 0.5) {
        const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        mockLogs[dateKey] = {
          date: dateKey,
          hours: Math.floor(Math.random() * 8) + 2,
          comment: "Работа над задачами по проекту..."
        };
      }
    }
    setLogs(mockLogs);
  }, [selectedMonth, selectedYear]);

  // Generate days for selected month
  const daysInMonth = useMemo(() => {
    const date = new Date(selectedYear, selectedMonth, 1);
    const days = [];
    while (date.getMonth() === selectedMonth) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [selectedMonth, selectedYear]);

  const totalHours = useMemo(() => {
    return Object.values(logs).reduce((acc, log) => acc + (log.hours || 0), 0);
  }, [logs]);

  const workingDaysCount = useMemo(() => {
    return Object.values(logs).filter(log => (log.hours || 0) > 0).length;
  }, [logs]);

  const totalEarned = useMemo(() => {
    return totalHours * rate;
  }, [totalHours, rate]);

  const handleHourChange = (dateKey: string, hours: string) => {
    const val = parseFloat(hours) || 0;
    setLogs(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey] || { comment: "" },
        date: dateKey,
        hours: val > 24 ? 24 : val < 0 ? 0 : val
      }
    }));
  };

  const handleCommentChange = (dateKey: string, comment: string) => {
    setLogs(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey] || { hours: 0 },
        date: dateKey,
        comment
      }
    }));
  };

  const openEditModal = (dateKey: string) => {
    const existingLog = logs[dateKey];
    setEditingDay(dateKey);
    setTempHours(existingLog?.hours || 0);
    setTempComment(existingLog?.comment || "");
  };

  const handleSaveEdit = () => {
    if (editingDay) {
      setLogs(prev => ({
        ...prev,
        [editingDay]: {
          date: editingDay,
          hours: tempHours,
          comment: tempComment
        }
      }));
      setEditingDay(null);
      showToast("Запись обновлена", "success");
    }
  };

  const handleClearEdit = () => {
    setTempHours(0);
    setTempComment("");
  };

  const handleSubmit = async () => {
    if (totalHours === 0) {
      showToast("Заполните часы перед отправкой", "error");
      return;
    }

    setIsLoading(true);
    // Simulation
    setTimeout(() => {
      setIsLoading(false);
      setIsLocked(true);
      showToast("Таймлог успешно отправлен тимлиду и бухгалтеру", "success");
    }, 1500);
  };

  const handleUnlock = () => {
    if (!isAuthority) {
      showToast("У вас нет прав для разблокировки таймлога", "error");
      return;
    }
    setIsLocked(false);
    showToast("Редактирование разрешено", "info");
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-white min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Clock size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Рабочее время</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-white/40 text-[14px]">
                  Проект: <span className="text-white/80 font-semibold">{CURRENT_PROJECT.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center p-1.5 bg-white/5 border border-white/10 rounded-[20px] backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center">
            {MONTHS.map((name, i) => (
              <button
                key={name}
                onClick={() => setSelectedMonth(i)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                  selectedMonth === i 
                    ? "bg-white text-black shadow-lg scale-105" 
                    : "text-white/40 hover:text-white/70"
                } ${Math.abs(selectedMonth - i) > 1 && "hidden md:block"}`}
              >
                {name.substring(0, 3)}
              </button>
            ))}
          </div>
          <div className="w-[1px] h-6 bg-white/10 mx-2" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent text-[13px] font-bold px-3 py-2 outline-none cursor-pointer text-white/80 hover:text-white transition-colors"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y} className="bg-[#1A1A1A]">{y}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* Table Section */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="pl-10 pr-6 py-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Дата</th>
                    <th className="px-6 py-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-left">День недели</th>
                    <th className="px-6 py-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Описание выполненных задач</th>
                    <th className="px-6 py-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-center w-36">Часы</th>
                    <th className="pl-6 pr-10 py-6 text-[11px] font-black text-white/20 uppercase tracking-[0.2em] text-right w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {daysInMonth.map((date) => {
                    const dateKey = date.toISOString().split('T')[0];
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isToday = new Date().toISOString().split('T')[0] === dateKey;
                    
                    return (
                      <tr 
                        key={dateKey} 
                        className={`group transition-all duration-300 hover:bg-white/[0.04] ${isWeekend ? 'bg-white/[0.01]' : ''} ${isToday ? 'bg-blue-500/5' : ''}`}
                      >
                        <td className="pl-10 pr-6 py-5">
                          <div className="flex items-center gap-3">
                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                            <span className={`text-[15px] font-bold ${isToday ? 'text-blue-400' : 'text-white/80'}`}>
                              {date.getDate()} {MONTHS[date.getMonth()].substring(0, 3)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[13px] font-medium px-3 py-1 rounded-lg ${
                            isWeekend ? 'bg-red-500/10 text-red-400/80' : 'bg-white/5 text-white/40'
                          }`}>
                            {date.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <input
                            type="text"
                            disabled={!canEditLogs}
                            placeholder={canEditLogs ? "Опишите ваши задачи..." : "Нет описания"}
                            value={logs[dateKey]?.comment || ""}
                            onChange={(e) => handleCommentChange(dateKey, e.target.value)}
                            className={`w-full bg-transparent border-none text-[14px] text-white/60 placeholder:text-white/10 outline-none focus:text-white transition-colors ${!canEditLogs && "cursor-not-allowed"}`}
                          />
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="relative inline-block">
                            <input
                              type="number"
                              disabled={!canEditLogs}
                              step="0.5"
                              min="0"
                              max="24"
                              placeholder="0"
                              value={logs[dateKey]?.hours || ""}
                              onChange={(e) => handleHourChange(dateKey, e.target.value)}
                              className={`w-20 h-11 rounded-2xl border text-center text-[16px] font-black outline-none transition-all ${
                                (logs[dateKey]?.hours || 0) > 0 
                                  ? (canEditLogs ? "bg-blue-500 border-blue-400" : "bg-white/10 border-white/20") + " text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                                  : "bg-white/5 border-white/10 text-white/20 focus:border-white/30"
                              } ${!canEditLogs && "cursor-not-allowed opacity-50"}`}
                            />
                          </div>
                        </td>
                        <td className="pl-6 pr-10 py-5 text-right">
                          {canEditLogs && (
                            <button 
                              onClick={() => openEditModal(dateKey)}
                              className="p-2 rounded-xl bg-white/5 text-white/20 hover:bg-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <aside className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-500" />
            
            <h3 className="text-[16px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-white/40">
              <Wallet size={20} className="text-green-400" />
              Финансы
            </h3>
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-1">
                <span className="text-white/20 text-[11px] font-black uppercase tracking-widest">Текущая ставка</span>
                <div className="flex items-center gap-3">
                  {canEditRate ? (
                    <div className="flex items-center gap-2 group/rate">
                      <span className="text-2xl font-black text-white/40">$</span>
                      <input 
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                        className="w-20 bg-transparent border-none p-0 text-3xl font-black text-white outline-none"
                      />
                      <span className="text-white/20 text-[14px] font-bold self-end pb-1">/час</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-black text-white">${rate}<span className="text-white/20 text-[14px] font-bold ml-1">/час</span></p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <span className="text-white/20 text-[10px] font-black uppercase block mb-1">Отработано</span>
                  <p className="text-[18px] font-black text-blue-400">{totalHours}<span className="text-[12px] ml-1 opacity-40 text-white">ч</span></p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <span className="text-white/20 text-[10px] font-black uppercase block mb-1">Дней работы</span>
                  <p className="text-[18px] font-black text-green-400">{workingDaysCount}<span className="text-[12px] ml-1 opacity-40 text-white">дн</span></p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <span className="text-white/20 text-[11px] font-black uppercase tracking-widest">К выплате</span>
                <p className="text-5xl font-black text-white mt-2 tracking-tighter tabular-nums">
                  <span className="text-2xl align-top mt-1 mr-1 text-white/30">$</span>
                  {totalEarned.toLocaleString()}
                </p>
              </div>

              <div className="relative">
                <Button 
                  onClick={isLocked ? handleUnlock : handleSubmit} 
                  variant="transparent"
                  disabled={isSubmitting || (!isLocked && (totalHours === 0 || !isCurrentMonth)) || (isLocked && !isAuthority)}
                  className={`w-full h-14 rounded-[20px] font-black uppercase tracking-widest text-[13px] transition-all border-2 ${
                    isSubmitting 
                      ? "bg-blue-900/20 border-blue-500/10 text-blue-400/20 cursor-wait" 
                      : isLocked 
                        ? (isAuthority 
                            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" 
                            : "bg-blue-900/10 border-blue-900/20 text-blue-500/20 cursor-not-allowed")
                        : (totalHours > 0 && isCurrentMonth)
                          ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-500"
                          : "bg-blue-950/40 border-blue-900/30 text-blue-700/40 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    "Обработка..."
                  ) : isLocked ? (
                    isAuthority ? "Разблокировать" : "Утверждено"
                  ) : (
                    "Отправить"
                  )}
                </Button>
              </div>

              {isLocked && !isAuthority && (
                <div className="mt-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center gap-3 animate-in slide-in-from-top-2 duration-500">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <p className="text-[11px] text-green-400/80 leading-relaxed font-medium">
                    Таймлог за этот период утвержден. Для внесения изменений свяжитесь с руководителем.
                  </p>
                </div>
              )}

              {!isCurrentMonth && !isLocked && (
                <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <CalendarIcon size={16} />
                  </div>
                  <p className="text-[11px] text-white/30 leading-relaxed font-medium">
                    Редактирование доступно только для текущего календарного месяца.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contacts Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 backdrop-blur-xl">
            <h3 className="text-[16px] font-black uppercase tracking-[0.2em] mb-6 text-white/40 flex items-center gap-3">
              <User size={18} className="text-blue-400" />
              Поддержка
            </h3>
            
            <div className="space-y-6">
              <div className="group/contact">
                <p className="text-[10px] font-black text-white/15 uppercase tracking-widest mb-2">Team Lead</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[14px] text-white/80">{CURRENT_PROJECT.teamLead.name}</p>
                  <a 
                    href={`https://t.me/${CURRENT_PROJECT.teamLead.telegram.replace('@', '')}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    <SendHorizontal size={14} />
                  </a>
                </div>
              </div>

              <div className="group/contact">
                <p className="text-[10px] font-black text-white/15 uppercase tracking-widest mb-2">Бухгалтер</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[14px] text-white/80">{CURRENT_PROJECT.accountant.name}</p>
                  <a 
                    href={`https://t.me/${CURRENT_PROJECT.accountant.telegram.replace('@', '')}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    <SendHorizontal size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Edit Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setEditingDay(null)}
          />
          <div className="relative w-full max-w-lg bg-[#0D0D0D] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Pencil size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Редактировать день</h3>
                    <p className="text-white/40 text-[14px]">
                      {new Date(editingDay).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingDay(null)}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Часы работы</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={tempHours}
                      onChange={(e) => setTempHours(parseFloat(e.target.value) || 0)}
                      className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 px-6 text-xl font-black text-white outline-none focus:border-blue-500/50 transition-all"
                    />
                    <div className="flex flex-col gap-1">
                      <button onClick={() => setTempHours(h => Math.min(24, h + 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">+</button>
                      <button onClick={() => setTempHours(h => Math.max(0, h - 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">-</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Описание задач</label>
                  <textarea 
                    value={tempComment}
                    onChange={(e) => setTempComment(e.target.value)}
                    placeholder="Что именно вы делали в этот день?"
                    className="w-full h-32 rounded-2xl bg-white/5 border border-white/10 p-6 text-[15px] text-white outline-none focus:border-blue-500/50 transition-all resize-none placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={handleClearEdit}
                    className="h-14 rounded-2xl border border-white/5 bg-white/5 text-white/40 font-bold flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Eraser size={18} />
                    Очистить
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="h-14 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-2 hover:bg-blue-600 shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all"
                  >
                    <Check size={18} strokeWidth={3} />
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
