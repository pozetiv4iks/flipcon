"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Share2, 
  Search, 
  MoreHorizontal,
  Trash2,
  Edit3,
  ChevronRight,
  ArrowUp,
  FileText,
  PlusCircle,
  Copy,
  RotateCcw,
  ThumbsUp,
  Settings,
  Bot,
  History,
  X
} from "lucide-react";

// --- Types ---
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
}

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([
    { id: "1", title: "Анализ рынка недвижимости", lastMessage: "Какие тренды в 2024?", date: "Сегодня" },
    { id: "2", title: "План маркетинга Flipcon", lastMessage: "Стратегия продвижения...", date: "Вчера" },
    { id: "3", title: "Техническое задание", lastMessage: "Описание API эндпоинтов", date: "23.05.2026" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatStarted) {
      scrollToBottom();
    }
  }, [messages, isChatStarted]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsChatStarted(true);

    // Mock assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Конечно, я помогу распределить задачи между участниками. Как только вы напишете свои данные, я сразу предложу удобное распределение.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantResponse]);
    }, 1000);
  };

  const startNewChat = () => {
    setMessages([]);
    setIsChatStarted(false);
    setInputValue("");
  };

  return (
    <div className="flex h-screen text-white overflow-hidden font-sans">
      <div className="flex flex-1 transition-all duration-300 h-full relative">
        
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Header */}
          <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/10 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <Bot size={20} className="text-blue-400" />
              <h2 className="text-[14px] font-semibold">ИИ-помощник Flipcon</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-white/40 hover:text-white transition-all">
                <Share2 size={18} />
              </button>
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className={`p-2 transition-all ${isHistoryOpen ? 'text-blue-400' : 'text-white/40 hover:text-white'}`}
              >
                <History size={18} />
              </button>
              <button className="p-2 text-white/40 hover:text-white transition-all">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </header>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {!isChatStarted ? (
              /* Initial Screen (Screenshot 1) */
              <div className="h-full flex flex-col items-center justify-center p-6 max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                  <h1 className="text-[32px] font-bold mb-3 tracking-tight">Ваш личный помощник по бизнесу</h1>
                  <p className="text-[16px] text-white/40">Выведем контроль на новый уровень!</p>
                </div>

                <div className="w-full relative mb-4">
                  <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10"></div>
                  <div className="bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <textarea 
                      placeholder="Что бы вы хотели сделать сегодня?" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="w-full bg-transparent text-[16px] outline-none resize-none min-h-[60px] max-h-[200px] placeholder:text-white/20"
                    />
                    <div className="flex items-center justify-end mt-2">
                      <button 
                        onClick={handleSendMessage}
                        className={`p-2 rounded-xl transition-all ${inputValue.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-white/20'}`}
                      >
                        <ArrowUp size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-center gap-6 mb-12 px-2">
                  <button className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white transition-all">
                    <FileText size={14} />
                    <span>Анализ резюме</span>
                  </button>
                  <button className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white transition-all">
                    <PlusCircle size={14} />
                    <span>+ Добавить проект</span>
                  </button>
                </div>

                <div className="w-full space-y-0 border-t border-white/5">
                  {[
                    "Проанализировать доску Flipcon",
                    "Создать отчет по загрузке команды",
                    "Найти свободного исполнителя через ИИ"
                  ].map((prompt) => (
                    <button 
                      key={prompt}
                      onClick={() => {
                        setInputValue(prompt);
                        // Using a small timeout to ensure state update if needed, 
                        // but calling handleSendMessage with the prompt directly is cleaner
                        const newUserMessage: Message = {
                          id: Date.now().toString(),
                          role: "user",
                          content: prompt,
                          timestamp: new Date(),
                        };
                        setMessages([newUserMessage]);
                        setIsChatStarted(true);
                        setInputValue("");
                        
                        setTimeout(() => {
                          const assistantResponse: Message = {
                            id: (Date.now() + 1).toString(),
                            role: "assistant",
                            content: "Конечно, я помогу распределить задачи между участниками. Как только вы напишете свои данные, я сразу предложу удобное распределение.",
                            timestamp: new Date(),
                          };
                          setMessages((prev) => [...prev, assistantResponse]);
                        }, 1000);
                      }}
                      className="w-full py-5 px-2 border-b border-white/5 hover:bg-white/[0.02] transition-all text-left text-[14px] text-white/80 hover:text-white flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-40 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Chat (Screenshot 2) */
              <div className="flex flex-col min-h-full">
                <div className="flex-1 p-6 space-y-8 max-w-4xl mx-auto w-full pb-32">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/20 rounded-2xl p-4' : 'flex gap-4'}`}>
                        {msg.role === 'assistant' && (
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                            <Bot size={18} />
                          </div>
                        )}
                        <div>
                          <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="text-white/20 hover:text-white transition-all"><Copy size={14} /></button>
                              <button className="text-white/20 hover:text-white transition-all"><RotateCcw size={14} /></button>
                              <button className="text-white/20 hover:text-white transition-all"><ThumbsUp size={14} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Input Area for Active Chat */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent">
                  <div className="max-w-3xl mx-auto relative">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl flex items-end gap-3">
                      <textarea 
                        placeholder="Начать диалог" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 bg-transparent text-[15px] outline-none resize-none py-2 px-2 max-h-[200px] placeholder:text-white/20"
                        rows={1}
                      />
                      <button 
                        onClick={handleSendMessage}
                        className={`p-2 rounded-xl transition-all ${inputValue.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-white/20'}`}
                      >
                        <ArrowUp size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Chat History Sidebar (DeepSeek/Cursor style) - Now as a slide-over */}
        <aside className={`absolute right-0 top-0 h-full w-[320px] flex flex-col border-l border-white/5 bg-[#0D0D0D]/95 backdrop-blur-3xl z-20 transition-all duration-300 transform ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold">История чатов</h2>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <button 
              onClick={() => {
                startNewChat();
                setIsHistoryOpen(false);
              }}
              className="flex items-center justify-between w-full p-3 mb-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
              <span className="text-[14px] font-medium">Новый чат</span>
              <Plus size={18} className="text-white/60 group-hover:text-white" />
            </button>

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Поиск чатов..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-6">
                {["Сегодня", "Вчера", "Прошлые 7 дней"].map((period) => (
                  <div key={period}>
                    <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-widest mb-3 px-2">{period}</h3>
                    <div className="space-y-1">
                      {history
                        .filter(item => item.date === period || (period === "Прошлые 7 дней" && item.date.includes(".")))
                        .map((chat) => (
                        <div 
                          key={chat.id}
                          className="group relative flex flex-col p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-medium truncate pr-6">{chat.title}</span>
                          </div>
                          <span className="text-[11px] text-white/30 truncate">{chat.lastMessage}</span>
                          <button className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 p-1 hover:text-white text-white/30 transition-all">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[12px] font-bold">
                  SD
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[13px] font-medium truncate">Stepan Dyleuski</p>
                  <p className="text-[11px] text-white/30 truncate">Pro Plan</p>
                </div>
                <Settings size={14} className="text-white/30" />
              </div>
            </div>
          </div>
        </aside>
      </div>

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
