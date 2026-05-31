import { useCallback, useEffect, useMemo, useState } from 'react';
import lineupData from '../data/lineup.json';
import { readShareFromUrl } from '../utils/share';

const STORAGE_KEY = 'tml-planner-w2';

const emptyTimetable = () => ({
  friday: [],
  saturday: [],
  sunday: [],
});

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        timetable: { ...emptyTimetable(), ...parsed.timetable },
        youtubeCache: parsed.youtubeCache || {},
      };
    }
  } catch (_) {}
  return { timetable: emptyTimetable(), youtubeCache: {} };
}

export function usePlannerState() {
  const shared = useMemo(() => readShareFromUrl(), []);
  const [activeDay, setActiveDay] = useState('friday');
  const [stageFilter, setStageFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('lineup');
  const [shareNotice, setShareNotice] = useState('');

  const [state, setState] = useState(() => {
    if (shared) {
      return {
        timetable: shared.timetable,
        youtubeCache: shared.youtubeCache,
        fromShare: true,
      };
    }
    const stored = loadFromStorage();
    return { ...stored, fromShare: false };
  });

  const { timetable, youtubeCache } = state;

  useEffect(() => {
    if (!state.fromShare) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ timetable, youtubeCache })
      );
    }
  }, [timetable, youtubeCache, state.fromShare]);

  const actById = useMemo(() => {
    const map = new Map();
    for (const day of Object.values(lineupData.days)) {
      for (const act of day.acts) map.set(act.id, act);
    }
    return map;
  }, []);

  const allActs = useMemo(
    () => Object.values(lineupData.days).flatMap((d) => d.acts),
    []
  );

  const dayActs = lineupData.days[activeDay]?.acts || [];

  const isGlobalSearch = Boolean(search.trim());

  const filteredActs = useMemo(() => {
    let acts = isGlobalSearch ? allActs : dayActs;
    if (stageFilter) acts = acts.filter((a) => a.stage === stageFilter);
    if (genreFilter) acts = acts.filter((a) => a.genre === genreFilter);
    if (isGlobalSearch) {
      const q = search.toLowerCase().trim();
      acts = acts.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.stage.toLowerCase().includes(q) ||
          a.genre.toLowerCase().includes(q) ||
          a.dayLabel.toLowerCase().includes(q)
      );
    }
    return acts;
  }, [dayActs, allActs, isGlobalSearch, stageFilter, genreFilter, search]);

  const toggleTimetable = useCallback(
    (actId) => {
      const dayKey = actById.get(actId)?.day || activeDay;
      setState((prev) => {
        const dayIds = [...prev.timetable[dayKey]];
        const idx = dayIds.indexOf(actId);
        if (idx >= 0) dayIds.splice(idx, 1);
        else dayIds.push(actId);
        return {
          ...prev,
          timetable: { ...prev.timetable, [dayKey]: dayIds },
        };
      });
    },
    [activeDay, actById]
  );

  const setYoutubeResult = useCallback((actId, result) => {
    setState((prev) => ({
      ...prev,
      youtubeCache: { ...prev.youtubeCache, [actId]: result },
    }));
  }, []);

  const isInTimetable = useCallback(
    (actId) => {
      const dayKey = actById.get(actId)?.day || activeDay;
      return timetable[dayKey]?.includes(actId);
    },
    [timetable, activeDay, actById]
  );

  const copyShareLink = useCallback(async (buildShareUrl) => {
    const url = buildShareUrl(timetable, youtubeCache);
    await navigator.clipboard.writeText(url);
    setShareNotice('Link kopiert!');
    setTimeout(() => setShareNotice(''), 3000);
  }, [timetable, youtubeCache]);

  return {
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
    dayActs,
    allActs,
    actById,
    toggleTimetable,
    isInTimetable,
    setYoutubeResult,
    copyShareLink,
    fromShare: state.fromShare,
  };
}
