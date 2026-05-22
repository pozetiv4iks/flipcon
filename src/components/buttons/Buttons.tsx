import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "default" | "transparent";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  logo?: ReactNode;
  variant?: ButtonVariant;
};

function joinClasses(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const baseClassName =
  "flex h-12 w-full items-center justify-center gap-3 rounded-xl text-[15px] font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variantClassName: Record<ButtonVariant, string> = {
  default:
    "bg-white text-black hover:brightness-105 active:scale-[0.99]",
  transparent:
    "border border-white/40 bg-transparent text-white hover:border-white/60 hover:bg-white/5 active:scale-[0.99]",
};

export function Button({
  text,
  logo,
  variant = "default",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClasses(
        baseClassName,
        variantClassName[variant],
        className
      )}
      {...props}
    >
      {logo ? <span className="flex h-5 w-5 shrink-0 items-center justify-center">{logo}</span> : null}
      <span>{text}</span>
    </button>
  );
}
