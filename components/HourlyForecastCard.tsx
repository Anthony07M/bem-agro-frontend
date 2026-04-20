import { format, parseISO } from "date-fns";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { ForecastItem } from "@/lib/types";

interface HourlyForecastCardProps {
  items: ForecastItem[];
}

export function HourlyForecastCard({ items }: HourlyForecastCardProps) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl bg-surface p-6 shadow-sm">
      <h3 className="mb-4 font-headline text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Próximas 24 horas
      </h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item) => {
          const Icon = pickIcon(item.icon);
          const parsedTime = parseTime(item.time);
          const hour = parsedTime ? format(parsedTime, "HH:mm") : item.time;

          return (
            <div
              key={item.time}
              className="flex min-w-20 flex-col items-center gap-2 rounded-2xl bg-surface-muted px-4 py-3"
            >
              <span className="text-xs font-semibold text-ink-muted">
                {hour}
              </span>
              <Icon
                className="h-6 w-6 text-primary"
                aria-label={item.description}
              />
              <span className="font-headline text-lg font-semibold text-ink">
                {Math.round(item.temperature)}°
              </span>
              <span className="text-[11px] font-semibold text-[#7bdcb5]">
                {item.pop}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function parseTime(time: string): Date | null {
  const normalized = time.includes("T") ? time : time.replace(" ", "T");
  const date = parseISO(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function pickIcon(iconCode: string): LucideIcon {
  const prefix = iconCode.slice(0, 2);
  const isNight = iconCode.endsWith("n");

  switch (prefix) {
    case "01":
      return isNight ? Moon : Sun;
    case "02":
      return CloudSun;
    case "03":
    case "04":
      return Cloud;
    case "09":
      return CloudDrizzle;
    case "10":
      return CloudRain;
    case "11":
      return CloudLightning;
    case "13":
      return CloudSnow;
    case "50":
      return CloudFog;
    default:
      return Cloud;
  }
}
