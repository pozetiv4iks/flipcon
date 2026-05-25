"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { Mail, Copy } from "lucide-react";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";
import { Button } from "@/src/components/buttons/Buttons";

export default function OnboardingPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const onboardingSteps = [
    {
      title: t.onboarding.welcome,
      description: "Умная система управления командами. ИИ проанализирует опыт участников и сам распределит задачи для максимальной эффективности.",
      buttonText: "Начать работу",
    },
    {
      title: "Автоматическое планирование",
      description: "Забудьте о ручном создании диаграмм Ганта. Наш ИИ выстроит оптимальный путь реализации проекта за секунды.",
      buttonText: t.common.continue,
    },
    {
      title: "Умное распределение ресурсов",
      description: "Система видит загрузку каждого участника и предлагает идеального исполнителя для каждой подзадачи.",
      buttonText: t.common.continue,
    },
    {
      title: "Анализ рисков в реальном времени",
      description: "Flipcon предсказывает возможные задержки еще до того, как они произойдут, и предлагает пути решения.",
      buttonText: t.common.continue,
    },
    {
      title: "Интеграция со всеми инструментами",
      description: "Синхронизируйте свои задачи с GitHub, Slack, Jira и другими сервисами в один клик.",
      buttonText: t.common.continue,
    },
    {
      title: "Командная синергия",
      description: "Алгоритмы анализируют совместимость участников для создания максимально продуктивных рабочих групп.",
      buttonText: t.common.continue,
    },
    {
      title: "Готовы начать?",
      description: "Присоединяйтесь к тысячам команд, которые уже изменили свой подход к управлению проектами с Flipcon.",
      buttonText: t.common.continue,
    },
    {
      title: t.onboarding.invite,
      description: t.onboarding.inviteDesc,
      buttonText: t.common.continue,
      isInviteStep: true,
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/");
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-[var(--background)] bg-[var(--background-gradient)] bg-fixed bg-no-repeat text-white">
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center px-6 text-center">
        {!step.isInviteStep && (
          <div className="mb-10">
            <AuthPageLogo />
          </div>
        )}

        <h1 className={`${step.isInviteStep ? 'mb-6 text-4xl' : 'mb-4 text-3xl'} font-bold tracking-tight sm:text-4xl`}>
          {step.title}
        </h1>

        <p className={`${step.isInviteStep ? 'mb-10 max-w-[540px]' : 'mb-12 max-w-[480px]'} text-[14px] leading-relaxed text-white/60 sm:text-[15px]`}>
          {step.description}
        </p>

        {step.isInviteStep ? (
          <div className="mb-12 w-full max-w-[540px] rounded-[20px] border border-white/10 bg-white/[0.02] p-8 text-left backdrop-blur-sm">
            <label className="mb-2 block text-[13px] font-medium text-white">
              {t.onboarding.inviteLink}
            </label>
            <p className="mb-4 text-[12px] text-white/50">
              Поделитесь этой ссылкой с другими участниками.
            </p>
            
            <div className="flex items-center gap-2">
              <div className="flex h-11 flex-1 items-center overflow-hidden rounded-xl border border-white/15 bg-white/5 px-4">
                <span className="truncate text-[13px] text-white/40">
                  https://flipcon.app/zholydi/join/1234567a891011b12cde1f...
                </span>
              </div>
              <button className="flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[14px] font-semibold text-black transition-transform active:scale-95">
                <Copy className="h-4 w-4" />
                {t.onboarding.copy}
              </button>
            </div>

            <button className="mt-6 flex items-center gap-2 text-[13px] text-white/70 transition-colors hover:text-white">
              <Mail className="h-4 w-4" />
              {t.onboarding.mailInvite}
            </button>
          </div>
        ) : null}

        <div className="w-full max-w-[240px]">
          {step.isInviteStep ? (
            <button 
              onClick={handleNext}
              className="text-[14px] text-white/50 transition-colors hover:text-white"
            >
              {t.common.continue}
            </button>
          ) : (
            <Button 
              text={step.buttonText} 
              onClick={handleNext}
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 flex items-center gap-2.5">
        {onboardingSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? "bg-white scale-125" 
                : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
