import { useEffect, useState } from 'react';
import { ExternalLink, Loader2, Play } from 'lucide-react';
import { searchYoutubeForArtist, getEmbedUrl } from '../utils/youtube';

export default function YouTubeEmbed({ act, cached, onResult, autoLoad = true }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(cached || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setResult(cached || null);
    setError(null);
  }, [cached, act.id]);

  useEffect(() => {
    if (autoLoad && !cached && !result && !loading) {
      loadVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act.id, autoLoad]);

  async function loadVideo() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchYoutubeForArtist(act.name);
      setResult(data);
      onResult?.(act.id, data);
      if (data.type === 'search' && !import.meta.env.VITE_YOUTUBE_API_KEY) {
        setError('Kein API-Key – öffne die Suchergebnisse auf YouTube.');
      }
    } catch {
      setError('Video konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 border-t border-tml-border/60 pt-3">
      {loading && (
        <p className="flex items-center gap-2 text-xs text-white/50">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Suche: „{act.name} Tomorrowland live set“…
        </p>
      )}

      {error && !loading && (
        <p className="text-xs text-amber-400/90">{error}</p>
      )}

      {result?.type === 'video' && (
        <div className="space-y-2">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-1.5 text-xs text-red-400 hover:underline line-clamp-2"
          >
            <Play className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {result.title}
          </a>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black ring-1 ring-white/10">
            <iframe
              title={result.title}
              src={getEmbedUrl(result.videoId)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {result?.type === 'search' && !loading && (
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Neuestes Set auf YouTube suchen
        </a>
      )}

      {!loading && !result && (
        <button
          type="button"
          onClick={loadVideo}
          className="flex items-center gap-1.5 text-xs text-tml-gold hover:underline"
        >
          <Play className="w-3.5 h-3.5" />
          Live-Set laden
        </button>
      )}
    </div>
  );
}
