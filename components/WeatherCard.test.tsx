import { render, screen } from "@testing-library/react";
import { WeatherCard } from "./WeatherCard";
import type { Weather } from "@/lib/types";

const MOCK_WEATHER: Weather = {
  city: "Rio de Janeiro",
  description: "céu limpo",
  temperature: 22.7,
  feelsLike: 23.11,
  humidity: 80,
  windSpeed: 2.04,
  latitude: -22.9028,
  longitude: -43.2075,
  observedAt: "2024-05-24T12:00:00Z",
};

describe("WeatherCard", () => {
  it("renders the city name", () => {
    render(<WeatherCard data={MOCK_WEATHER} />);
    expect(
      screen.getByRole("heading", { name: /rio de janeiro/i }),
    ).toBeInTheDocument();
  });

  it("renders the rounded temperature", () => {
    render(<WeatherCard data={MOCK_WEATHER} />);
    expect(screen.getByText("23°")).toBeInTheDocument();
  });

  it("renders the weather description", () => {
    render(<WeatherCard data={MOCK_WEATHER} />);
    expect(screen.getAllByText(/céu limpo/i).length).toBeGreaterThan(0);
  });

  it("renders feels-like, humidity and wind speed metrics", () => {
    render(<WeatherCard data={MOCK_WEATHER} />);

    expect(screen.getByText("23°C")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("2 km/h")).toBeInTheDocument();
  });

  it("renders the observation date in Portuguese", () => {
    render(<WeatherCard data={MOCK_WEATHER} />);
    expect(screen.getByText(/24 de maio de 2024/i)).toBeInTheDocument();
  });
});
