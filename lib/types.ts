export interface Weather {
  city: string;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  latitude: number;
  longitude: number;
  observedAt: string;
}

export interface HistoryEntry {
  id: string | number;
  city: string;
  latitude: number;
  longitude: number;
  consultedAt: string;
}
