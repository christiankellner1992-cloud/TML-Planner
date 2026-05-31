import ActCard from './ActCard';

const DAY_ORDER = ['friday', 'saturday', 'sunday'];

export default function MyTimetable({
  lineupData,
  timetable,
  actById,
  isInTimetable,
  onToggle,
  onSelect,
  focusedActId,
  youtubeCache,
  onYoutubeResult,
  getFriendOverlaps = () => [],
}) {
  const total =
    timetable.friday.length + timetable.saturday.length + timetable.sunday.length;

  return (
    <div className="space-y-8">
      <p className="text-white/60 text-sm">
        {total} Act(s) in deinem Timetable · Klicke eine Kachel für KI-Empfehlungen
      </p>

      {DAY_ORDER.map((dayId) => {
        const ids = timetable[dayId] || [];
        const dayLabel = lineupData.days[dayId]?.label;
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
                    inTimetable={isInTimetable(id)}
                    onToggle={() => onToggle(id)}
                    onSelect={onSelect}
                    isFocused={id === focusedActId}
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
          <p className="text-lg">Dein Timetable ist noch leer</p>
          <p className="text-sm mt-2">
            Gehe zum Line-Up und klicke auf + bei deinen Lieblings-DJs
          </p>
        </div>
      )}
    </div>
  );
}
