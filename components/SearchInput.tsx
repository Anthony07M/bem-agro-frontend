"use client";

import { FormEvent } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = "Buscar cidade",
}: SearchInputProps) {
  const trimmed = value.trim();
  const disabled = loading || trimmed.length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    onSubmit(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-2 py-2 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
    >
      <label className="flex flex-1 items-center gap-3 px-3">
        <MapPin className="h-5 w-5 shrink-0 text-ink" aria-hidden="true" />
        <span className="sr-only">Cidade</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="h-10 w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <button
        type="submit"
        disabled={disabled}
        aria-label="Consultar previsão"
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4" aria-hidden="true" />
        )}
        <span>Consultar</span>
      </button>
    </form>
  );
}
