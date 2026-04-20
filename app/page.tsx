"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, CloudSun } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { WeatherCard } from "@/components/WeatherCard";
import { HourlyForecastCard } from "@/components/HourlyForecastCard";
import { HistoryTable } from "@/components/HistoryTable";
import {
  ApiError,
  getHistory,
  getHourlyForecast,
  getWeather,
} from "@/services/api";
import type { ForecastItem, HistoryEntry, Weather } from "@/lib/types";

const MapViewer = dynamic(
  () => import("@/components/MapViewer").then((m) => m.MapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-80 items-center justify-center rounded-3xl bg-surface shadow-sm">
        <p className="text-sm text-ink-muted">Carregando mapa...</p>
      </div>
    ),
  },
);

export default function Home() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = useCallback(async () => {
    try {
      const items = await getHistory();
      setHistory(items);
    } catch {
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const runSearch = useCallback(
    async (city: string) => {
      const trimmed = city.trim();
      if (!trimmed) return;

      setLoading(true);
      setError(null);
      try {
        debugger
        const [weatherResult, forecastResult] = await Promise.all([
          getWeather(trimmed),
          getHourlyForecast(trimmed).catch(() => [] as ForecastItem[]),
        ]);
        debugger
        setWeather(weatherResult);
        setForecast(forecastResult);
        debugger
        await refreshHistory();
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Ocorreu um erro inesperado ao consultar a previsão.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [refreshHistory],
  );

  function handleRowClick(entry: HistoryEntry) {
    setQuery(entry.city);
    runSearch(entry.city);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8 sm:py-12 xl:px-12">
      <SearchInput
        value={query}
        onChange={setQuery}
        onSubmit={runSearch}
        loading={loading}
      />

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-tertiary/30 bg-tertiary-soft px-4 py-3 text-sm text-ink"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          {weather ? (
            <WeatherCard data={weather} />
          ) : (
            <EmptyWeather loading={loading} />
          )}
          {forecast.length > 0 ? <HourlyForecastCard items={forecast} /> : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 min-h-96">
            <MapViewer
              latitude={weather?.latitude ?? null}
              longitude={weather?.longitude ?? null}
              label={weather?.city}
            />
          </div>
          <HistoryTable items={history} onRowClick={handleRowClick} />
        </div>
      </div>
    </main>
  );
}

function EmptyWeather({ loading }: { loading: boolean }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-3xl bg-surface p-8 shadow-sm">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary-soft text-primary">
        <CloudSun className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="font-headline text-xl font-bold text-ink">
        {loading ? "Consultando previsão..." : "Consulte uma cidade"}
      </h2>
      <p className="text-sm text-ink-muted">
        {loading
          ? "Aguarde enquanto buscamos os dados."
          : "Digite o nome de uma cidade acima para ver a previsão atual e o ponto no mapa."}
      </p>
    </div>
  );
}
