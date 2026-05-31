import { Check, MapPin, Music2, Plus } from 'lucide-react';
import { getGenres } from '../utils/genre';
import YouTubeEmbed from './YouTubeEmbed';

export default function ActCard({
  act,
  inTimetable,
  onToggle,
  onSelect,
  isFocused = false,
  youtubeCache,
  onYoutubeResult,
  friendOverlap = [],
  compact = false,
  showYoutube = true,
}) {
  const hasFriendOverlap = friendOverlap.length > 0;
  const genres = getGenres(act);
  const isSelectable = Boolean(onSelect);

  return (
    <article
      role={isSelectable ? 'button' : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={isSelectable ? () => onSelect(act.id) : undefined}
      onKeyDown={
        isSelectable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(act.id);
              }
            }
          : undefined
      }
      className={`rounded-xl border transition-all ${
        isFocused
          ? 'border-tml-purple ring-2 ring-tml-purple/50 shadow-lg shadow-tml-purple/20'
          : hasFriendOverlap
            ? 'border-2 border-orange-400/80 bg-gradient-to-br from-orange-500/10 to-tml-card shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/30'
            : inTimetable
              ? 'border-tml-gold/60 bg-tml-gold/10 shadow-lg shadow-tml-gold/5'
              : 'border-tml-border bg-tml-card hover:border-tml-purple/50'
      } ${isSelectable ? 'cursor-pointer' : ''} ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {act.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-tml-purple mt-0.5 font-medium">
            <MapPin className="w-3 h-3 shrink-0" />
            {act.stage}
          </p>
          {act.hostedBy && (
            <p className="text-[10px] text-white/40 mt-0.5">Hosted by {act.hostedBy}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/70"
              >
                <Music2 className="w-3 h-3 shrink-0" />
                {genre}
              </span>
            ))}
          </div>
          {hasFriendOverlap && (
            <p className="mt-2 text-[11px] font-medium text-orange-300 leading-snug">
              🔥 Auch bei: {friendOverlap.join(', ')}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(act.id);
          }}
          title={inTimetable ? 'Aus Timetable entfernen' : 'Zum Timetable hinzufügen'}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            inTimetable
              ? 'bg-tml-gold text-tml-dark'
              : 'bg-white/10 hover:bg-tml-purple text-white'
          }`}
        >
          {inTimetable ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {inTimetable && showYoutube && (
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <YouTubeEmbed
            act={act}
            cached={youtubeCache[act.id]}
            onResult={onYoutubeResult}
          />
        </div>
      )}
    </article>
  );
}
