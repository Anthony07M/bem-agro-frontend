import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cloud, Droplet, Thermometer, Wind } from "lucide-react";
import type { Weather } from "@/lib/types";

interface WeatherCardProps {
  data: Weather;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const observed = new Date(data.observedAt);
  const formattedDate = format(observed, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <article className="flex flex-col gap-6 rounded-3xl bg-surface p-5 shadow-sm sm:gap-8 sm:p-8">
      <header className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="font-headline text-xl font-bold tracking-tight text-ink sm:text-3xl">
            {data.city}
          </h2>
          <p className="mt-1 text-xs capitalize text-ink-muted sm:text-sm">
            {formattedDate}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary-soft px-2.5 py-1 text-xs font-semibold text-ink sm:px-3">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="hidden sm:inline">Dados ao vivo</span>
          <span className="sm:hidden">Ao vivo</span>
        </span>
      </header>

      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        <span className="font-headline text-5xl font-bold leading-none text-primary sm:text-7xl">
          {Math.round(data.temperature)}°
        </span>
        <div className="pb-1 sm:pb-2">
          <p className="font-headline text-base font-semibold text-ink sm:text-lg">
            {data.description}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4">
        <Metric
          icon={<Thermometer className="h-4 w-4" aria-hidden="true" />}
          label="Sensação térmica"
          value={`${Math.round(data.feelsLike)}°C`}
        />
        <Metric
          icon={<Droplet className="h-4 w-4" aria-hidden="true" />}
          label="Umidade"
          value={`${Math.round(data.humidity)}%`}
        />
        <Metric
          icon={<Wind className="h-4 w-4" aria-hidden="true" />}
          label="Velocidade do vento"
          value={`${Math.round(data.windSpeed)} km/h`}
        />
        <Metric
          icon={<Cloud className="h-4 w-4" aria-hidden="true" />}
          label="Condição"
          value={data.description}
        />
      </dl>
    </article>
  );
}

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="rounded-2xl bg-surface-muted px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <dt className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </dt>
      </div>
      <dd className="mt-1 font-headline text-base font-semibold text-ink sm:text-lg">
        {value}
      </dd>
    </div>
  );
}
