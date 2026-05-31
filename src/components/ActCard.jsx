import { memo } from 'react';
import { Check, MapPin, Music2, Plus } from 'lucide-react';
import { getGenres } from '../utils/genre';
import YouTubeEmbed from './YouTubeEmbed';

function ActCard({
  act,
  inTimetable = false,
  onToggle,
  onSelect,
  isPreviewSelected = false,
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
      className={`rounded-xl border transition-colors ${
        isPreviewSelected
          ? 'border-tml-purple ring-2 ring-tml-purple/40 shadow-md shadow-tml-purple/15 bg-tml-card'
          : hasFriendOverlap
            ? 'border-2 border-orange-400/70 bg-gradient-to-br from-orange-500/10 to-tml-card shadow-md shadow-orange-500/15'
            : 'border-tml-border bg-tml-card hover:border-tml-purple/40'
      } ${isSelectable ? 'cursor-pointer active:scale-[0.99]' : ''} ${compact ? 'p-3' : 'p-4 sm:p-4'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold leading-snug ${compact ? 'text-sm line-clamp-2' : 'text-base sm:text-[15px] line-clamp-2 sm:line-clamp-1'}`}
          >
            {act.name}
          </h3>
          <p className="flex items-start gap-1 text-xs text-tml-purple mt-1 font-medium leading-snug">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="break-words">{act.stage}</span>
          </p>
          {act.hostedBy && (
            <p className="text-[10px] text-white/40 mt-0.5">Hosted by {act.hostedBy}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] sm:text-[10px] bg-white/10 text-white/75 max-w-full"
              >
                <Music2 className="w-3 h-3 shrink-0" />
                {genre}
              </span>
            ))}
          </div>
          {hasFriendOverlap && (
            <p className="mt-2 text-[11px] font-medium text-orange-300 leading-snug">
              🔥 Also picked by: {friendOverlap.join(', ')}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(act.id);
            }}
            aria-label={inTimetable ? 'Remove from timetable' : 'Add to timetable'}
            title={inTimetable ? 'Remove' : 'Add'}
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors touch-manipulation ${
              inTimetable
                ? 'bg-tml-gold text-tml-dark shadow-sm shadow-tml-gold/30'
                : 'bg-white/10 active:bg-white/25 text-white border border-white/10'
            }`}
          >
            {inTimetable ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
          <span className="text-[10px] text-white/45 leading-none">
            {inTimetable ? 'Added' : 'Add'}
          </span>
        </div>
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

export default memo(ActCard);
