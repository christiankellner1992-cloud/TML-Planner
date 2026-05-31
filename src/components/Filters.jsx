import { Filter, Search, X } from 'lucide-react';

export default function Filters({
  stages,
  genres,
  stageFilter,
  genreFilter,
  search,
  onStageChange,
  onGenreChange,
  onSearchChange,
  onReset,
}) {
  const hasFilters = stageFilter || genreFilter || search;

  return (
    <div className="flex flex-wrap gap-3 items-end p-4 rounded-xl bg-tml-card/50 border border-tml-border">
      <div className="flex items-center gap-2 text-white/60 w-full sm:w-auto mb-1 sm:mb-0">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-white/50 mb-1">Suche</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="DJ, Stage, Genre – durchsucht alle 3 Tage…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-tml-card border border-tml-border text-sm focus:outline-none focus:border-tml-purple"
          />
        </div>
      </div>
      <div className="min-w-[160px]">
        <label className="block text-xs text-white/50 mb-1">Stage</label>
        <select
          value={stageFilter}
          onChange={(e) => onStageChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-tml-card border border-tml-border text-sm focus:outline-none focus:border-tml-purple"
        >
          <option value="">Alle Stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[160px]">
        <label className="block text-xs text-white/50 mb-1">Genre</label>
        <select
          value={genreFilter}
          onChange={(e) => onGenreChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-tml-card border border-tml-border text-sm focus:outline-none focus:border-tml-purple"
        >
          <option value="">Alle Genres</option>
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
          className="flex items-center gap-1 px-3 py-2 text-sm text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
          Zurücksetzen
        </button>
      )}
    </div>
  );
}
