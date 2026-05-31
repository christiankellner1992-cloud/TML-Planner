import { memo, useMemo } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { getDayLabel } from '../constants/days';
import { getRecommendations } from '../utils/recommendations';
import ActCard from './ActCard';

function Recommendations({
  allActs,
  selectedAct,
  selectActForRecommendations,
  selectedActForRecommendations,
  isInMyTimetable,
  onToggle,
  youtubeCache,
  onYoutubeResult,
  getFriendOverlaps = () => [],
}) {
  const recs = useMemo(() => {
    if (!selectedAct) return [];
    return getRecommendations(allActs, [selectedAct.id]);
  }, [allActs, selectedAct]);

  if (!selectedAct) {
    return (
      <aside className="rounded-xl border border-tml-purple/40 bg-gradient-to-b from-tml-card to-tml-dark p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-tml-purple" />
          <h2 className="font-semibold text-tml-gold">AI recommendations</h2>
        </div>
        <p className="text-sm text-white/50">
          Click a DJ card — the AI will show similar acts on the same day. The yellow
          checkmark only means &quot;in your timetable&quot;.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl border border-tml-purple/40 bg-gradient-to-b from-tml-card to-[#120a1c] p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-tml-gold" />
        <h2 className="font-semibold text-tml-gold">AI recommendations</h2>
      </div>
      <p className="text-xs text-white/50">
        Similar to <span className="text-white font-medium">{selectedAct.name}</span>
        {' · '}
        {getDayLabel(selectedAct.day)}
      </p>

      {recs.length === 0 ? (
        <p className="text-sm text-white/50">No more similar acts on this day.</p>
      ) : (
        <div className="space-y-3 max-h-none sm:max-h-[50vh] lg:max-h-[70vh] overflow-y-auto pr-1 -mr-1">
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
                inTimetable={isInMyTimetable(act.id)}
                onToggle={onToggle}
                onSelect={selectActForRecommendations}
                isPreviewSelected={act.id === selectedActForRecommendations}
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

export default memo(Recommendations);
