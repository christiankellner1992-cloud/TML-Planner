import { flattenTimetable } from './timetable';

const LEGACY_PLAN_PARAM = 'plan';

/**
 * @param {string} userName
 * @param {string[]} trackIds
 */
export function buildShareUrl(userName, trackIds) {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('name', userName.trim() || 'Guest');
  url.searchParams.set('tracks', trackIds.join(','));
  return url.toString();
}

/**
 * Parst Share-Parameter aus URL, Query-String oder eingefügtem Link.
 * @returns {{ name: string, tracks: string[] } | null}
 */
export function parseShareParams(input) {
  if (!input?.trim()) return null;

  try {
    let params;
    const trimmed = input.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      params = new URL(trimmed).searchParams;
    } else if (trimmed.includes('name=') || trimmed.includes('tracks=')) {
      const qs = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;
      params = new URLSearchParams(qs);
    } else {
      return null;
    }

    const name = params.get('name');
    const tracksRaw = params.get('tracks');

    if (name && tracksRaw) {
      return {
        name: decodeURIComponent(name),
        tracks: tracksRaw.split(',').map((id) => id.trim()).filter(Boolean),
      };
    }

    const legacy = params.get(LEGACY_PLAN_PARAM);
    if (legacy) {
      const decoded = decodeLegacyPlan(legacy);
      if (decoded?.tracks?.length) {
        return { name: 'Import', tracks: decoded.tracks };
      }
    }
  } catch {
    return null;
  }

  return null;
}

function decodeLegacyPlan(encoded) {
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = decodeURIComponent(escape(atob(b64)));
    const data = JSON.parse(json);
    if (!data?.t) return null;
    const timetable = {
      friday: data.t.friday || [],
      saturday: data.t.saturday || [],
      sunday: data.t.sunday || [],
    };
    return { tracks: flattenTimetable(timetable) };
  } catch {
    return null;
  }
}

/** Liest ?name=&tracks= aus der aktuellen Browser-URL */
export function readShareFromUrl() {
  return parseShareParams(window.location.search);
}

export function clearShareParamsFromUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.pathname + url.hash);
}
