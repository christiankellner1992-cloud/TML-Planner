import { useMemo } from 'react';
import { CalendarDays, LayoutList, Share2, Sparkles, User } from 'lucide-react';
import ActCard from './components/ActCard';
import Filters from './components/Filters';
import FriendsCompare from './components/FriendsCompare';
import MyTimetable from './components/MyTimetable';
import Recommendations from './components/Recommendations';
import { DAY_TABS } from './constants/days';
import { usePlannerState } from './hooks/usePlannerState';

function ActCardWithOverlap({
  act,
  getFriendOverlaps,
  selectedActForRecommendations,
  selectActForRecommendations,
  isInMyTimetable,
  onToggle,
  youtubeCache,
  onYoutubeResult,
}) {
  return (
    <ActCard
      act={act}
      friendOverlap={getFriendOverlaps(act.id)}
      inTimetable={isInMyTimetable(act.id)}
      onToggle={onToggle}
      onSelect={selectActForRecommendations}
      isPreviewSelected={act.id === selectedActForRecommendations}
      youtubeCache={youtubeCache}
      onYoutubeResult={onYoutubeResult}
    />
  );
}

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
    isSearchPending,
    view,
    setView,
    shareNotice,
    friendNotice,
    friendLinkInput,
    setFriendLinkInput,
    userName,
    setUserName,
    myTimetable,
    youtubeCache,
    friendsTimetables,
    activeFriends,
    filteredActs,
    isGlobalSearch,
    actById,
    toggleTimetable,
    isInMyTimetable,
    setYoutubeResult,
    copyShareLink,
    addFriendFromLink,
    toggleFriendActive,
    removeFriend,
    getFriendOverlaps,
    selectedActForRecommendations,
    selectedAct,
    selectActForRecommendations,
    recommendationActs,
  } = usePlannerState();

  const totalSelected =
    myTimetable.friday.length + myTimetable.saturday.length + myTimetable.sunday.length;

  const recommendationsPanel = useMemo(
    () => (
      <Recommendations
        allActs={recommendationActs}
        selectedAct={selectedAct}
        selectActForRecommendations={selectActForRecommendations}
        selectedActForRecommendations={selectedActForRecommendations}
        isInMyTimetable={isInMyTimetable}
        onToggle={toggleTimetable}
        youtubeCache={youtubeCache}
        onYoutubeResult={setYoutubeResult}
        getFriendOverlaps={getFriendOverlaps}
      />
    ),
    [
      recommendationActs,
      selectedAct,
      selectActForRecommendations,
      selectedActForRecommendations,
      isInMyTimetable,
      toggleTimetable,
      youtubeCache,
      setYoutubeResult,
      getFriendOverlaps,
    ]
  );

  const resetFilters = () => {
    setStageFilter('');
    setGenreFilter('');
    setSearch('');
  };

  return (
    <div className="min-h-screen min-h-[100dvh]">
      <header className="border-b border-tml-border bg-gradient-to-r from-tml-dark via-[#1a0f2e] to-tml-dark sticky top-0 z-20 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-4 sm:py-5">
          <div className="space-y-4">
            <div>
              <p className="text-tml-gold text-[11px] sm:text-xs font-medium tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                Tomorrowland 2026 · Week 2
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-tml-purple bg-clip-text text-transparent leading-tight mt-0.5">
                Festival Planner
              </h1>
              <p className="text-white/40 text-xs sm:text-sm mt-1">
                {lineupData.meta.totalActs} Acts · {lineupData.stages.length} Stages
                {activeFriends.length > 0 && (
                  <> · {activeFriends.length} friend(s)</>
                )}
              </p>
            </div>

            <label className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-lg bg-tml-card border border-tml-border text-sm w-full">
              <User className="w-4 h-4 text-white/40 shrink-0" />
              <span className="text-white/50 shrink-0 text-xs sm:text-sm">Name</span>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                maxLength={40}
                className="bg-transparent border-none outline-none flex-1 min-w-0 text-white placeholder:text-white/30"
              />
            </label>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => setView('lineup')}
                className={`flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                  view === 'lineup'
                    ? 'bg-tml-purple text-white'
                    : 'bg-white/10 active:bg-white/20'
                }`}
              >
                <LayoutList className="w-4 h-4 shrink-0" />
                Lineup
              </button>
              <button
                type="button"
                onClick={() => setView('timetable')}
                className={`flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                  view === 'timetable'
                    ? 'bg-tml-gold text-tml-dark'
                    : 'bg-white/10 active:bg-white/20'
                }`}
              >
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span className="truncate">Timetable ({totalSelected})</span>
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium bg-white/10 active:bg-tml-gold/20 border border-tml-gold/30 touch-manipulation"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                Copy share link
              </button>
            </div>
          </div>

          {shareNotice && <p className="mt-3 text-sm text-green-400">{shareNotice}</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-5 sm:py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <FriendsCompare
          friends={friendsTimetables}
          friendLinkInput={friendLinkInput}
          onLinkInputChange={setFriendLinkInput}
          onAddFriend={addFriendFromLink}
          onToggleActive={toggleFriendActive}
          onRemoveFriend={removeFriend}
          notice={friendNotice}
        />

        {view === 'lineup' ? (
          <>
            <nav
              className="-mx-4 sm:mx-0 px-4 sm:px-0 mb-5 sm:mb-6 flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-1"
              aria-label="Festival days"
            >
              {DAY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDay(tab.id)}
                  className={`shrink-0 snap-start px-4 sm:px-5 py-3 min-h-[44px] rounded-full text-sm font-medium transition-all touch-manipulation whitespace-nowrap ${
                    activeDay === tab.id
                      ? 'bg-tml-gold text-tml-dark shadow-lg shadow-tml-gold/20'
                      : 'bg-tml-card border border-tml-border active:border-tml-purple'
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
                isSearchPending={isSearchPending}
                onStageChange={setStageFilter}
                onGenreChange={setGenreFilter}
                onSearchChange={setSearch}
                onReset={resetFilters}
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_minmax(280px,320px)] gap-5 lg:gap-6">
              <section className="min-w-0">
                <div className="text-sm text-white/50 mb-4 space-y-2">
                  <p className="font-medium text-white/70">
                    {isGlobalSearch ? (
                      <>
                        {filteredActs.length} results across all 3 days
                        {stageFilter || genreFilter ? ' (filtered)' : ''}
                        {isSearchPending ? ' …' : ''}
                      </>
                    ) : (
                      <>
                        {filteredActs.length} of{' '}
                        {lineupData.days[activeDay].acts.length} acts
                      </>
                    )}
                  </p>
                  <ul className="text-xs text-white/45 space-y-1 sm:flex sm:flex-wrap sm:gap-x-3 sm:gap-y-1 sm:space-y-0">
                    {activeFriends.length > 0 && (
                      <li className="text-orange-300/90">Orange = friend overlap</li>
                    )}
                    <li className="text-tml-purple/90">Purple border = preview</li>
                    <li>Yellow check = in your timetable</li>
                  </ul>
                </div>

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
                              <ActCardWithOverlap
                                key={act.id}
                                act={act}
                                getFriendOverlaps={getFriendOverlaps}
                                selectedActForRecommendations={selectedActForRecommendations}
                                selectActForRecommendations={selectActForRecommendations}
                                isInMyTimetable={isInMyTimetable}
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
                      <ActCardWithOverlap
                        key={act.id}
                        act={act}
                        getFriendOverlaps={getFriendOverlaps}
                        selectedActForRecommendations={selectedActForRecommendations}
                        selectActForRecommendations={selectActForRecommendations}
                        isInMyTimetable={isInMyTimetable}
                        onToggle={toggleTimetable}
                        youtubeCache={youtubeCache}
                        onYoutubeResult={setYoutubeResult}
                      />
                    ))}
                  </div>
                )}

                {filteredActs.length === 0 && !isSearchPending && (
                  <p className="text-center py-12 text-white/40">
                    {isGlobalSearch
                      ? 'No acts found across all 3 days.'
                      : 'No acts match these filters.'}
                  </p>
                )}
              </section>

              <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                {recommendationsPanel}
              </div>
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-[1fr_minmax(280px,320px)] gap-5 lg:gap-6">
            <MyTimetable
              myTimetable={myTimetable}
              actById={actById}
              isInMyTimetable={isInMyTimetable}
              onSelect={selectActForRecommendations}
              selectedActForRecommendations={selectedActForRecommendations}
              onToggle={toggleTimetable}
              youtubeCache={youtubeCache}
              onYoutubeResult={setYoutubeResult}
              getFriendOverlaps={getFriendOverlaps}
            />
            <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              {recommendationsPanel}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-tml-border mt-10 sm:mt-12 py-5 sm:py-6 px-4 text-center text-xs text-white/30">
        <p className="mb-1">Share format</p>
        <code className="text-white/50 break-all text-[11px] sm:text-xs leading-relaxed block max-w-lg mx-auto">
          ?name=YourName&tracks=id1,id2,…
        </code>
      </footer>
    </div>
  );
}
