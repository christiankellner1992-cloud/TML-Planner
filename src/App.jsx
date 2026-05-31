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
                {lineupData.meta.totalActs} Acts · {lineupData.stages.length} Stages
                {activeFriends.length > 0 && (
                  <> · {activeFriends.length} friend(s) in comparison</>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-tml-card border border-tml-border text-sm">
                <User className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-white/50 shrink-0">Your name</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex"
                  maxLength={40}
                  className="bg-transparent border-none outline-none min-w-[100px] text-white placeholder:text-white/30"
                />
              </label>

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
                Lineup
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
                My timetable ({totalSelected})
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-tml-gold/20 border border-tml-gold/30"
              >
                <Share2 className="w-4 h-4" />
                Copy share link
              </button>
            </div>
          </div>

          {shareNotice && <p className="mt-2 text-sm text-green-400">{shareNotice}</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
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
                isSearchPending={isSearchPending}
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
                      {filteredActs.length} results across all 3 days
                      {stageFilter || genreFilter ? ' (filtered)' : ''}
                      {isSearchPending ? ' …' : ''}
                    </>
                  ) : (
                    <>
                      {filteredActs.length} of{' '}
                      {lineupData.days[activeDay].acts.length} Acts
                    </>
                  )}
                  {activeFriends.length > 0 && (
                    <span className="text-orange-300/80">
                      {' '}
                      · Orange = overlap with friends
                    </span>
                  )}
                  <span className="text-tml-purple/80">
                    {' '}
                    · Purple border = preview · Yellow check = in timetable
                  </span>
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

              {recommendationsPanel}
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
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
            {recommendationsPanel}
          </div>
        )}
      </main>

      <footer className="border-t border-tml-border mt-12 py-6 text-center text-xs text-white/30">
        Share format: <code className="text-white/50">?name=YourName&tracks=id1,id2,…</code>
      </footer>
    </div>
  );
}
