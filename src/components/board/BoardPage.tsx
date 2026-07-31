"use client";

import React, { useState } from "react";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { 
  Plus, 
  MoreHorizontal, 
  Sparkles, 
  Clock, 
  User, 
  X, 
  MessageSquare, 
  Paperclip,
  ChevronRight,
  Layout,
  Trash2
} from "lucide-react";

// --- Types ---
interface Card {
  id: string;
  title: string;
  tag?: {
    text: string;
    color: string;
  };
  icon?: React.ReactNode;
  description?: string;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
  count?: number;
}

export const BoardPage = () => {
  const { t } = useLanguage();
  
  const initialCards: Card[] = [
    { 
      id: "1", 
      title: "Допилить флипкон", 
      tag: { text: "Новое", color: "text-green-500 border-green-500/30 bg-green-500/10" },
      icon: <Sparkles size={14} className="text-blue-500" />,
      columnId: "todo",
      description: "Нужно закончить основные страницы приложения и настроить навигацию."
    },
    { 
      id: "2", 
      title: "Мутить бабки", 
      tag: { text: "Срочно", color: "text-red-500 border-red-500/30 bg-red-500/10" },
      icon: <Sparkles size={14} className="text-blue-500" />,
      columnId: "todo",
      description: "Разработать стратегию монетизации и найти первых клиентов."
    },
    { 
      id: "3", 
      title: "блаблабла", 
      tag: { text: "Новое", color: "text-green-500 border-green-500/30 bg-green-500/10" },
      icon: <Sparkles size={14} className="text-blue-500" />,
      columnId: "todo"
    },
  ];

  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: t.board.todo },
    { id: "progress", title: t.board.inProgress },
    { id: "review", title: t.board.review },
    { id: "done", title: t.board.done },
  ]);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const getCardsByColumn = (columnId: string) => {
    return cards.filter(card => card.columnId === columnId);
  };

  const handleAddCard = (columnId: string) => {
    if (!newCardTitle.trim()) return;
    
    const newCard: Card = {
      id: Date.now().toString(),
      title: newCardTitle,
      columnId: columnId,
    };
    
    setCards([...cards, newCard]);
    setNewCardTitle("");
    setAddingToColumn(null);
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    
    const newColumn: Column = {
      id: Date.now().toString(),
      title: newColumnTitle,
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(c => c.id !== columnId));
    setCards(cards.filter(c => c.columnId !== columnId));
  };

  const handleUpdateColumnTitle = (columnId: string, newTitle: string) => {
    setColumns(columns.map(c => c.id === columnId ? { ...c, title: newTitle } : c));
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    setSelectedCard(null);
  };

  const handleUpdateCard = (id: string, updates: Partial<Card>) => {
    setCards(cards.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selectedCard?.id === id) {
      setSelectedCard({ ...selectedCard, ...updates });
    }
  };

  // --- Drag and Drop Handlers ---
  const onDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("cardId", cardId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, columnId: string) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards(cards.map(c => c.id === cardId ? { ...c, columnId } : c));
  };

  return (
    <div className="flex h-screen text-white overflow-hidden">
      <div className="flex flex-1 transition-all duration-300 h-full overflow-x-auto custom-scrollbar">
        <main className="p-8 flex gap-6 min-w-max h-full items-start">
          {columns.map(column => (
            <div 
              key={column.id} 
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column.id)}
              className="w-[320px] flex flex-col max-h-full"
            >
              <div className="relative pt-4 pb-2 px-2 mb-4 group/col">
                <div className="absolute top-0 left-0 right-0 h-px bg-white/20 rounded-full" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input 
                      type="text"
                      value={column.title}
                      onChange={(e) => handleUpdateColumnTitle(column.id, e.target.value)}
                      className="text-[18px] font-bold bg-transparent outline-none border-b border-transparent focus:border-white/10 w-full"
                    />
                  </div>
                  <button 
                    onClick={() => handleDeleteColumn(column.id)}
                    className="opacity-0 group-hover/col:opacity-40 hover:!opacity-100 transition-all p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {addingToColumn === column.id ? (
                <div className="px-2 mb-6">
                  <input 
                    autoFocus
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCard(column.id);
                      if (e.key === 'Escape') setAddingToColumn(null);
                    }}
                    placeholder={t.board.cardTitle}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[14px] outline-none focus:border-white/20 mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAddCard(column.id)}
                      className="bg-white text-black text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-white/90 transition-all"
                    >
                      {t.common.add}
                    </button>
                    <button 
                      onClick={() => setAddingToColumn(null)}
                      className="text-white/40 hover:text-white transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setAddingToColumn(column.id)}
                  className="flex items-center gap-2 text-[14px] text-white/40 hover:text-white transition-all px-2 mb-6 group"
                >
                  <Plus size={16} className="text-white/20 group-hover:text-white transition-all" />
                  <span>{t.board.addCard}</span>
                </button>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {getCardsByColumn(column.id).map(card => (
                  <div 
                    key={card.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, card.id)}
                    onClick={() => setSelectedCard(card)}
                    className="p-4 rounded-2xl bg-[#1A1A1A]/40 border border-white/5 hover:border-white/10 hover:bg-[#1A1A1A]/60 transition-all cursor-pointer group active:scale-[0.98] active:rotate-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {card.icon && (
                          <div className="h-6 w-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            {card.icon}
                          </div>
                        )}
                        <h3 className="text-[15px] font-medium">{card.title}</h3>
                      </div>
                    </div>
                    
                    {card.tag && (
                      <div className={`inline-flex px-3 py-1 rounded-lg border text-[11px] font-bold ${card.tag.color}`}>
                        {card.tag.text}
                      </div>
                    )}
                    
                    <div className="mt-4 h-px w-full bg-white/5" />
                  </div>
                ))}
                
                {getCardsByColumn(column.id).length === 0 && (
                  <div className="p-4 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center h-16">
                    <p className="text-[13px] text-white/10">{t.board.dropHere}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Column Button */}
          <div className="w-[320px] shrink-0">
            {isAddingColumn ? (
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
                <input 
                  autoFocus
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') setIsAddingColumn(false);
                  }}
                  placeholder={t.board.columnTitle}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[14px] outline-none focus:border-white/20 mb-4"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleAddColumn}
                    className="bg-white text-black text-[12px] font-bold px-6 py-2 rounded-xl hover:bg-white/90 transition-all"
                  >
                    {t.board.addColumn}
                  </button>
                  <button 
                    onClick={() => setIsAddingColumn(false)}
                    className="text-white/40 hover:text-white transition-all p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingColumn(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-[32px] border border-dashed border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <Plus size={20} />
                <span className="font-bold">{t.board.addColumn}</span>
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                    <Layout size={20} />
                  </div>
                  <div>
                    <input 
                      type="text"
                      value={selectedCard.title}
                      onChange={(e) => handleUpdateCard(selectedCard.id, { title: e.target.value })}
                      className="text-[24px] font-bold bg-transparent outline-none border-b border-transparent focus:border-white/10 w-full"
                    />
                    <p className="text-[14px] text-white/40">в колонке <span className="text-white/60 underline cursor-pointer">{columns.find(c => c.id === selectedCard.columnId)?.title}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDeleteCard(selectedCard.id)}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title={t.common.delete}
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedCard(null)}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_200px] gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-4">{t.board.description}</h3>
                    <textarea 
                      value={selectedCard.description || ""}
                      onChange={(e) => handleUpdateCard(selectedCard.id, { description: e.target.value })}
                      placeholder="Добавьте более подробное описание..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-[15px] text-white/60 leading-relaxed outline-none focus:border-white/10 min-h-[120px] resize-none"
                    />
                  </div>

                  <div>
                    <h3 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-4">{t.board.activity}</h3>
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <User size={16} className="text-white/40" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-[14px] text-white/40 hover:border-white/10 transition-all cursor-text">
                          {t.board.commentPlaceholder}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-3">{t.board.labels}</h3>
                    {selectedCard.tag ? (
                      <div className={`inline-flex px-3 py-1.5 rounded-lg border text-[12px] font-bold ${selectedCard.tag.color}`}>
                        {selectedCard.tag.text}
                      </div>
                    ) : (
                      <button className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-all">
                        <Plus size={14} />
                        <span>Добавить метку</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-[12px] font-bold text-white/20 uppercase tracking-widest mb-3">{t.board.actions}</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[14px] text-left">
                        <User size={16} className="text-white/40" />
                        <span>{t.board.members}</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[14px] text-left">
                        <Clock size={16} className="text-white/40" />
                        <span>{t.board.dates}</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-[14px] text-left">
                        <Paperclip size={16} className="text-white/40" />
                        <span>{t.board.attachments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
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
