import { fireEvent, render, screen, within } from "@testing-library/react";
import { HistoryTable } from "./HistoryTable";
import type { HistoryEntry } from "@/lib/types";

const BASE_HISTORY: HistoryEntry[] = [
  {
    id: "rio-1",
    city: "Rio de Janeiro",
    latitude: -22.9028,
    longitude: -43.2075,
    consultedAt: "2024-05-24T09:00:00Z",
  },
  {
    id: "sp-1",
    city: "São Paulo",
    latitude: -23.5475,
    longitude: -46.6361,
    consultedAt: "2024-05-23T15:30:00Z",
  },
];

describe("HistoryTable", () => {
  it("renders every entry passed via props", () => {
    render(<HistoryTable items={BASE_HISTORY} />);

    expect(screen.getByText("Rio de Janeiro")).toBeInTheDocument();
    expect(screen.getByText("São Paulo")).toBeInTheDocument();
    expect(screen.getByText("-22.9028")).toBeInTheDocument();
    expect(screen.getByText("-46.6361")).toBeInTheDocument();
  });

  it("shows the empty state when there are no items", () => {
    render(<HistoryTable items={[]} />);
    expect(
      screen.getByText(/nenhuma consulta registrada ainda/i),
    ).toBeInTheDocument();
  });

  it("invokes onRowClick with the clicked entry", () => {
    const handleRowClick = jest.fn();

    render(
      <HistoryTable items={BASE_HISTORY} onRowClick={handleRowClick} />,
    );

    const row = screen.getByText("São Paulo").closest("tr");
    expect(row).not.toBeNull();
    fireEvent.click(row as HTMLElement);

    expect(handleRowClick).toHaveBeenCalledTimes(1);
    expect(handleRowClick).toHaveBeenCalledWith(BASE_HISTORY[1]);
  });

  it("paginates when there are more items than pageSize", () => {
    const many: HistoryEntry[] = Array.from({ length: 7 }, (_, i) => ({
      id: `item-${i}`,
      city: `Cidade ${i}`,
      latitude: -20 + i,
      longitude: -40 + i,
      // Earlier indices = newer dates so Cidade 0..4 appear first
      consultedAt: new Date(2024, 4, 24 - i).toISOString(),
    }));

    render(<HistoryTable items={many} pageSize={5} />);

    const table = screen.getByRole("table");
    expect(within(table).getByText("Cidade 0")).toBeInTheDocument();
    expect(within(table).getByText("Cidade 4")).toBeInTheDocument();
    expect(within(table).queryByText("Cidade 5")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /próxima página/i }));

    expect(within(table).getByText("Cidade 5")).toBeInTheDocument();
    expect(within(table).getByText("Cidade 6")).toBeInTheDocument();
    expect(within(table).queryByText("Cidade 0")).not.toBeInTheDocument();
  });
});
