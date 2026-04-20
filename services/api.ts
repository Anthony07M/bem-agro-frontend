import type { ForecastItem, HistoryEntry, Weather } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface WeatherDTO {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  latitude: number;
  longitude: number;
}

interface HistoryDTO {
  city_name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "URL da API não configurada. Defina NEXT_PUBLIC_API_URL.",
      0,
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }

  if (!response.ok) {
    let message = `Falha na requisição (${response.status}).`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore non-json error body
    }
    if (response.status === 404) {
      message = message || "Cidade não encontrada.";
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export async function getWeather(city: string): Promise<Weather> {
  const dto = await request<WeatherDTO>(
    `/api/weather?city=${encodeURIComponent(city)}`,
  );

  return {
    city,
    description: dto.description,
    temperature: dto.temperature,
    feelsLike: dto.feels_like,
    humidity: dto.humidity,
    windSpeed: dto.wind_speed,
    latitude: dto.latitude,
    longitude: dto.longitude,
    observedAt: new Date().toISOString(),
  };
}

interface ForecastItemDTO {
  time: string;
  temperature: number;
  icon: string;
  description: string;
  pop: number;
}

interface ForecastResponseDTO {
  forecast: ForecastItemDTO[];
}

export async function getHourlyForecast(city: string): Promise<ForecastItem[]> {
  const dto = await request<ForecastResponseDTO>(
    `/api/forecast?city=${encodeURIComponent(city)}`,
  );

  return dto.forecast.map((item) => ({
    time: item.time,
    temperature: item.temperature,
    icon: item.icon,
    description: item.description,
    pop: item.pop,
  }));
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const dtos = await request<HistoryDTO[]>("/api/history");

  return dtos.map((dto) => ({
    id: `${dto.city_name}-${dto.created_at}`,
    city: dto.city_name,
    latitude: dto.latitude,
    longitude: dto.longitude,
    consultedAt: dto.created_at,
  }));
}
