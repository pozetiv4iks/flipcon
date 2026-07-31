"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  ChevronRight,
  MoreHorizontal,
  Plus,
  X,
  Layout,
  Activity as ActivityIcon,
  ListTodo,
  BarChart3,
  Settings2,
  GripVertical,
  Trash2,
  Users,
  Wallet,
  Shield
} from "lucide-react";

// --- Types ---
interface Widget {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  defaultColumn: "left" | "right";
}

// --- Mock Data ---
const tasks = [
  { id: 1, title: "Дизайн дашборда", project: "Flipcon", deadline: "Сегодня", status: "in-progress" },
  { id: 2, title: "Интеграция API", project: "Backend", deadline: "Завтра", status: "todo" },
  { id: 3, title: "Тестирование онбординга", project: "QA", deadline: "24 мая", status: "todo" },
];

// --- Widget Components ---

const ActivityGraph = () => {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [contributionData, setContributionData] = React.useState<{day: number, value: number}[]>([]);

  React.useEffect(() => {
    setContributionData(
      Array.from({ length: 52 * 7 }, (_, i) => ({
        day: i,
        value: Math.floor(Math.random() * 5),
      }))
    );
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm min-h-[150px] animate-pulse" />
    );
  }

  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-white">{t.dashboard.activity}</h3>
        <div className="flex items-center gap-2 text-[12px] text-white/40">
          <span>{t.dashboard.less}</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((v) => (
              <div 
                key={v} 
                className="h-3 w-3 rounded-sm" 
                style={{ 
                  backgroundColor: v === 0 ? 'rgba(255,255,255,0.05)' : `rgba(255,255,255,${0.2 * v})` 
                }} 
              />
            ))}
          </div>
          <span>{t.dashboard.more}</span>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto pb-2 custom-scrollbar">
        {contributionData.map((d) => (
          <div
            key={d.day}
            className="h-[10px] w-[10px] rounded-[2px] transition-colors hover:ring-1 hover:ring-white/20"
            style={{
              backgroundColor: d.value === 0 ? 'rgba(255,255,255,0.05)' : `rgba(255,255,255,${0.2 * d.value})`
            }}
            title={`День ${d.day}: ${d.value} активностей`}
          />
        ))}
      </div>
    </div>
  );
};

const TasksWidget = () => {
  const { t } = useLanguage();
  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-white">{t.dashboard.tasks}</h3>
        <button className="text-white/40 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="group/item flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3 transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${task.status === 'in-progress' ? 'bg-blue-500' : 'bg-white/20'}`} />
              <div>
                <p className="text-[14px] font-medium text-white/90">{task.title}</p>
                <p className="text-[12px] text-white/40">{task.project}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-white/60">{task.deadline}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 py-3 text-[13px] text-white/50 transition-colors hover:bg-white/5 hover:text-white">
        {t.dashboard.allTasks} <ChevronRight size={14} />
      </button>
    </div>
  );
};

const CalendarWidget = () => {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);
  const [today, setToday] = React.useState<Date | null>(null);
  
  React.useEffect(() => {
    setToday(new Date());
    setMounted(true);
  }, []);

  if (!mounted || !today) {
    return <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm min-h-[300px] animate-pulse" />;
  }

  const dayName = today.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long' });
  const dayNum = today.getDate();
  const monthName = today.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { month: 'long' });

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  let firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group relative">
      <div className="flex flex-col items-center text-center">
        <p className="text-[14px] font-medium uppercase tracking-widest text-white/40">{dayName}</p>
        <h2 className="my-2 text-[64px] font-black leading-none text-white">{dayNum}</h2>
        <p className="text-[18px] font-semibold text-white/90">{monthName}</p>
      </div>
      
      <div className="mt-8 grid grid-cols-7 gap-1 text-center text-[11px] text-white/20">
        {t.calendar.weekdays.map(d => <div key={d}>{d}</div>)}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const isToday = d === dayNum;
          return (
            <div 
              key={d} 
              className={`flex h-7 items-center justify-center rounded-lg text-[12px] transition-all ${
                isToday 
                  ? 'bg-white font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatsWidget = () => {
  const { t } = useLanguage();
  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group relative">
      <h3 className="mb-4 text-[16px] font-semibold text-white">{t.dashboard.weekStats}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-white/40">{t.dashboard.completedTasks}</span>
          <span className="text-[15px] font-bold text-white">12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-white/40">{t.dashboard.workHours}</span>
          <span className="text-[15px] font-bold text-white">34.5</span>
        </div>
      </div>
    </div>
  );
};

const AccountantStatsWidget = () => {
  const { t } = useLanguage();
  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group relative">
      <h3 className="mb-6 text-[16px] font-semibold text-white">Статистика по команде</h3>
      <div className="space-y-5">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Clock size={16} />
            </div>
            <span className="text-[13px] text-white/60">Логов за месяц</span>
          </div>
          <span className="text-[18px] font-black text-white">24</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
              <Wallet size={16} />
            </div>
            <span className="text-[13px] text-white/60">Денег за месяц</span>
          </div>
          <span className="text-[18px] font-black text-white">$21,300</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users size={16} />
            </div>
            <span className="text-[13px] text-white/60">Сотрудников</span>
          </div>
          <span className="text-[18px] font-black text-white">12</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

export const Dashboard = () => {
  const { t } = useLanguage();
  const [leftWidgets, setLeftWidgets] = useState<string[]>(["activity", "tasks"]);
  const [rightWidgets, setRightWidgets] = useState<string[]>(["calendar", "stats"]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>("developer");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user?.role || "developer");
    setMounted(true);
  }, []);

  const defaultPermissions: Record<string, { widgets: string[] }> = {
    admin: { widgets: ["activity", "tasks", "calendar", "stats", "acc_stats", "permissions_widget"] },
    manager: { widgets: ["activity", "tasks", "calendar", "stats"] },
    accountant: { widgets: ["calendar", "stats", "acc_stats"] },
    teamlead: { widgets: ["activity", "tasks", "calendar", "stats"] },
    developer: { widgets: ["activity", "tasks", "calendar"] },
    hr: { widgets: ["calendar", "stats"] }
  };

  const permissions = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('role-permissions') || JSON.stringify(defaultPermissions))
    : defaultPermissions;

  const rolePermissions = permissions[userRole] || permissions.developer;

  const allWidgets: Record<string, Widget> = {
    activity: { 
      id: "activity", 
      title: t.dashboard.activity, 
      icon: <ActivityIcon size={18} />, 
      component: <ActivityGraph />,
      defaultColumn: "left"
    },
    tasks: { 
      id: "tasks", 
      title: t.dashboard.tasks, 
      icon: <ListTodo size={18} />, 
      component: <TasksWidget />,
      defaultColumn: "left"
    },
    calendar: { 
      id: "calendar", 
      title: t.dashboard.calendar, 
      icon: <CalendarIcon size={18} />, 
      component: <CalendarWidget />,
      defaultColumn: "right"
    },
    stats: { 
      id: "stats", 
      title: t.dashboard.stats, 
      icon: <BarChart3 size={18} />, 
      component: <StatsWidget />,
      defaultColumn: "right"
    },
    acc_stats: { 
      id: "acc_stats", 
      title: "Статистика по команде", 
      icon: <Users size={18} />, 
      component: <AccountantStatsWidget />,
      defaultColumn: "right"
    },
    permissions_widget: {
      id: "permissions_widget",
      title: "Управление доступом",
      icon: <Shield size={18} />,
      component: (
        <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group relative">
          <h3 className="mb-4 text-[16px] font-semibold text-white">Управление проектом</h3>
          <p className="text-[13px] text-white/40 mb-6">Быстрый доступ к настройкам ролей и прав вашей команды.</p>
          <button 
            onClick={() => window.location.href = '/settings'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-[13px] font-bold text-white transition-all hover:bg-blue-600"
          >
            Настроить доступы
          </button>
        </div>
      ),
      defaultColumn: "left"
    }
  };

  const filteredWidgets = Object.keys(allWidgets).filter(id => rolePermissions.widgets?.includes(id));
  
  useEffect(() => {
    if (mounted) {
      setLeftWidgets(prev => prev.filter(id => rolePermissions.widgets?.includes(id)));
      setRightWidgets(prev => prev.filter(id => rolePermissions.widgets?.includes(id)));
    }
  }, [mounted, userRole]);

  // ... rest of the component


  const addWidget = (id: string) => {
    const widget = allWidgets[id];
    if (widget.defaultColumn === "left") {
      setLeftWidgets([...leftWidgets, id]);
    } else {
      setRightWidgets([...rightWidgets, id]);
    }
  };

  const removeWidget = (id: string, column: "left" | "right") => {
    if (column === "left") {
      setLeftWidgets(leftWidgets.filter(w => w !== id));
    } else {
      setRightWidgets(rightWidgets.filter(w => w !== id));
    }
  };

  // --- Drag and Drop Handlers ---
  const onDragStart = (e: React.DragEvent, id: string, sourceColumn: "left" | "right") => {
    if (!isCustomizing) return;
    e.dataTransfer.setData("widgetId", id);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
    e.currentTarget.classList.add('opacity-50');
  };

  const onDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const onDragOver = (e: React.DragEvent, targetId?: string, targetColumn?: "left" | "right") => {
    if (!isCustomizing) return;
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetColumn: "left" | "right", targetId?: string) => {
    if (!isCustomizing) return;
    const id = e.dataTransfer.getData("widgetId");
    const sourceColumn = e.dataTransfer.getData("sourceColumn") as "left" | "right";

    if (!id) return;

    let newLeft = [...leftWidgets];
    let newRight = [...rightWidgets];

    // Remove from source
    if (sourceColumn === "left") {
      newLeft = newLeft.filter(w => w !== id);
    } else {
      newRight = newRight.filter(w => w !== id);
    }

    // Add to target
    const targetList = targetColumn === "left" ? newLeft : newRight;
    const insertIndex = targetId ? targetList.indexOf(targetId) : targetList.length;
    
    targetList.splice(insertIndex, 0, id);

    if (targetColumn === "left") {
      setLeftWidgets(newLeft);
      setRightWidgets(newRight);
    } else {
      setLeftWidgets(newLeft);
      setRightWidgets(newRight);
    }
  };

  const activeWidgets = [...leftWidgets, ...rightWidgets];

  return (
    <div className="flex min-h-screen text-white">
      <main className="flex-1 p-10 transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.dashboard.greeting}</h1>
              <p className="mt-2 text-white/40">{t.dashboard.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {isCustomizing && (
                <button 
                  onClick={() => setShowAddMenu(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus size={18} />
                  <span className="text-[14px] font-medium">{t.dashboard.addWidget}</span>
                </button>
              )}
              <button 
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  isCustomizing 
                    ? 'bg-white text-black border-white' 
                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings2 size={18} />
                <span className="text-[14px] font-medium">{isCustomizing ? t.common.done : t.dashboard.customize}</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative">
            {/* Left Column */}
            <div 
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, "left")}
              className={`space-y-6 lg:col-span-2 min-h-[200px] rounded-[32px] transition-all ${isCustomizing ? 'bg-white/[0.02] p-4 border border-dashed border-white/5' : ''}`}
            >
              {leftWidgets.map(id => (
                <div 
                  key={id} 
                  draggable={isCustomizing}
                  onDragStart={(e) => onDragStart(e, id, "left")}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => onDragOver(e, id, "left")}
                  onDrop={(e) => {
                    e.stopPropagation();
                    onDrop(e, "left", id);
                  }}
                  className={`relative group/widget ${isCustomizing ? 'cursor-grab active:cursor-grabbing transition-transform duration-200' : ''}`}
                >
                  {isCustomizing && (
                    <div className="absolute -top-3 -right-3 z-10 flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center shadow-lg">
                        <GripVertical size={14} className="opacity-40" />
                      </div>
                      <button 
                        onClick={() => removeWidget(id, "left")}
                        className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  {allWidgets[id].component}
                </div>
              ))}
              
              {/* Removed old Add Widget button from here */}
            </div>

            {/* Right Column */}
            <div 
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, "right")}
              className={`space-y-6 min-h-[200px] rounded-[32px] transition-all ${isCustomizing ? 'bg-white/[0.02] p-4 border border-dashed border-white/5' : ''}`}
            >
              {rightWidgets.map(id => (
                <div 
                  key={id} 
                  draggable={isCustomizing}
                  onDragStart={(e) => onDragStart(e, id, "right")}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => onDragOver(e, id, "right")}
                  onDrop={(e) => {
                    e.stopPropagation();
                    onDrop(e, "right", id);
                  }}
                  className={`relative group/widget ${isCustomizing ? 'cursor-grab active:cursor-grabbing transition-transform duration-200' : ''}`}
                >
                  {isCustomizing && (
                    <div className="absolute -top-3 -right-3 z-10 flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center shadow-lg">
                        <GripVertical size={14} className="opacity-40" />
                      </div>
                      <button 
                        onClick={() => removeWidget(id, "right")}
                        className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  {allWidgets[id].component}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Widget Menu Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddMenu(false)} />
          <div className="relative w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[20px] font-bold">{t.dashboard.addWidget}</h2>
              <button onClick={() => setShowAddMenu(false)} className="text-white/40 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {Object.values(allWidgets)
                .filter(w => rolePermissions.widgets?.includes(w.id))
                .map(widget => (
                  <button
                    key={widget.id}
                  onClick={() => {
                    if (!activeWidgets.includes(widget.id)) {
                      addWidget(widget.id);
                    }
                    setShowAddMenu(false);
                  }}
                  disabled={activeWidgets.includes(widget.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    activeWidgets.includes(widget.id)
                      ? 'bg-white/5 border-transparent opacity-40 cursor-not-allowed'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                      {widget.icon}
                    </div>
                    <span className="font-medium">{widget.title}</span>
                  </div>
                  {activeWidgets.includes(widget.id) ? (
                    <span className="text-[12px] text-white/20 font-bold uppercase">{t.common.done}</span>
                  ) : (
                    <Plus size={18} className="text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


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
