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
    <article className="flex flex-col gap-8 rounded-3xl bg-surface p-6 shadow-sm sm:p-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {data.city}
          </h2>
          <p className="mt-1 text-sm capitalize text-ink-muted">
            {formattedDate}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          Dados ao vivo
        </span>
      </header>

      <div className="flex items-end gap-4">
        <span className="font-headline text-6xl font-bold leading-none text-primary sm:text-7xl">
          {Math.round(data.temperature)}°
        </span>
        <div className="pb-2">
          <p className="font-headline text-lg font-semibold text-ink">
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
    <div className="rounded-2xl bg-surface-muted px-4 py-3">
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <dt className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </dt>
      </div>
      <dd className="mt-1 font-headline text-lg font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}
