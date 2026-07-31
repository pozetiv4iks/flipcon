"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/src/i18n/LanguageContext";
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
  Settings2,
  ChevronDown
} from "lucide-react";

// --- Types ---
type EventType = "push-up" | "news" | "event" | "task";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  startTime: string;
  endTime?: string;
  date: string; // YYYY-MM-DD
  description?: string;
  participants?: string[];
  assigneeId?: string;
  assignees?: string[]; // IDs of selected users
  isEveryone?: boolean;
  color?: string; // Hex or CSS class
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
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
  "task": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
};

const eventBorderColors: Record<EventType, string> = {
  "push-up": "border-[#C5E8AF]",
  "news": "border-[#D1CCFF]",
  "event": "border-[#FFD1CC]",
  "task": "border-blue-500/30",
};

export const CalendarPage = () => {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 25)); // Fixed date for SSR
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 25));
  const [today, setToday] = useState(new Date(2026, 4, 25));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempYear, setTempYear] = useState(2026);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [boardCards, setBoardCards] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
    setToday(now);

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load mock users (in real app from API/localStorage)
    const mockUsers: User[] = [
      { id: "u1", name: "Stepan Dyleuski", role: "admin" },
      { id: "u2", name: "Иван Иванов", role: "developer" },
      { id: "u3", name: "Мария Сидорова", role: "accountant" },
    ];
    setUsers(mockUsers);
    
    // Load cards from board
    const savedCards = localStorage.getItem('flipcon-board-cards');
    let cardEvents: CalendarEvent[] = [];
    if (savedCards) {
      const cards = JSON.parse(savedCards);
      setBoardCards(cards);
      
      cardEvents = cards
        .filter((c: any) => c.dueDate)
        .map((c: any) => ({
          id: `card-${c.id}`,
          title: c.title,
          type: "task",
          startTime: c.dueTime || "09:00",
          date: c.dueDate,
          description: c.description,
          assigneeId: c.assigneeId
        }));
    }
    
    setAllEvents([...mockEvents, ...cardEvents]);
    
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventColor, setEventColor] = useState("#E8E4FF");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [isEveryone, setIsEveryone] = useState(false);

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) return;
    
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      type: "event",
      startTime: "12:00",
      date: formatDate(selectedDate),
      description: eventDescription,
      assignees: isEveryone ? [] : selectedAssignees,
      isEveryone: isEveryone,
      color: eventColor
    };

    const updatedEvents = [...allEvents, newEvent];
    setAllEvents(updatedEvents);
    setEventTitle("");
    setEventDescription("");
    setSelectedAssignees([]);
    setIsEveryone(false);
  };

  const canCreateEvent = currentUser?.role === 'admin' || currentUser?.role === 'teamlead';

  const daysOfWeek = t.calendar.weekdays;
  const months = t.calendar.months;

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
  const dayEvents = allEvents.filter(e => e.date === selectedDateStr);

  return (
    <div className="flex h-screen text-white overflow-hidden">
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
      
      <div className={`flex flex-1 transition-all duration-300`}>
        
        {/* Middle Sidebar (Day Details) */}
        <aside className={`w-[360px] flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}`}>
          {mounted ? (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[24px] font-bold">
                  {selectedDate.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long' })}, 
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
                              <div 
                                key={event.id} 
                                className={`p-4 rounded-2xl relative group ${event.color ? '' : eventColors[event.type]}`}
                                style={event.color ? { backgroundColor: `${event.color}20`, color: event.color, border: `1px solid ${event.color}40` } : {}}
                              >
                                <button 
                                  onClick={() => setAllEvents(allEvents.filter(e => e.id !== event.id))}
                                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity"
                                >
                                  <X size={14} />
                                </button>
                                <p className="text-[14px] font-bold mb-1">{event.title}</p>
                                <div className="flex items-center gap-2 text-[11px] opacity-70">
                                  <Clock size={12} />
                                  <span>{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
                                </div>
                                {event.description && (
                                  <p className="mt-2 text-[12px] opacity-60 leading-relaxed">{event.description}</p>
                                )}
                                {(event.participants || event.assigneeId || event.assignees || event.isEveryone) ? (
                                  <div className="mt-3 flex items-center gap-2">
                                    <p className="text-[11px] font-medium opacity-60">
                                      {event.type === 'task' ? 'Исполнитель:' : 'Участники:'}
                                    </p>
                                    {event.isEveryone ? (
                                      <div className="h-6 px-2 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-bold">
                                        Все участники
                                      </div>
                                    ) : event.assigneeId ? (
                                      <div className="h-6 px-2 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-bold">
                                        {users.find(u => u.id === event.assigneeId)?.name || 'Неизвестно'}
                                      </div>
                                    ) : event.assignees && event.assignees.length > 0 ? (
                                      <div className="flex -space-x-2">
                                        {event.assignees.map(id => {
                                          const user = users.find(u => u.id === id);
                                          return (
                                            <div key={id} className="h-6 w-6 rounded-full border-2 border-white/20 bg-black/20 flex items-center justify-center text-[10px] font-bold" title={user?.name}>
                                              {user?.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : event.participants ? (
                                      <div className="flex -space-x-2">
                                        {event.participants.map((p, i) => (
                                          <div key={i} className="h-6 w-6 rounded-full border-2 border-white/20 bg-black/20 flex items-center justify-center text-[10px]">
                                            +
                                          </div>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            )) : (
                              <div className="h-20 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-white/20 text-[13px]">
                                {t.calendar.noEvents}
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
          ) : (
            <div className="p-8 animate-pulse space-y-8">
              <div className="h-8 w-48 bg-white/5 rounded-lg" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="h-12 w-full bg-white/5 rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {/* Create Event Form */}
          {canCreateEvent ? (
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
                  <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-2">{t.calendar.eventTitle}</label>
                  <input 
                    type="text" 
                    placeholder="Название события..." 
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] outline-none focus:border-white transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-2">{t.calendar.description}</label>
                  <textarea 
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-[14px] outline-none focus:border-white transition-colors resize-none"
                    rows={1}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-2">{t.calendar.color}</label>
                    <div className="flex flex-wrap gap-2">
                      {["#E8E4FF", "#FFE8E4", "#E2F5D6", "#E4F5FF", "#FFF7E4"].map(c => (
                        <button
                          key={c}
                          onClick={() => setEventColor(c)}
                          className={`h-6 w-6 rounded-full border-2 transition-all ${eventColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-2">{t.calendar.assignees}</label>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsEveryone(!isEveryone)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${isEveryone ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                      >
                        {t.calendar.everyone}
                      </button>
                    </div>
                  </div>
                </div>

                {!isEveryone && (
                  <div className="flex flex-wrap gap-2">
                    {users.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          if (selectedAssignees.includes(user.id)) {
                            setSelectedAssignees(selectedAssignees.filter(id => id !== user.id));
                          } else {
                            setSelectedAssignees([...selectedAssignees, user.id]);
                          }
                        }}
                        className={`flex items-center gap-2 px-2 py-1 rounded-lg border transition-all ${selectedAssignees.includes(user.id) ? 'bg-blue-500 text-white border-blue-500' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                      >
                        <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[10px]">{user.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[11px] text-white/30 uppercase tracking-widest block mb-1">{t.calendar.setTime}</label>
                    <p className="text-[13px]">{selectedDate.getDate()} {months[selectedDate.getMonth()]}, 12:00</p>
                  </div>
                  <CalendarIcon size={16} className="text-white/30" />
                </div>

                <button 
                  onClick={handleSaveEvent}
                  className="w-full bg-[#E8E4FF] text-[#3B3486] font-bold py-4 rounded-xl text-[14px] hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  {t.calendar.saveEvent}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-auto bg-black/40 p-8 border-t border-white/5">
              <p className="text-[13px] text-white/20 italic text-center">У вас недостаточно прав для создания событий</p>
            </div>
          )}
        </aside>


        {/* Main Calendar Grid */}
        <main className="flex-1 flex flex-col">
          <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 relative">
            <div className="flex items-center gap-6">
              <button onClick={prevMonth} className="text-white/30 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="relative" ref={datePickerRef}>
                <button 
                  onClick={() => {
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setTempYear(currentDate.getFullYear());
                  }}
                  className="flex items-center gap-2 text-[14px] font-black tracking-widest uppercase hover:text-white/80 transition-all"
                >
                  {mounted ? months[currentDate.getMonth()] : '...'} 
                  <span className="text-white/30 ml-1">{mounted ? currentDate.getFullYear() : '....'}</span>
                  <ChevronDown size={14} className={`text-white/20 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 mt-4 z-50 w-[320px] bg-[#0D0D0D] border border-white/10 rounded-[24px] shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between mb-6">
                      <button 
                        onClick={() => setTempYear(tempYear - 1)}
                        className="p-2 text-white/30 hover:text-white transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-[18px] font-bold">{tempYear}</span>
                      <button 
                        onClick={() => setTempYear(tempYear + 1)}
                        className="p-2 text-white/30 hover:text-white transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month, idx) => (
                        <button
                          key={month}
                          onClick={() => {
                            setCurrentDate(new Date(tempYear, idx, 1));
                            setIsDatePickerOpen(false);
                          }}
                          className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                            currentDate.getMonth() === idx && currentDate.getFullYear() === tempYear
                              ? 'bg-white text-black'
                              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {month.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={nextMonth} className="text-white/30 hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="h-10 w-10 rounded-xl border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Settings2 size={18} />
              </button>
              <button className="h-10 w-10 rounded-xl border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
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
              {mounted ? (
                <>
                  {/* Empty cells for previous month */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-r border-b border-white/5 p-4 text-white/10 text-[13px] font-bold">
                    </div>
                  ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const dateStr = formatDate(dateObj);
                      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
                      const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                      const events = allEvents.filter(e => e.date === dateStr);

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
                              className={`px-2 py-1.5 rounded-lg border-l-4 text-[10px] font-bold truncate ${event.color ? '' : eventColors[event.type]} ${event.color ? '' : eventBorderColors[event.type]}`}
                              style={event.color ? { backgroundColor: `${event.color}20`, color: event.color, borderLeftColor: event.color } : {}}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-white/5 p-4 animate-pulse">
                    <div className="h-6 w-6 bg-white/5 rounded-full" />
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
