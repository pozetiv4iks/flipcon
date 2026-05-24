"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Clock, 
  Users,
  Calendar as CalendarIcon,
  Copy,
  MoreHorizontal,
  Settings2
} from "lucide-react";
import { Sidebar } from "@/src/components/sidebar/Sidebar";

// --- Types ---
type EventType = "push-up" | "news" | "event";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  startTime: string;
  endTime?: string;
  date: string; // YYYY-MM-DD
  description?: string;
  participants?: string[];
}

// --- Mock Data ---
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "News",
    type: "news",
    startTime: "29.08",
    endTime: "30.08",
    date: "2026-05-06",
    description: "News are nothing with...",
  },
  {
    id: "2",
    title: "Push up",
    type: "push-up",
    startTime: "18:30",
    date: "2026-05-04",
    description: "Push up are nothing with...",
  },
  {
    id: "3",
    title: "Push up",
    type: "push-up",
    startTime: "12:00",
    date: "2026-05-08",
    description: "Push up are nothing with...",
  },
  {
    id: "4",
    title: "Event",
    type: "event",
    startTime: "12:00",
    endTime: "14:30",
    date: "2026-05-20",
    description: "Event are nothing with...",
    participants: ["/images/avatar1.png", "/images/avatar2.png"]
  },
  {
    id: "5",
    title: "News",
    type: "news",
    startTime: "29.08",
    endTime: "30.08",
    date: "2026-05-23",
    description: "News are nothing with...",
  }
];

const eventColors: Record<EventType, string> = {
  "push-up": "bg-[#E2F5D6] text-[#2D4A1E]",
  "news": "bg-[#E8E4FF] text-[#3B3486]",
  "event": "bg-[#FFE8E4] text-[#863B34]",
};

const eventBorderColors: Record<EventType, string> = {
  "push-up": "border-[#C5E8AF]",
  "news": "border-[#D1CCFF]",
  "event": "border-[#FFD1CC]",
};

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust to Mon-Sun
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const selectedDateStr = formatDate(selectedDate);
  const dayEvents = mockEvents.filter(e => e.date === selectedDateStr);

  return (
    <div className="flex h-screen bg-[#040035] bg-[radial-gradient(ellipse_120%_80%_at_50%_20%,#040035_0%,#000000_75%)] text-white overflow-hidden">
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
      <Sidebar />
      
      <div className={`flex flex-1 ml-[64px] transition-all duration-300`}>
        
        {/* Middle Sidebar (Day Details) */}
        <aside className={`w-[360px] flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[24px] font-bold">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}, 
                <span className="text-white/40 ml-2">{selectedDate.getDate()}th</span>
              </h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {daysOfWeek.map((day, idx) => {
                const d = new Date(selectedDate);
                const currentDay = d.getDay() === 0 ? 6 : d.getDay() - 1;
                const diff = idx - currentDay;
                const dateAtIdx = new Date(selectedDate);
                dateAtIdx.setDate(selectedDate.getDate() + diff);
                const isSelected = dateAtIdx.getDate() === selectedDate.getDate();

                return (
                  <div key={day} className="flex items-center gap-6">
                    <span className={`text-[13px] w-8 ${isSelected ? 'text-white font-bold' : 'text-white/30'}`}>{day}</span>
                    <div className="flex-1">
                      {isSelected ? (
                        <div className="space-y-3">
                          {dayEvents.length > 0 ? dayEvents.map(event => (
                            <div key={event.id} className={`p-4 rounded-2xl ${eventColors[event.type]} relative group`}>
                              <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity">
                                <X size={14} />
                              </button>
                              <p className="text-[14px] font-bold mb-1">{event.title}</p>
                              <div className="flex items-center gap-2 text-[11px] opacity-70">
                                <Clock size={12} />
                                <span>{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
                              </div>
                              {event.participants && (
                                <div className="mt-3 flex items-center gap-2">
                                  <p className="text-[11px] font-medium opacity-60">Participants</p>
                                  <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white/20 bg-black/20 flex items-center justify-center text-[10px]">
                                        +
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )) : (
                            <div className="h-20 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-white/20 text-[13px]">
                              No events
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-px w-full bg-white/5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create Event Form */}
          <div className="mt-auto bg-black/40 p-8 border-t border-white/5">
            <div className="flex gap-4 mb-6">
              {["Event", "Push up", "News", "Email"].map((tab, i) => (
                <button key={tab} className={`text-[12px] font-bold pb-1 border-b-2 ${i === 0 ? 'border-white text-white' : 'border-transparent text-white/30'}`}>
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="New Opening" 
                  className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] outline-none focus:border-white transition-colors"
                />
              </div>
              
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-2">Description</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-1">Set time</label>
                  <p className="text-[13px]">15th August at 12:00</p>
                </div>
                <CalendarIcon size={16} className="text-white/30" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#040035] bg-white/10" />
                  ))}
                </div>
                <button className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              <button className="w-full bg-[#E8E4FF] text-[#3B3486] font-bold py-4 rounded-xl text-[14px] hover:brightness-105 active:scale-[0.98] transition-all">
                Save Event
              </button>
            </div>
          </div>
        </aside>

        {/* Main Calendar Grid */}
        <main className="flex-1 flex flex-col">
          <header className="h-20 flex items-center justify-between px-10 border-b border-white/5">
            <div className="flex items-center gap-6">
              <button onClick={prevMonth} className="text-white/30 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-[14px] font-black tracking-widest">
                {months[currentDate.getMonth()]} <span className="text-white/30 ml-1">{currentDate.getFullYear()}</span>
              </h3>
              <button onClick={nextMonth} className="text-white/30 hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="h-10 w-10 rounded-xl border border-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                <Settings2 size={18} />
              </button>
              <button className="h-10 w-10 rounded-xl border border-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors">
                <CalendarIcon size={18} />
              </button>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr]">
            {/* Weekday Headers */}
            {daysOfWeek.map(day => (
              <div key={day} className="py-4 text-center text-[13px] font-bold text-white/30 border-b border-white/5">
                {day}
              </div>
            ))}

            {/* Calendar Cells */}
            <div className="col-span-7 grid grid-cols-7 h-full">
              {/* Empty cells for previous month */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-r border-b border-white/5 p-4 text-white/10 text-[13px] font-bold">
                  {/* Could show prev month dates here */}
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateStr = formatDate(dateObj);
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                const events = mockEvents.filter(e => e.date === dateStr);

                return (
                  <div 
                    key={day} 
                    onClick={() => {
                      const isSameDay = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                      if (isSameDay && isSidebarOpen) {
                        setIsSidebarOpen(false);
                      } else {
                        setSelectedDate(dateObj);
                        setIsSidebarOpen(true);
                      }
                    }}
                    className={`border-r border-b border-white/5 p-3 flex flex-col gap-2 cursor-pointer transition-colors hover:bg-white/[0.02] ${isSelected && isSidebarOpen ? 'bg-white/[0.03]' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] font-bold h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? (isSidebarOpen ? 'bg-white text-black' : 'border border-white text-white')
                          : (isToday ? 'border border-white/40 text-white' : 'text-white/30')
                      }`}>
                        {day}
                      </span>
                      {events.length > 3 && (
                        <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                          +{events.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1.5 overflow-hidden">
                      {events.slice(0, 3).map(event => (
                        <div 
                          key={event.id} 
                          className={`px-2 py-1.5 rounded-lg border-l-4 ${eventColors[event.type]} ${eventBorderColors[event.type]} text-[10px] font-bold truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
