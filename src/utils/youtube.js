import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export function buildSearchQuery(artistName) {
  return `${artistName} Tomorrowland live set`;
}

function buildFallbackSearchUrl(artistName) {
  const q = encodeURIComponent(buildSearchQuery(artistName));
  return `https://www.youtube.com/results?search_query=${q}`;
}

/**
 * Sucht das neueste relevante YouTube-Video für einen Act (YouTube Data API v3).
 * @returns {Promise<{ type: 'video'|'search', videoId?, title?, url, thumbnail?, publishedAt? }>}
 */
export async function searchYoutubeForArtist(artistName) {
  const query = buildSearchQuery(artistName);

  if (API_KEY) {
    try {
      const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          order: 'date',
          maxResults: 1,
          key: API_KEY,
        },
      });

      const item = data.items?.[0];
      if (item?.id?.videoId) {
        const videoId = item.id.videoId;
        return {
          type: 'video',
          videoId,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: item.snippet.thumbnails?.medium?.url,
          publishedAt: item.snippet.publishedAt,
        };
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      console.warn('YouTube API Fehler, Fallback:', msg);
    }
  }

  return {
    type: 'search',
    url: buildFallbackSearchUrl(artistName),
    title: `YouTube-Suche: ${artistName}`,
  };
}

export function getEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?rel=0`;
}
