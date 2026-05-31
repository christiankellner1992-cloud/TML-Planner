const SHARE_PARAM = 'plan';

/**
 * @typedef {{ friday: string[], saturday: string[], sunday: string[] }} TimetableIds
 * @typedef {Record<string, import('./youtube.js').YoutubeResult>} YoutubeCache
 */

/**
 * @param {TimetableIds} timetable
 * @param {YoutubeCache} youtubeCache
 */
export function encodeShareState(timetable, youtubeCache = {}) {
  const payload = { t: timetable, y: youtubeCache };
  const json = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShareState(encoded) {
  if (!encoded) return null;
  try {
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = decodeURIComponent(escape(atob(b64)));
    const data = JSON.parse(json);
    if (!data?.t) return null;
    return {
      timetable: {
        friday: data.t.friday || [],
        saturday: data.t.saturday || [],
        sunday: data.t.sunday || [],
      },
      youtubeCache: data.y || {},
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(timetable, youtubeCache) {
  const encoded = encodeShareState(timetable, youtubeCache);
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set(SHARE_PARAM, encoded);
  return url.toString();
}

export function readShareFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(SHARE_PARAM);
  return decodeShareState(encoded);
}

export { SHARE_PARAM };
