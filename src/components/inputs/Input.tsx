"use client";

import {
  forwardRef,
  type CSSProperties,
  type InputHTMLAttributes,
} from "react";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label?: string;
  /** Обертка label + поле */
  wrapperClassName?: string;
  /** Стили подписи */
  labelClassName?: string;
  /** Основные классы для `<input>` */
  inputClassName?: string;
  /** Доп. классы для `<input>` (сливаются с inputClassName) */
  className?: string;
  /** Инлайн-стили именно для `<input>` */
  inputStyle?: CSSProperties;
};

function joinClasses(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    wrapperClassName,
    labelClassName,
    inputClassName,
    className,
    inputStyle,
    id,
    name,
    ...rest
  },
  ref
) {
  const inputId = id ?? (typeof name === "string" ? name : undefined);

  return (
    <div className={wrapperClassName}>
      {label ? (
        <label
          htmlFor={inputId}
          className={joinClasses(
            "mb-2 block text-sm text-white/70",
            labelClassName
          )}
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={joinClasses(inputClassName, className)}
        style={inputStyle}
        {...rest}
      />
    </div>
  );
});
