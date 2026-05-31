import ActCard from './ActCard';
import { getDayLabel } from '../constants/days';

const DAY_ORDER = ['friday', 'saturday', 'sunday'];

export default function MyTimetable({
  myTimetable,
  actById,
  isInMyTimetable,
  onToggle,
  onSelect,
  selectedActForRecommendations,
  youtubeCache,
  onYoutubeResult,
  getFriendOverlaps = () => [],
}) {
  const total =
    myTimetable.friday.length + myTimetable.saturday.length + myTimetable.sunday.length;

  return (
    <div className="space-y-8">
      <p className="text-white/60 text-sm">
        {total} act(s) in your timetable · Click a card for preview & AI recommendations
      </p>

      {DAY_ORDER.map((dayId) => {
        const ids = myTimetable[dayId] || [];
        const dayLabel = getDayLabel(dayId);
        if (!ids.length) return null;

        return (
          <section key={dayId}>
            <h2 className="text-lg font-semibold text-tml-gold mb-4 border-b border-tml-border pb-2">
              {dayLabel}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {ids.map((id) => {
                const act = actById.get(id);
                if (!act) return null;
                return (
                  <ActCard
                    key={id}
                    act={act}
                    inTimetable={isInMyTimetable(id)}
                    onToggle={() => onToggle(id)}
                    onSelect={onSelect}
                    isPreviewSelected={id === selectedActForRecommendations}
                    youtubeCache={youtubeCache}
                    onYoutubeResult={onYoutubeResult}
                    friendOverlap={getFriendOverlaps(id)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {total === 0 && (
        <div className="text-center py-16 text-white/40">
          <p className="text-lg">Your timetable is empty</p>
          <p className="text-sm mt-2">
            Go to the lineup and tap Add on your favorite DJs
          </p>
        </div>
      )}
    </div>
  );
}
