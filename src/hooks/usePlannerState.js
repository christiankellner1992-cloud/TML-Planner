import { useCallback, useEffect, useMemo, useState } from 'react';
import lineupData from '../data/lineup.json';
import {
  buildShareUrl,
  clearShareParamsFromUrl,
  parseShareParams,
  readShareFromUrl,
} from '../utils/share';
import { emptyTimetable, flattenTimetable } from '../utils/timetable';

const STORAGE_KEY = 'tml-planner-w2';
const USER_NAME_KEY = 'tml-planner-user-name';

function loadUserName() {
  try {
    return localStorage.getItem(USER_NAME_KEY) || '';
  } catch {
    return '';
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        timetable: { ...emptyTimetable(), ...parsed.timetable },
        youtubeCache: parsed.youtubeCache || {},
        friendsTimetables: parsed.friendsTimetables || [],
      };
    }
  } catch (_) {}
  return { timetable: emptyTimetable(), youtubeCache: {}, friendsTimetables: [] };
}

function createFriend(name, tracks) {
  return {
    id: `friend-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || 'Unbekannt',
    tracks: [...new Set(tracks)],
    active: true,
  };
}

export function usePlannerState() {
  const [activeDay, setActiveDay] = useState('friday');
  const [stageFilter, setStageFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('lineup');
  const [shareNotice, setShareNotice] = useState('');
  const [friendNotice, setFriendNotice] = useState('');
  const [friendLinkInput, setFriendLinkInput] = useState('');
  const [userName, setUserName] = useState(loadUserName);

  const [state, setState] = useState(loadFromStorage);

  const { timetable, youtubeCache, friendsTimetables } = state;

  const persist = useCallback((next) => {
    setState((prev) => {
      const merged = typeof next === 'function' ? next(prev) : { ...prev, ...next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timetable: merged.timetable,
        youtubeCache: merged.youtubeCache,
        friendsTimetables: merged.friendsTimetables,
      }));
      return merged;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(USER_NAME_KEY, userName);
  }, [userName]);

  const addFriend = useCallback((name, tracks) => {
    if (!tracks?.length) return false;

    persist((prev) => {
      const normalizedName = name.trim() || 'Unbekannt';
      const existingIdx = prev.friendsTimetables.findIndex(
        (f) => f.name.toLowerCase() === normalizedName.toLowerCase()
      );

      const updated = createFriend(normalizedName, tracks);
      let friends;
      if (existingIdx >= 0) {
        friends = [...prev.friendsTimetables];
        friends[existingIdx] = { ...updated, id: friends[existingIdx].id, active: true };
      } else {
        friends = [...prev.friendsTimetables, updated];
      }

      return { ...prev, friendsTimetables: friends };
    });
    return true;
  }, [persist]);

  useEffect(() => {
    const fromUrl = readShareFromUrl();
    if (fromUrl?.tracks?.length) {
      addFriend(fromUrl.name, fromUrl.tracks);
      setFriendNotice(`${fromUrl.name} wurde zu deinen Freunden hinzugefügt.`);
      clearShareParamsFromUrl();
      setTimeout(() => setFriendNotice(''), 4000);
    }
  }, [addFriend]);

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

  const activeFriends = useMemo(
    () => friendsTimetables.filter((f) => f.active),
    [friendsTimetables]
  );

  const getFriendOverlaps = useCallback(
    (actId) =>
      activeFriends
        .filter((f) => f.tracks.includes(actId))
        .map((f) => f.name),
    [activeFriends]
  );

  const toggleTimetable = useCallback(
    (actId) => {
      const dayKey = actById.get(actId)?.day || activeDay;
      persist((prev) => {
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
    [activeDay, actById, persist]
  );

  const setYoutubeResult = useCallback(
    (actId, result) => {
      persist((prev) => ({
        ...prev,
        youtubeCache: { ...prev.youtubeCache, [actId]: result },
      }));
    },
    [persist]
  );

  const isInTimetable = useCallback(
    (actId) => {
      const dayKey = actById.get(actId)?.day || activeDay;
      return timetable[dayKey]?.includes(actId);
    },
    [timetable, activeDay, actById]
  );

  const copyShareLink = useCallback(async () => {
    const tracks = flattenTimetable(timetable);
    if (!tracks.length) {
      setShareNotice('Timetable ist leer — wähle zuerst Acts aus.');
      setTimeout(() => setShareNotice(''), 3000);
      return;
    }
    const url = buildShareUrl(userName, tracks);
    await navigator.clipboard.writeText(url);
    setShareNotice('Share-Link kopiert!');
    setTimeout(() => setShareNotice(''), 3000);
  }, [timetable, userName]);

  const addFriendFromLink = useCallback(() => {
    const parsed = parseShareParams(friendLinkInput);
    if (!parsed?.tracks?.length) {
      setFriendNotice('Ungültiger Link — erwartet ?name=…&tracks=…');
      setTimeout(() => setFriendNotice(''), 3000);
      return;
    }
    addFriend(parsed.name, parsed.tracks);
    setFriendLinkInput('');
    setFriendNotice(`${parsed.name} hinzugefügt (${parsed.tracks.length} Acts).`);
    setTimeout(() => setFriendNotice(''), 3000);
  }, [friendLinkInput, addFriend]);

  const toggleFriendActive = useCallback(
    (friendId) => {
      persist((prev) => ({
        ...prev,
        friendsTimetables: prev.friendsTimetables.map((f) =>
          f.id === friendId ? { ...f, active: !f.active } : f
        ),
      }));
    },
    [persist]
  );

  const removeFriend = useCallback(
    (friendId) => {
      persist((prev) => ({
        ...prev,
        friendsTimetables: prev.friendsTimetables.filter((f) => f.id !== friendId),
      }));
    },
    [persist]
  );

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
    friendNotice,
    friendLinkInput,
    setFriendLinkInput,
    userName,
    setUserName,
    timetable,
    youtubeCache,
    friendsTimetables,
    activeFriends,
    filteredActs,
    isGlobalSearch,
    dayActs,
    allActs,
    actById,
    toggleTimetable,
    isInTimetable,
    setYoutubeResult,
    copyShareLink,
    addFriendFromLink,
    toggleFriendActive,
    removeFriend,
    getFriendOverlaps,
  };
}
