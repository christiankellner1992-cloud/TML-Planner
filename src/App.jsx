import { useCallback } from 'react';
import { CalendarDays, LayoutList, Share2, Sparkles } from 'lucide-react';
import ActCard from './components/ActCard';
import Filters from './components/Filters';
import MyTimetable from './components/MyTimetable';
import Recommendations from './components/Recommendations';
import { usePlannerState } from './hooks/usePlannerState';
import { buildShareUrl } from './utils/share';

const DAY_TABS = [
  { id: 'friday', label: 'Freitag, 24. Juli' },
  { id: 'saturday', label: 'Samstag, 25. Juli' },
  { id: 'sunday', label: 'Sonntag, 26. Juli' },
];

export default function App() {
  const {
    lineupData,
    activeDay,
    setActiveDay,
    stageFilter,
    setStageFilter,
    genreFilter,
    setGenreFilter,
    search,
    setSearch,
    view,
    setView,
    shareNotice,
    timetable,
    youtubeCache,
    filteredActs,
    isGlobalSearch,
    actById,
    toggleTimetable,
    isInTimetable,
    setYoutubeResult,
    copyShareLink,
    fromShare,
  } = usePlannerState();

  const handleShare = useCallback(() => {
    copyShareLink(buildShareUrl);
  }, [copyShareLink]);

  const selectedIds = timetable[activeDay] || [];
  const totalSelected =
    timetable.friday.length + timetable.saturday.length + timetable.sunday.length;

  const resetFilters = () => {
    setStageFilter('');
    setGenreFilter('');
    setSearch('');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-tml-border bg-gradient-to-r from-tml-dark via-[#1a0f2e] to-tml-dark sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-tml-gold text-xs font-medium tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Tomorrowland 2026 · Week 2
              </p>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-tml-purple bg-clip-text text-transparent">
                Festival Planner
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {lineupData.meta.totalActs} Acts · {lineupData.stages.length} Stages · Live-Daten
                vom {new Date(lineupData.meta.scrapedAt).toLocaleDateString('de-DE')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setView('lineup')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'lineup'
                    ? 'bg-tml-purple text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                Line-Up
              </button>
              <button
                type="button"
                onClick={() => setView('timetable')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'timetable'
                    ? 'bg-tml-gold text-tml-dark'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Mein Timetable ({totalSelected})
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-tml-gold/20 border border-tml-gold/30"
              >
                <Share2 className="w-4 h-4" />
                Link teilen
              </button>
            </div>
          </div>

          {fromShare && (
            <p className="mt-3 text-sm text-tml-gold bg-tml-gold/10 rounded-lg px-3 py-2 inline-flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Geteilter Plan geladen — Timetable & YouTube-Links inklusive
            </p>
          )}
          {shareNotice && <p className="mt-2 text-sm text-green-400">{shareNotice}</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'lineup' ? (
          <>
            <nav className="flex flex-wrap gap-2 mb-6">
              {DAY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDay(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeDay === tab.id
                      ? 'bg-tml-gold text-tml-dark shadow-lg shadow-tml-gold/20'
                      : 'bg-tml-card border border-tml-border hover:border-tml-purple'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mb-6">
              <Filters
                stages={lineupData.stages}
                genres={lineupData.genres}
                stageFilter={stageFilter}
                genreFilter={genreFilter}
                search={search}
                onStageChange={setStageFilter}
                onGenreChange={setGenreFilter}
                onSearchChange={setSearch}
                onReset={resetFilters}
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <section>
                <p className="text-sm text-white/50 mb-4">
                  {isGlobalSearch ? (
                    <>
                      {filteredActs.length} Treffer über alle 3 Tage
                      {stageFilter || genreFilter ? ' (gefiltert)' : ''}
                    </>
                  ) : (
                    <>
                      {filteredActs.length} von{' '}
                      {lineupData.days[activeDay].acts.length} Acts
                    </>
                  )}
                </p>

                {isGlobalSearch ? (
                  <div className="space-y-8">
                    {DAY_TABS.map((tab) => {
                      const dayResults = filteredActs.filter((a) => a.day === tab.id);
                      if (!dayResults.length) return null;
                      return (
                        <div key={tab.id}>
                          <h2 className="text-lg font-semibold text-tml-gold mb-3 border-b border-tml-border pb-2">
                            {tab.label}
                            <span className="ml-2 text-sm font-normal text-white/40">
                              ({dayResults.length})
                            </span>
                          </h2>
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {dayResults.map((act) => (
                              <ActCard
                                key={act.id}
                                act={act}
                                inTimetable={isInTimetable(act.id)}
                                onToggle={toggleTimetable}
                                youtubeCache={youtubeCache}
                                onYoutubeResult={setYoutubeResult}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredActs.map((act) => (
                      <ActCard
                        key={act.id}
                        act={act}
                        inTimetable={isInTimetable(act.id)}
                        onToggle={toggleTimetable}
                        youtubeCache={youtubeCache}
                        onYoutubeResult={setYoutubeResult}
                      />
                    ))}
                  </div>
                )}

                {filteredActs.length === 0 && (
                  <p className="text-center py-12 text-white/40">
                    {isGlobalSearch
                      ? 'Keine Acts an allen 3 Tagen gefunden.'
                      : 'Keine Acts für diese Filter gefunden.'}
                  </p>
                )}
              </section>

              <Recommendations
                allActs={lineupData.days[activeDay].acts}
                selectedIds={selectedIds}
                isInTimetable={isInTimetable}
                onToggle={toggleTimetable}
                youtubeCache={youtubeCache}
                onYoutubeResult={setYoutubeResult}
              />
            </div>
          </>
        ) : (
          <MyTimetable
            lineupData={lineupData}
            timetable={timetable}
            actById={actById}
            isInTimetable={() => true}
            onToggle={(id) => {
              const act = actById.get(id);
              if (act) {
                setActiveDay(act.day);
                toggleTimetable(id);
              }
            }}
            youtubeCache={youtubeCache}
            onYoutubeResult={setYoutubeResult}
          />
        )}
      </main>

      <footer className="border-t border-tml-border mt-12 py-6 text-center text-xs text-white/30">
        Daten von{' '}
        <a
          href={lineupData.meta.source}
          className="text-tml-purple hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          tomorrowland.com
        </a>
        {' · '}
        <code className="text-white/50">npm run scrape</code>
        {' · '}
        YouTube via <code className="text-white/50">.env.local</code>
      </footer>
    </div>
  );
}
