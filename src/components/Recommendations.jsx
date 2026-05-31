import { Brain, Sparkles } from 'lucide-react';
import { getRecommendations } from '../utils/recommendations';
import ActCard from './ActCard';

export default function Recommendations({
  allActs,
  focusedAct,
  focusAct,
  focusedActId,
  isInTimetable,
  onToggle,
  youtubeCache,
  onYoutubeResult,
  getFriendOverlaps = () => [],
}) {
  const seedIds = focusedAct ? [focusedAct.id] : [];
  const recs = getRecommendations(allActs, seedIds);

  if (!focusedAct) {
    return (
      <aside className="rounded-xl border border-tml-purple/40 bg-gradient-to-b from-tml-card to-tml-dark p-4 lg:sticky lg:top-28">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-tml-purple" />
          <h2 className="font-semibold text-tml-gold">KI-Empfehlungen</h2>
        </div>
        <p className="text-sm text-white/50">
          Klicke eine DJ-Kachel an — die KI zeigt dir sofort ähnliche Acts am selben Tag.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border border-tml-purple/40 bg-gradient-to-b from-tml-card to-[#120a1c] p-4 space-y-3 lg:sticky lg:top-28">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-tml-gold" />
        <h2 className="font-semibold text-tml-gold">KI-Empfehlungen</h2>
      </div>
      <p className="text-xs text-white/50">
        Ähnlich wie <span className="text-white font-medium">{focusedAct.name}</span>
        {' · '}
        {focusedAct.dayLabel}
      </p>

      {recs.length === 0 ? (
        <p className="text-sm text-white/50">Keine weiteren ähnlichen Acts an diesem Tag.</p>
      ) : (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {recs.map(({ act, reasons }) => (
            <div key={act.id} className="space-y-1">
              {reasons?.length > 0 && (
                <p className="text-[10px] text-tml-purple/90 px-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  {reasons.join(' · ')}
                </p>
              )}
              <ActCard
                act={act}
                inTimetable={isInTimetable(act.id)}
                onToggle={onToggle}
                onSelect={focusAct}
                isFocused={act.id === focusedActId}
                youtubeCache={youtubeCache}
                onYoutubeResult={onYoutubeResult}
                friendOverlap={getFriendOverlaps(act.id)}
                compact
                showYoutube={false}
              />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
