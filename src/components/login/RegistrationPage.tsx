"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { GoogleIcon } from "@/src/components/assets/GoogleIcon";
import { Button } from "@/src/components/buttons/Buttons";
import { Input } from "@/src/components/inputs/Input";
import { AuthPageLogo } from "@/src/components/login/AuthPageLogo";

const pageBgClass =
  "flex min-h-[100dvh] w-full flex-col text-white";

const inputBaseClass =
  "w-full rounded-xl border border-white/25 bg-transparent px-4 py-3.5 text-[15px] text-white outline-none transition-[border-color,box-shadow] placeholder:text-white/35 focus:border-white/55 focus:ring-2 focus:ring-white/15";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showEmailFields, setShowEmailFields] = useState(false);
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
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password, passwordAgain });
    
  };

  return (
    <div className={pageBgClass}>
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:py-12">
        <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
          <AuthPageLogo />
          <h1 className="relative mb-10 text-center text-2xl font-bold leading-snug tracking-tight sm:text-[1.65rem]">
            <span className="relative inline-block pb-2 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full ">
              Начните работу с командой
            </span>
          </h1>

          <div className="flex w-full flex-col gap-3">
            <Button
              text="Продолжить с Google"
              logo={<GoogleIcon className="h-5 w-5" />}
            />

            <Button
              text="Продолжить с Email"
              variant="transparent"
              onClick={handleEmailMethodClick}
              logo={<Mail className="h-5 w-5 opacity-90" aria-hidden />}
            />
          </div>

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
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputBaseClass}
              />
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputBaseClass}
              />
              <Input
                name="passwordAgain"
                type="password"
                autoComplete="new-password"
                placeholder="Повторите пароль"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                wrapperClassName="w-full"
                inputClassName={inputBaseClass}
              />

              <Button type="submit" text="Зарегистрироваться" className="mt-2" />
            </form>
          ) : null}

          <p className="mt-10 text-center text-sm text-white/80">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
            >
              Войти →
            </Link>
          </p>

          <p className="mt-10 max-w-[360px] text-center text-[11px] leading-relaxed text-white/35">
            Продолжая, вы соглашаетесь с{" "}
            <a
              className="underline underline-offset-2 hover:text-white/55"
              href="#"
            >
              условиями
            </a>{" "}
            и{" "}
            <a
              className="underline underline-offset-2 hover:text-white/55"
              href="#"
            >
              политикой конфиденциальности
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
