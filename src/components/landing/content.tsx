import type { ReactNode } from "react";
import { Cpu, MessageCircle, Shield, Timer } from "lucide-react";

export const NAV_LINKS = [
  { href: "#why", label: "Зачем" },
  { href: "#tools", label: "Возможности" },
  { href: "#cta", label: "Старт" },
] as const;

export const HERO_KINETIC_LINES = ["ОДИН СПИСОК", "ВМЕСТО ХАОСА"] as const;

export const STATS = [
  { label: "команд на пилоте", value: 38, suffix: "" },
  { label: "до первого «ага»", value: 4, suffix: " мин" },
  { label: "рутины убрали", value: 72, suffix: "%" },
  { label: "часовых поясов", value: 11, suffix: "" },
] as const;

export const TOOLS: {
  title: string;
  body: string;
  icon: ReactNode;
  slug: string;
}[] = [
  {
    slug: "queue",
    title: "Очередь",
    body: "Входящие из чатов и почты превращаются в задачи без ручного копипаста.",
    icon: <MessageCircle className="h-7 w-7" aria-hidden />,
  },
  {
    slug: "focus",
    title: "Фокус",
    body: "Подсказывает, что сгорит сегодня, а что можно отложить без угрызений.",
    icon: <Cpu className="h-7 w-7" aria-hidden />,
  },
  {
    slug: "tempo",
    title: "Темп",
    body: "Короткие окна фокуса и честные дедлайны — без спама уведомлениями.",
    icon: <Timer className="h-7 w-7" aria-hidden />,
  },
  {
    slug: "privacy",
    title: "Границы",
    body: "Доступ по ролям, шифрование снимков состояния — без «все в одной таблице».",
    icon: <Shield className="h-7 w-7" aria-hidden />,
  },
];

export const WHY_LEAD =
  "Одна лента задач вместо десяти каналов. flipcon держит приоритеты и контекст так, чтобы команда видела суть — без бесконечных статусов и таблиц. Спокойный темп и честные дедлайны.";

export const SPLIT_BAND = {
  headline: "Плавные приоритеты.",
  sub:
    "Характер очереди: мягкие кривые сроков, напоминания без спама и контроль без микроменеджмента.",
} as const;

export const TRUST_ITEMS = [
  {
    title: "Данные не разъезжаются по чатам",
    body: "Снимки состояния шифруются; доступ по ролям.",
  },
  {
    title: "Работает там, где вы есть",
    body: "Синхронизация после оффлайна — без потери контекста.",
  },
] as const;
