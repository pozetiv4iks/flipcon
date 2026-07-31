"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { Button } from "@/src/components/buttons/Buttons";
import { Input } from "@/src/components/inputs/Input";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";
import { useToast } from "@/src/components/notifications/ToastContext";

const pageClass =
  "flex min-h-[100dvh] w-full items-center justify-center px-5 py-10 text-white";

const cardClass = "mx-auto flex w-full max-w-[360px] flex-col items-center";

const inputClass =
  "h-12 w-full rounded-xl border border-white/15 bg-black/10 px-4 text-[14px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/28 focus:border-white/35 focus:ring-2 focus:ring-white/10";

export default function AcceptPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [showCodeInput, setShowCodeInput] = useState(!!searchParams.get("code"));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleManualCode = async () => {
    // Simulation of success without backend
    setCode("123456");
    setShowCodeInput(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulation of success without backend
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
    router.push('/calendar');
  };

  return (
    <div className={pageClass}>
      <div className={cardClass}>
        <AuthPageLogo />

        <h1 className="text-center text-[2rem] font-bold leading-tight tracking-tight">
          Проверьте почту
        </h1>

        <p className="mt-4 max-w-[320px] text-center text-[13px] leading-[1.35] text-white/55">
          Мы отправили временную ссылку
          <br />
          для входа на почту <span className="font-semibold text-white">{email}</span>
        </p>

        {showCodeInput ? (
          <form className="mt-6 w-full space-y-3" onSubmit={handleSubmit} noValidate>
            {!searchParams.get("email") && (
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputClass}
              />
            )}
            <Input
              name="code"
              type="text"
              placeholder="Введите код...."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              wrapperClassName="w-full"
              inputClassName={inputClass}
            />
            <Input
              name="password"
              type="password"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              wrapperClassName="w-full"
              inputClassName={inputClass}
            />
            <Button type="submit" text="Зарегистрироваться как работник" className="mt-3" />
          </form>
        ) : (
          <button
            type="button"
            onClick={handleManualCode}
            disabled={isGenerating}
            className="mt-6 text-center text-[12px] text-white/55 transition-colors hover:text-white disabled:opacity-50"
          >
            {isGenerating ? "Генерация..." : "Введите код вручную"}
          </button>
        )}

        <Link
          href="/login"
          className="mt-4 text-center text-[12px] text-white/55 transition-colors hover:text-white"
        >
          {t.common.back} к входу
        </Link>
      </div>
    </div>
  );
}
