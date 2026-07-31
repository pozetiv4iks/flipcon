"use client";

import React, { useState } from "react";
import { LayoutGrid, Activity, BarChart3, Search } from "lucide-react";
import { Button } from "@/src/components/buttons/Buttons";
import { Input } from "@/src/components/inputs/Input";
import { useToast } from "@/src/components/notifications/ToastContext";

export const AiInsightsPage = () => {
  const [repoName, setRepoName] = useState("");
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleConnect = async () => {
    // Simulation of success without backend
    setLoading(true);
    setTimeout(() => {
      showToast("Repository connected successfully!", "success");
      setLoading(false);
    }, 1000);
  };

  const fetchInsights = async () => {
    // Simulation of success without backend
    setLoading(true);
    setTimeout(() => {
      setInsights(`Market Analysis for "${repoName}":
- Текущие тренды: Интеграция ИИ является ключевым фактором успеха в 2026 году.
- Конкуренты: В данном секторе наблюдается рост интереса к автоматизации процессов.
- Рекомендация: Сосредоточьтесь на удобстве интерфейса для выделения среди конкурентов.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <header className="mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-purple-400" />
          AI Аналитика и Ревью
        </h1>
        <p className="text-white/60 mt-2">
          Подключите ваш GitHub проект для автоматического код-ревью и анализа рынка.
        </p>
      </header>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LayoutGrid size={20} />
          Подключить репозиторий
        </h2>
        <div className="flex gap-4">
          <Input
            placeholder="owner/repository"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            wrapperClassName="flex-1"
          />
          <Button
            text="Подключить"
            onClick={handleConnect}
            disabled={loading || !repoName}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Search size={18} className="text-blue-400" />
            Код-ревьюер
          </h3>
          <p className="text-sm text-white/40 mb-4">
            ИИ будет автоматически проверять каждый Pull Request и оставлять комментарии.
          </p>
          <div className="p-3 bg-white/5 rounded-lg border border-dashed border-white/20 text-xs text-white/30 text-center">
            Ожидание Webhook от GitHub...
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <BarChart3 size={18} className="text-green-400" />
            Анализ рынка
          </h3>
          <p className="text-sm text-white/40 mb-4">
            Получите отчет о трендах и конкурентах на основе контекста вашего проекта.
          </p>
          <Button
            text="Получить отчет"
            variant="transparent"
            onClick={fetchInsights}
            disabled={loading || !repoName}
            className="w-full"
          />
        </div>
      </section>

      {insights && (
        <section className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 animate-in">
          <h3 className="text-lg font-medium mb-4">AI Отчет по рынку:</h3>
          <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
            {insights}
          </div>
        </section>
      )}
    </div>
  );
};
