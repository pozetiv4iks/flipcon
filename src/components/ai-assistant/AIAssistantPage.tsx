"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/src/i18n/LanguageContext";
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
  X,
  Layout,
  BarChart3,
  Sparkles,
  User
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
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([
    { id: "1", title: "Анализ рынка недвижимости", lastMessage: "Какие тренды в 2024?", date: t.common.today },
    { id: "2", title: "План маркетинга Flipcon", lastMessage: "Стратегия продвижения...", date: t.common.today },
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

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsChatStarted(true);
    setIsTyping(true);

    // Mock assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Конечно, я помогу распределить задачи между участниками. Как только вы напишете свои данные, я сразу предложу удобное распределение.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const startNewChat = () => {
    setMessages([]);
    setIsChatStarted(false);
    setInputValue("");
    setIsTyping(false);
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
              <h2 className="text-[14px] font-semibold">{t.aiAssistant.title}</h2>
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
          <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
            {!isChatStarted ? (
              /* Initial Screen */
              <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full">
                <div className="mb-12 text-center animate-in">
                  <div className="h-16 w-16 bg-blue-500/10 rounded-[24px] flex items-center justify-center text-blue-400 mx-auto mb-6 shadow-2xl shadow-blue-500/20">
                    <Bot size={32} />
                  </div>
                  <h1 className="text-[32px] font-bold mb-3 tracking-tight">{t.aiAssistant.welcome}</h1>
                  <p className="text-[16px] text-white/40">{t.aiAssistant.subtitle}</p>
                </div>

                <div className="w-full relative mb-12 animate-in" style={{ animationDelay: '150ms' }}>
                  <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full -z-10"></div>
                  <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[28px] p-2 shadow-2xl transition-all hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/[0.05]">
                    <textarea 
                      placeholder={t.aiAssistant.inputPlaceholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="w-full bg-transparent text-[16px] outline-none resize-none px-4 pt-4 pb-2 min-h-[100px] max-h-[300px] placeholder:text-white/20"
                    />
                    <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <PlusCircle size={20} />
                        </button>
                        <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <FileText size={20} />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${inputValue.trim() ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                      >
                        <ArrowUp size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in" style={{ animationDelay: '300ms' }}>
                  {[
                    { text: t.aiAssistant.prompts[0], icon: <Layout size={14} /> },
                    { text: t.aiAssistant.prompts[1], icon: <BarChart3 size={14} /> },
                    { text: t.aiAssistant.prompts[2], icon: <Search size={14} /> },
                    { text: t.aiAssistant.prompts[3], icon: <Sparkles size={14} /> }
                  ].map((item) => (
                    <button 
                      key={item.text}
                      onClick={() => handleSendMessage(item.text)}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group flex items-center gap-3"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white transition-all">
                        {item.icon}
                      </div>
                      <span className="text-[14px] text-white/60 group-hover:text-white transition-all">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Chat */
              <div className="flex flex-col flex-1 relative">
                <div className="flex-1 p-6 space-y-10 max-w-4xl mx-auto w-full pb-40">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex group ${msg.role === 'user' ? 'justify-end' : 'justify-start'} slide-in-bottom`}
                    >
                      <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${msg.role === 'assistant' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/10 text-white/60'}`}>
                          {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                        </div>
                        <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`p-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user' 
                              ? 'bg-white/5 border border-white/10 text-white' 
                              : 'text-white/90'
                          }`}>
                            {msg.content}
                          </div>
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-1">
                              <button className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Копировать"><Copy size={14} /></button>
                              <button className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Перегенерировать"><RotateCcw size={14} /></button>
                              <button className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Полезно"><ThumbsUp size={14} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-4 max-w-[85%] animate-in fade-in duration-300">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                        <Bot size={18} />
                      </div>
                      <div className="flex items-center gap-1 p-4">
                        <div className="h-1.5 w-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-1.5 w-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-1.5 w-1.5 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Bottom Input Area for Active Chat */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent z-10">
                  <div className="max-w-3xl mx-auto relative">
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[24px] p-2 shadow-2xl flex flex-col transition-all focus-within:border-white/20 focus-within:bg-white/[0.05]">
                      <textarea 
                        placeholder="Написать сообщение..." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="w-full bg-transparent text-[15px] outline-none resize-none py-3 px-4 max-h-[200px] placeholder:text-white/20"
                        rows={1}
                      />
                      <div className="flex items-center justify-between px-2 pb-1">
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <PlusCircle size={18} />
                          </button>
                          <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <FileText size={18} />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleSendMessage()}
                          disabled={!inputValue.trim()}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${inputValue.trim() ? 'bg-white text-black' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                          <ArrowUp size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-center text-white/20 mt-3">{t.aiAssistant.disclaimer}</p>
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
              <h2 className="text-[16px] font-bold">{t.aiAssistant.history}</h2>
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
              <span className="text-[14px] font-medium">{t.aiAssistant.newChat}</span>
              <Plus size={18} className="text-white/60 group-hover:text-white" />
            </button>

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder={t.aiAssistant.searchHistory}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-6">
                {[t.common.today, t.common.yesterday, "Прошлые 7 дней"].map((period) => (
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .slide-in-bottom {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
