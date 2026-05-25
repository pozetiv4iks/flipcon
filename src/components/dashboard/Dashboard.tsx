"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

// --- Mock Data ---
const tasks = [
  { id: 1, title: "Дизайн дашборда", project: "Flipcon", deadline: "Сегодня", status: "in-progress" },
  { id: 2, title: "Интеграция API", project: "Backend", deadline: "Завтра", status: "todo" },
  { id: 3, title: "Тестирование онбординга", project: "QA", deadline: "24 мая", status: "todo" },
];

// --- Components ---

const ActivityGraph = () => {
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
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-white">Активность</h3>
        <div className="flex items-center gap-2 text-[12px] text-white/40">
          <span>Меньше</span>
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
          <span>Больше</span>
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
  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-white">Текущие задачи</h3>
        <button className="text-white/40 hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3 transition-colors hover:bg-white/[0.03]"
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
        Все задачи <ChevronRight size={14} />
      </button>
    </div>
  );
};

const CalendarWidget = () => {
  const [mounted, setMounted] = React.useState(false);
  const [today, setToday] = React.useState<Date | null>(null);
  
  React.useEffect(() => {
    setToday(new Date());
    setMounted(true);
  }, []);

  if (!mounted || !today) {
    return <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm min-h-[300px] animate-pulse" />;
  }

  const dayName = today.toLocaleDateString('ru-RU', { weekday: 'long' });
  const dayNum = today.getDate();
  const monthName = today.toLocaleDateString('ru-RU', { month: 'long' });

  // Получаем количество дней в текущем месяце
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  // Получаем первый день месяца (0 - воскресенье, 1 - понедельник и т.д.)
  // Преобразуем к формату Пн=0, ..., Вс=6
  let firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <p className="text-[14px] font-medium uppercase tracking-widest text-white/40">{dayName}</p>
        <h2 className="my-2 text-[64px] font-black leading-none text-white">{dayNum}</h2>
        <p className="text-[18px] font-semibold text-white/90">{monthName}</p>
      </div>
      
      <div className="mt-8 grid grid-cols-7 gap-1 text-center text-[11px] text-white/20">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <div key={d}>{d}</div>)}
        
        {/* Пустые ячейки для выравнивания начала месяца */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7" />
        ))}

        {/* Дни месяца */}
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

export const Dashboard = () => {
  return (
    <div className="flex min-h-screen text-white">
      <main className="flex-1 p-10 transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10">
            <h1 className="text-3xl font-bold">Добрый день, Степан</h1>
            <p className="mt-2 text-white/40">Вот что происходит в ваших проектах сегодня.</p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column: Activity & Tasks */}
            <div className="space-y-6 lg:col-span-2">
              <ActivityGraph />
              <TasksWidget />
            </div>

            {/* Right Column: Calendar & Stats */}
            <div className="space-y-6">
              <CalendarWidget />
              <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-[16px] font-semibold text-white">Статистика недели</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-white/40">Выполнено задач</span>
                    <span className="text-[15px] font-bold text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-white/40">Часов в работе</span>
                    <span className="text-[15px] font-bold text-white">34.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
