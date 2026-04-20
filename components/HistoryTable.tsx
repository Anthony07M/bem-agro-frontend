"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { HistoryEntry } from "@/lib/types";

interface HistoryTableProps {
  items: HistoryEntry[];
  onRowClick?: (entry: HistoryEntry) => void;
  emptyMessage?: string;
  pageSize?: number;
}

export function HistoryTable({
  items,
  onRowClick,
  emptyMessage = "Nenhuma consulta registrada ainda.",
  pageSize = 5,
}: HistoryTableProps) {
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.consultedAt).getTime() - new Date(a.consultedAt).getTime(),
      ),
    [items],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const showPagination = sorted.length > pageSize;

  return (
    <section className="rounded-3xl bg-surface p-6 shadow-sm sm:p-8">
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-headline text-lg font-bold text-ink">
          Histórico de consultas
        </h2>
        {sorted.length > 0 ? (
          <span className="text-xs text-ink-muted">
            {sorted.length} {sorted.length === 1 ? "registro" : "registros"}
          </span>
        ) : null}
      </header>

      {sorted.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">{emptyMessage}</p>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                <tr>
                  <th scope="col" className="py-3 pr-4 font-semibold">Cidade</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Latitude</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Longitude</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Data / Hora</th>
                  <th scope="col" className="py-3 pr-2 font-semibold">
                    <span className="sr-only">Ação</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((entry) => {
                  const clickable = Boolean(onRowClick);
                  return (
                    <tr
                      key={entry.id}
                      onClick={clickable ? () => onRowClick?.(entry) : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      role={clickable ? "button" : undefined}
                      onKeyDown={
                        clickable
                          ? (event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onRowClick?.(entry);
                              }
                            }
                          : undefined
                      }
                      className={
                        clickable
                          ? "cursor-pointer transition-colors hover:bg-surface-muted focus:bg-surface-muted focus:outline-none"
                          : undefined
                      }
                    >
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-soft text-primary">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="font-medium text-ink">{entry.city}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 tabular-nums text-ink-muted">
                        {entry.latitude.toFixed(4)}
                      </td>
                      <td className="py-3 pr-4 tabular-nums text-ink-muted">
                        {entry.longitude.toFixed(4)}
                      </td>
                      <td className="py-3 pr-4 text-ink-muted">
                        {format(new Date(entry.consultedAt), "dd MMM, HH:mm", {
                          locale: ptBR,
                        })}
                      </td>
                      <td className="py-3 pr-2 text-ink-muted">
                        {clickable ? (
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showPagination ? (
            <nav
              aria-label="Paginação do histórico"
              className="mt-4 flex items-center justify-end gap-3 text-sm text-ink-muted"
            >
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}
