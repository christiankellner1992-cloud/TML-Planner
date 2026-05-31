import { Filter, Search, X } from 'lucide-react';

const fieldClass =
  'w-full px-3 py-3 sm:py-2 rounded-lg bg-tml-card border border-tml-border text-base sm:text-sm focus:outline-none focus:border-tml-purple touch-manipulation';

export default function Filters({
  stages,
  genres,
  stageFilter,
  genreFilter,
  search,
  isSearchPending = false,
  onStageChange,
  onGenreChange,
  onSearchChange,
  onReset,
}) {
  const hasFilters = stageFilter || genreFilter || search;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end p-4 rounded-xl bg-tml-card/50 border border-tml-border">
      <div className="flex items-center gap-2 text-white/60 sm:mr-1">
        <Filter className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium">Filter</span>
      </div>

      <div className="w-full sm:flex-1 sm:min-w-[200px]">
        <label className="block text-xs text-white/50 mb-1.5">
          Search {isSearchPending && <span className="text-tml-purple/70">(filtering…)</span>}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="DJ, stage, genre…"
            autoComplete="off"
            enterKeyHint="search"
            className={`${fieldClass} pl-9 pr-3`}
          />
        </div>
      </div>

      <div className="w-full sm:w-auto sm:min-w-[160px] sm:flex-1">
        <label className="block text-xs text-white/50 mb-1.5">Stage</label>
        <select
          value={stageFilter}
          onChange={(e) => onStageChange(e.target.value)}
          className={fieldClass}
        >
          <option value="">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-auto sm:min-w-[180px] sm:max-w-[280px] sm:flex-1">
        <label className="block text-xs text-white/50 mb-1.5">Genre</label>
        <select
          value={genreFilter}
          onChange={(e) => onGenreChange(e.target.value)}
          className={fieldClass}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 min-h-[44px] text-sm text-white/70 active:text-white border border-tml-border sm:border-transparent rounded-lg sm:rounded-none touch-manipulation"
        >
          <X className="w-4 h-4" />
          Reset filters
        </button>
      )}
    </div>
  );
}
