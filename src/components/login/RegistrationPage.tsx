"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useLanguage } from "@/src/i18n/LanguageContext";
import { GoogleIcon } from "@/src/components/assets/GoogleIcon";
import { Button } from "@/src/components/buttons/Buttons";
import { Input } from "@/src/components/inputs/Input";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";
import { CodeInput } from "@/src/components/inputs/CodeInput";
import { LoadingScreen } from "@/src/components/loading/LoadingScreen";
import { useToast } from "@/src/components/notifications/ToastContext";

const pageBgClass =
  "flex min-h-[100dvh] w-full flex-col text-white";

const inputBaseClass =
  "w-full rounded-xl border border-white/25 bg-transparent px-4 py-3.5 text-[15px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/35 focus:border-white/55 focus:ring-2 focus:ring-white/15";

export default function RegistrationPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showEmailFields, setShowEmailFields] = useState(false);
  const [isEmployeeFlow, setIsEmployeeFlow] = useState(false);
  const [codeStatus, setCodeStatus] = useState<"idle" | "error" | "success">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showEmailFields) return;
    const id = window.setTimeout(() => emailInputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [showEmailFields]);

  const handleEmailMethodClick = () => {
    if (showEmailFields) {
      emailInputRef.current?.focus();
      return;
    }
    setShowEmailFields(true);
    setIsEmployeeFlow(false);
  };

  const handleEmployeeClick = () => {
    setIsEmployeeFlow(true);
    setShowEmailFields(false);
  };

  const handleCodeComplete = async (code: string) => {
    setManualCode(code);
    // In a real app, you might validate the code here
    // For this demo, let's assume any 6-digit code starting with '1' is correct
    if (code.length === 6) {
      // Simulate validation
      if (code === "123456" || code.startsWith("T")) {
        setCodeStatus("success");
        setTimeout(() => {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            // Redirect or show next step
            window.location.href = `/accept?code=${code}`;
          }, 2000);
        }, 500);
      } else {
        setCodeStatus("error");
        setTimeout(() => setCodeStatus("idle"), 2000);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordAgain) {
      showToast("Passwords do not match", "error");
      return;
    }
    // Simulation of success without backend
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
      window.location.href = '/create-workspace';
    }, 1000);
  };

  return (
    <div className={pageBgClass}>
      {isLoading && <LoadingScreen text="Проверка кода..." showLogo />}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:py-12">
        <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
          <AuthPageLogo />
          <h1 className="relative mb-10 text-center text-2xl font-bold leading-snug tracking-tight sm:text-[1.65rem]">
            <span className="relative inline-block pb-2 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full ">
              {isEmployeeFlow ? "Вход для сотрудников" : t.auth.register}
            </span>
          </h1>

          <div className="flex w-full flex-col gap-3">
            {!isEmployeeFlow && !showEmailFields && (
              <>
                <Button
                  text={t.auth.google}
                  logo={<GoogleIcon className="h-5 w-5" />}
                />

                <Button
                  text={t.auth.emailContinue}
                  variant="transparent"
                  onClick={handleEmailMethodClick}
                  logo={<Mail className="h-5 w-5 opacity-90" aria-hidden />}
                />

                <Button
                  text="Зарегистрироваться как сотрудник"
                  variant="transparent"
                  onClick={handleEmployeeClick}
                  className="border-white/10 hover:bg-white/5"
                />
              </>
            )}
          </div>

          {isEmployeeFlow && (
            <div className="my-8 w-full space-y-6">
              <p className="text-center text-sm text-white/60">
                Введите 6-значный код приглашения
              </p>
              <CodeInput onComplete={handleCodeComplete} status={codeStatus} />
              <button
                onClick={() => setIsEmployeeFlow(false)}
                className="w-full text-center text-xs text-white/40 hover:text-white transition-colors"
              >
                Назад к выбору метода
              </button>
            </div>
          )}

          {showEmailFields ? (
            <form
              className="my-8 w-full space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <Input
                ref={emailInputRef}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t.auth.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputBaseClass}
              />
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={t.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputBaseClass}
              />
              <Input
                name="passwordAgain"
                type="password"
                autoComplete="new-password"
                placeholder={t.auth.passwordAgain}
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputBaseClass}
              />

              <Button type="submit" text={t.auth.register} className="mt-2" />
            </form>
          ) : null}

          <p className="mt-10 text-center text-sm text-white/80">
            {t.auth.haveAccount}{" "}
            <Link
              href="/login"
              className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
            >
              {t.auth.login} →
            </Link>
          </p>

          <p className="mt-10 max-w-[360px] text-center text-[11px] leading-relaxed text-white/35">
            {t.auth.agreement}{" "}
            <a
              className="underline underline-offset-2 hover:text-white/55"
              href="#"
            >
              {t.auth.terms}
            </a>{" "}
            и{" "}
            <a
              className="underline underline-offset-2 hover:text-white/55"
              href="#"
            >
              {t.auth.privacy}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
