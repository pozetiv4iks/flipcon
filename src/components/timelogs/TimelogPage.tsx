"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Clock, 
  Send, 
  SendHorizontal, 
  User, 
  ExternalLink, 
  Calendar as CalendarIcon, 
  Wallet, 
  Pencil, 
  X, 
  Eraser, 
  Check, 
  Lock, 
  Unlock, 
  RotateCcw, 
  ShieldCheck, 
  ListChecks, 
  ChevronRight, 
  Search, 
  FileCheck, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/src/components/notifications/ToastContext";
import { Button } from "@/src/components/buttons/Buttons";
import { CustomSelect } from "@/src/components/select/CustomSelect";

// --- Types ---
interface DayLog {
  date: string;
  hours: number;
  comment: string;
}

interface PendingApproval {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  month: number;
  year: number;
  totalHours: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
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

// Mock Approval Data for Accountant
const MOCK_APPROVALS: PendingApproval[] = [
  { id: "1", userId: "u1", userName: "Иван Иванов", month: 6, year: 2026, totalHours: 168, status: "pending", submittedAt: "2026-07-01" },
  { id: "2", userId: "u2", userName: "Мария Сидорова", month: 6, year: 2026, totalHours: 154, status: "pending", submittedAt: "2026-07-02" },
  { id: "3", userId: "u3", userName: "Петр Петров", month: 5, year: 2026, totalHours: 172, status: "approved", submittedAt: "2026-06-01" },
  { id: "4", userId: "u4", userName: "Анна Кузнецова", month: 6, year: 2026, totalHours: 160, status: "pending", submittedAt: "2026-07-03" },
  { id: "5", userId: "u5", userName: "Сергей Сергеев", month: 5, year: 2026, totalHours: 40, status: "rejected", submittedAt: "2026-06-05" },
];

export const TimelogPage = () => {
  const { showToast } = useToast();
  
  // Basic states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [logs, setLogs] = useState<Record<string, DayLog>>({});
  const [isSubmitting, setIsLoading] = useState(false);
  const [rate, setRate] = useState(CURRENT_PROJECT.rate);
  const [isLocked, setIsLocked] = useState(false);
  
  // Role and View states
  const [viewMode, setViewMode] = useState<"personal" | "review">("personal");
  const [userRole, setUserRole] = useState<string>("");
  const [isAuthority, setIsAuthority] = useState(false);
  const [canEditRate, setCanEditRate] = useState(false);
  const [isAccountant, setIsAccountant] = useState(false);
  
  // Review view states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Current real date info
  const realToday = new Date();
  const realMonth = realToday.getMonth();
  const realYear = realToday.getFullYear();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserRole(user?.role || "");
      // Roles defined in RoleSwitcher: admin, manager, accountant, teamlead, developer, hr
      setCanEditRate(['admin', 'teamlead'].includes(user?.role));
      setIsAuthority(['admin', 'teamlead', 'accountant', 'hr'].includes(user?.role));
      
      if (user?.role === 'accountant') {
        setIsAccountant(true);
        setViewMode("review");
      }
    }
  }, []);

  const isCurrentMonth = selectedMonth === realMonth && selectedYear === realYear;
  const canEditLogs = viewMode === "personal" && isCurrentMonth && !isLocked;

  // Filtered and grouped approvals for Accountant
  const groupedApprovals = useMemo(() => {
    const filtered = MOCK_APPROVALS.filter(a => 
      a.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Group by sortable key (YYYY-MM)
    const groups: Record<string, { label: string, items: PendingApproval[] }> = {};
    filtered.forEach(a => {
      const sortKey = `${a.year}-${String(a.month).padStart(2, '0')}`;
      if (!groups[sortKey]) {
        groups[sortKey] = {
          label: `${MONTHS[a.month]} ${a.year}`,
          items: []
        };
      }
      groups[sortKey].items.push(a);
    });
    
    // Sort keys descending (most recent first)
    return Object.keys(groups).sort().reverse().map(key => groups[key]);
  }, [searchQuery]);

  // Load mock data for personal logs
  useEffect(() => {
    if (viewMode === "review") return;
    
    // Logic for locking past months
    if (selectedYear < realYear || (selectedYear === realYear && selectedMonth < realMonth)) {
      setIsLocked(true); 
    } else {
      setIsLocked(false);
    }

    const mockLogs: Record<string, DayLog> = {};
    const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= days; i++) {
      if (Math.random() > 0.4) {
        const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        mockLogs[dateKey] = {
          date: dateKey,
          hours: Math.floor(Math.random() * 8) + 2,
          comment: "Разработка функционала проекта Flipcon, исправление багов и написание документации."
        };
      }
    }
    setLogs(mockLogs);
  }, [selectedMonth, selectedYear, viewMode]);

  const daysInMonth = useMemo(() => {
    const date = new Date(selectedYear, selectedMonth, 1);
    const days = [];
    while (date.getMonth() === selectedMonth) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [selectedMonth, selectedYear]);

  const totalHours = useMemo(() => Object.values(logs).reduce((acc, log) => acc + (log.hours || 0), 0), [logs]);
  const workingDaysCount = useMemo(() => Object.values(logs).filter(log => (log.hours || 0) > 0).length, [logs]);
  const totalEarned = useMemo(() => totalHours * rate, [totalHours, rate]);

  const handleHourChange = (dateKey: string, hours: string) => {
    const val = parseFloat(hours) || 0;
    setLogs(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey] || { comment: "" }, date: dateKey, hours: val > 24 ? 24 : val < 0 ? 0 : val }
    }));
  };

  const handleCommentChange = (dateKey: string, comment: string) => {
    setLogs(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey] || { hours: 0 }, date: dateKey, comment }
    }));
  };

  const handleSubmit = async () => {
    if (totalHours === 0) {
      showToast("Заполните часы перед отправкой", "error");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLocked(true);
      showToast("Таймлог успешно отправлен на одобрение", "success");
    }, 1500);
  };

  const handleUnlock = () => {
    if (!isAuthority) {
      showToast("У вас нет прав для разблокировки", "error");
      return;
    }
    setIsLocked(false);
    showToast("Редактирование разрешено", "info");
  };

  const handleApprove = (id: string) => {
    showToast("Таймлог утвержден бухгалтером", "success");
  };

  const handleReject = (id: string) => {
    showToast("Запрошены изменения", "info");
  };

  const handleExportEmployee = (approval: PendingApproval) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(`Отчет для ${approval.userName} экспортирован`, "success");
      
      const days = new Date(approval.year, approval.month + 1, 0).getDate();
      const monthName = MONTHS[approval.month];
      
      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
            .weekend { background-color: #fce4e4; }
            .total { font-weight: bold; }
            .header-month { font-size: 18px; font-weight: bold; text-align: center; border: none; }
          </style>
        </head>
        <body>
          <table>
            <tr><th colspan="3" class="header-month">${monthName}</th></tr>
            <tr>
              <th style="width: 100px;">Date</th>
              <th>Task description</th>
              <th style="width: 80px;">Hours</th>
            </tr>
      `;

      let total = 0;
      for (let i = 1; i <= days; i++) {
        const date = new Date(approval.year, approval.month, i);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const dateStr = `${String(i).padStart(2, '0')}/${String(approval.month + 1).padStart(2, '0')}/${approval.year}`;
        
        // Mocking task descriptions for the export to match style
        let tasks = "";
        let hours = "";
        
        if (!isWeekend) {
          const randomHours = Math.random() > 0.3 ? (Math.floor(Math.random() * 5) + 4) : 0;
          if (randomHours > 0) {
            hours = randomHours.toString();
            total += randomHours;
            tasks = "Integrated backend end-points<br>Tested search end-points with different query params<br>Writing TypeScript interfaces<br>Worked with Figma designs for UI alignment";
          }
        }

        html += `
          <tr class="${isWeekend ? 'weekend' : ''}">
            <td>${dateStr}</td>
            <td>${tasks}</td>
            <td style="text-align: center;">${hours}</td>
          </tr>
        `;
      }

      html += `
            <tr class="total">
              <td colspan="2" style="text-align: right;">Total ${monthName}:</td>
              <td style="text-align: center;">${total}</td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Timelog_${approval.userName}_${monthName}_${approval.year}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-white min-h-screen animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
              <Clock size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Таймлоги</h1>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck size={14} className="text-green-500" />
                <p className="text-white/40 text-[14px]">
                  Проект: <span className="text-white/80 font-bold">{CURRENT_PROJECT.name}</span>
                </p>
              </div>
            </div>
          </div>

          {isAuthority && (
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-[22px] w-fit backdrop-blur-xl">
              {!isAccountant && (
                <button
                  onClick={() => setViewMode("personal")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[13px] font-black uppercase tracking-wider transition-all ${
                    viewMode === "personal" ? "bg-white text-black shadow-xl scale-105" : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <User size={16} strokeWidth={3} />
                  Личные
                </button>
              )}
              <button
                onClick={() => setViewMode("review")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[13px] font-black uppercase tracking-wider transition-all ${
                  viewMode === "review" ? (isAccountant ? "bg-white text-black shadow-xl" : "bg-white text-black shadow-xl scale-105") : "text-white/40 hover:text-white/60"
                }`}
              >
                <ListChecks size={16} strokeWidth={3} />
                Очередь одобрения
                <span className={`ml-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black ${viewMode === "review" ? "bg-black/10 text-black" : "bg-blue-500 text-white"}`}>
                  {MOCK_APPROVALS.filter(a => a.status === 'pending').length}
                </span>
              </button>
            </div>
          )}
        </div>

        {viewMode === "personal" ? (
          <div className="flex items-center p-2 bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center">
              {MONTHS.map((name, i) => (
                <button
                  key={name}
                  onClick={() => setSelectedMonth(i)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                    selectedMonth === i 
                      ? "bg-white text-black shadow-lg scale-105" 
                      : "text-white/30 hover:text-white/70"
                  } ${Math.abs(selectedMonth - i) > 1 && "hidden md:block"}`}
                >
                  {name.substring(0, 3)}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-white/10 mx-3" />
            <CustomSelect 
              options={[2024, 2025, 2026].map(y => ({ id: y.toString(), label: y.toString() }))}
              value={selectedYear.toString()}
              onChange={(val) => setSelectedYear(parseInt(val))}
              className="w-24"
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            {isAccountant && (
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                <CalendarIcon size={18} className="text-blue-400" />
                <span className="text-[13px] font-black uppercase tracking-wider text-white/40">Отчетный период:</span>
                <span className="text-[15px] font-bold text-white">{MONTHS[realMonth]} {realYear}</span>
              </div>
            )}
            <div className="relative group">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text"
                placeholder="Поиск сотрудника..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 h-14 bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-6 text-[15px] outline-none focus:border-blue-500/30 focus:bg-white/[0.07] transition-all backdrop-blur-xl"
              />
            </div>
          </div>
        )}
      </header>

      {viewMode === "personal" && !isAccountant ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-inner relative">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="pl-10 pr-6 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-left">Дата</th>
                      <th className="px-6 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-left">День</th>
                      <th className="px-6 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-left">Задачи</th>
                      <th className="px-6 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-center w-32">Часы</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {daysInMonth.map((date) => {
                      const dateKey = date.toISOString().split('T')[0];
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const isToday = new Date().toISOString().split('T')[0] === dateKey;
                      
                      return (
                        <tr key={dateKey} className={`group transition-all duration-300 hover:bg-white/[0.04] ${isWeekend ? 'bg-white/[0.01]' : ''} ${isToday ? 'bg-blue-500/5' : ''}`}>
                          <td className="pl-10 pr-6 py-6">
                            <span className={`text-[15px] font-bold ${isToday ? 'text-blue-400' : 'text-white/80'}`}>
                              {date.getDate()} {MONTHS[date.getMonth()].substring(0, 3)}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`text-[12px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${isWeekend ? 'bg-red-500/10 text-red-400/80' : 'bg-white/5 text-white/20'}`}>
                              {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <input
                              type="text"
                              disabled={!canEditLogs}
                              placeholder={canEditLogs ? "Опишите работу..." : "-"}
                              value={logs[dateKey]?.comment || ""}
                              onChange={(e) => handleCommentChange(dateKey, e.target.value)}
                              className="w-full bg-transparent border-none text-[14px] text-white/60 placeholder:text-white/10 outline-none focus:text-white transition-colors"
                            />
                          </td>
                          <td className="px-6 py-6 text-center">
                            <input
                              type="number"
                              disabled={!canEditLogs}
                              step="0.5"
                              value={logs[dateKey]?.hours || ""}
                              onChange={(e) => handleHourChange(dateKey, e.target.value)}
                              className={`w-16 h-10 rounded-xl border text-center text-[15px] font-black outline-none transition-all ${
                                (logs[dateKey]?.hours || 0) > 0 ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 text-white/20"
                              }`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[48px] p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
              <h3 className="text-[14px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-white/40">
                <Wallet size={18} className="text-green-400" />
                Финансы
              </h3>
              
              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Текущая ставка</span>
                  <div className="flex items-center gap-2">
                    {canEditRate ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-white/40">$</span>
                        <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="w-16 bg-transparent text-3xl font-black text-white outline-none" />
                      </div>
                    ) : (
                      <p className="text-3xl font-black text-white">${rate}</p>
                    )}
                    <span className="text-white/20 text-[12px] font-bold self-end pb-1">/ час</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-[24px] p-5 border border-white/5">
                    <span className="text-white/20 text-[9px] font-black uppercase block mb-1">Отработано</span>
                    <p className="text-[20px] font-black text-blue-400">{totalHours}ч</p>
                  </div>
                  <div className="bg-white/5 rounded-[24px] p-5 border border-white/5">
                    <span className="text-white/20 text-[9px] font-black uppercase block mb-1">Выплата</span>
                    <p className="text-[20px] font-black text-green-400">${totalEarned.toLocaleString()}</p>
                  </div>
                </div>

                <Button 
                  onClick={isLocked ? handleUnlock : handleSubmit} 
                  variant="transparent"
                  disabled={isSubmitting || (!isLocked && (totalHours === 0 || !isCurrentMonth)) || (isLocked && !isAuthority)}
                  className={`w-full h-16 rounded-[24px] font-black uppercase tracking-widest text-[12px] border-2 transition-all ${
                    isLocked ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-blue-600 border-blue-500 text-white hover:shadow-2xl shadow-blue-500/20"
                  }`}
                >
                  {isSubmitting ? "..." : isLocked ? (isAuthority ? "Разблокировать" : "Утверждено") : "Отправить"}
                </Button>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 backdrop-blur-xl">
              <h3 className="text-[14px] font-black uppercase tracking-[0.2em] mb-6 text-white/40 flex items-center gap-3">
                <User size={18} className="text-blue-400" />
                Контакты
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-white/15 uppercase tracking-widest mb-1">Бухгалтер</p>
                    <p className="font-bold text-[14px] text-white/80">{CURRENT_PROJECT.accountant.name}</p>
                  </div>
                  <a href={`https://t.me/${CURRENT_PROJECT.accountant.telegram.replace('@', '')}`} className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"><SendHorizontal size={16} /></a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* Accountant Approval Queue View */
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {groupedApprovals.length > 0 ? (
            groupedApprovals.map((group) => (
              <div key={group.label} className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="text-[13px] font-black text-white/20 uppercase tracking-[0.5em] whitespace-nowrap">{group.label}</h2>
                  <div className="h-px flex-1 bg-white/[0.03]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {group.items.map((approval) => (
                    <div key={approval.id} className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 hover:bg-white/[0.04] transition-all group relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
                      
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                            <User size={28} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h3 className="font-black text-[18px] text-white/90 leading-tight">{approval.userName}</h3>
                            <p className="text-[12px] text-white/20 font-bold uppercase tracking-wider mt-1">{new Date(approval.submittedAt).toLocaleDateString('ru-RU')}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          approval.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                          approval.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {approval.status === 'pending' ? 'Ожидает' : approval.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-[24px] p-5 border border-white/5">
                          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest block mb-2">Отработано</span>
                          <p className="text-[22px] font-black text-blue-400 leading-none">{approval.totalHours}<span className="text-[12px] ml-1 text-white/20 uppercase">ч</span></p>
                        </div>
                        <div className="bg-white/5 rounded-[24px] p-5 border border-white/5">
                          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest block mb-2">К выплате</span>
                          <p className="text-[22px] font-black text-green-400 leading-none">${(approval.totalHours * CURRENT_PROJECT.rate).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => setSelectedApproval(approval)}
                          className="flex-1 h-14 rounded-[20px] bg-white/5 border border-white/10 text-[13px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Проверить
                        </button>
                        {approval.status === 'pending' && (
                          <button onClick={() => handleApprove(approval.id)} className="w-14 h-14 rounded-[20px] bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all">
                            <Check size={24} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-24 w-24 rounded-[40px] bg-white/5 flex items-center justify-center text-white/10 border border-white/5 shadow-inner">
                <FileCheck size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-white/80">Очередь пуста</h3>
                <p className="text-white/20 text-[15px] max-w-sm font-medium">На данный момент нет новых таймлогов, ожидающих вашего одобрения.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Review Modal for Accountant */}
      {selectedApproval && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelectedApproval(null)} />
          <div className="relative w-full max-w-5xl bg-[#0D0D0D] border border-white/10 rounded-[60px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 h-[90vh] flex flex-col">
            <header className="p-10 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                  <User size={36} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">{selectedApproval.userName}</h3>
                  <p className="text-white/30 text-[14px] font-bold uppercase tracking-widest mt-1">Таймлог: {MONTHS[selectedApproval.month]} {selectedApproval.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleExportEmployee(selectedApproval)}
                  disabled={isExporting}
                  className="px-6 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[12px] hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  {isExporting ? "..." : "Экспорт"}
                </button>
                {selectedApproval.status === 'pending' && (
                  <>
                    <button onClick={() => { handleReject(selectedApproval.id); setSelectedApproval(null); }} className="px-8 h-14 rounded-2xl bg-red-500/10 text-red-400 font-black uppercase tracking-widest text-[12px] hover:bg-red-500 hover:text-white transition-all border border-red-500/20">Отклонить</button>
                    <button onClick={() => { handleApprove(selectedApproval.id); setSelectedApproval(null); }} className="px-10 h-14 rounded-2xl bg-green-500 text-white font-black uppercase tracking-widest text-[12px] hover:bg-green-600 shadow-2xl shadow-green-500/20 transition-all">Утвердить</button>
                  </>
                )}
                <button onClick={() => setSelectedApproval(null)} className="h-14 w-14 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"><X size={32} /></button>
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                  <span className="text-white/20 text-[11px] font-black uppercase tracking-widest block mb-2">Всего за месяц</span>
                  <p className="text-3xl font-black text-blue-400">{selectedApproval.totalHours}<span className="text-[16px] ml-1 text-white/20">часов</span></p>
                </div>
                <div className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                  <span className="text-white/20 text-[11px] font-black uppercase tracking-widest block mb-2">Ставка тарифа</span>
                  <p className="text-3xl font-black text-white">${CURRENT_PROJECT.rate}<span className="text-[16px] ml-1 text-white/20">/ ч</span></p>
                </div>
                <div className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                  <span className="text-white/20 text-[11px] font-black uppercase tracking-widest block mb-2">Итого к выплате</span>
                  <p className="text-3xl font-black text-green-400">${(selectedApproval.totalHours * CURRENT_PROJECT.rate).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[48px] overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-left">
                      <th className="pl-10 pr-6 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Дата</th>
                      <th className="px-6 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Описание выполненных работ</th>
                      <th className="pl-6 pr-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center w-24">Часы</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {daysInMonth.map((date) => {
                      const hours = Math.random() > 0.4 ? Math.floor(Math.random() * 8) + 1 : 0;
                      if (hours === 0) return null;
                      return (
                        <tr key={date.toISOString()} className="hover:bg-white/[0.02] transition-colors">
                          <td className="pl-10 pr-6 py-6"><span className="text-[15px] font-bold text-white/80">{date.getDate()} {MONTHS[date.getMonth()]}</span></td>
                          <td className="px-6 py-6"><p className="text-[14px] text-white/50 leading-relaxed">Разработка интерфейса личного кабинета, настройка стейт-менеджмента и интеграция API эндпоинтов.</p></td>
                          <td className="pl-6 pr-10 py-6 text-center"><span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-xl text-[15px] font-black border border-blue-500/20">{hours}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
};
