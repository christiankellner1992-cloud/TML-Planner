import { Trash2, UserPlus, Users } from 'lucide-react';

export default function FriendsCompare({
  friends,
  friendLinkInput,
  onLinkInputChange,
  onAddFriend,
  onToggleActive,
  onRemoveFriend,
  notice,
}) {
  return (
    <section className="mb-5 sm:mb-6 rounded-xl border border-tml-border bg-tml-card/80 p-4 sm:p-5">
      <div className="flex items-start gap-2 mb-3">
        <Users className="w-5 h-5 text-tml-purple shrink-0 mt-0.5" />
        <h2 className="font-semibold text-base sm:text-lg leading-snug">
          Compare friends&apos; timetables
        </h2>
      </div>

      <p className="text-sm text-white/50 mb-4">
        Paste your friends&apos; share links (
        <code className="text-white/40 break-all">?name=…&tracks=…</code>
        ). Active friends are highlighted in the lineup.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="url"
          value={friendLinkInput}
          onChange={(e) => onLinkInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddFriend()}
          placeholder="Paste share link…"
          className="flex-1 px-3 py-3 min-h-[44px] rounded-lg bg-tml-dark border border-tml-border text-base sm:text-sm focus:outline-none focus:border-tml-purple"
        />
        <button
          type="button"
          onClick={onAddFriend}
          className="flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg bg-tml-purple active:bg-tml-purple/80 text-sm font-medium shrink-0 touch-manipulation"
        >
          <UserPlus className="w-4 h-4" />
          Add friend
        </button>
      </div>

      {notice && <p className="text-sm text-tml-gold mb-3">{notice}</p>}

      {friends.length === 0 ? (
        <p className="text-sm text-white/40 italic">
          No friends yet — share your link or paste a friend&apos;s link above.
        </p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className={`flex items-center gap-2 sm:gap-3 px-3 py-3 min-h-[52px] rounded-lg border transition-colors ${
                friend.active
                  ? 'border-orange-400/40 bg-orange-500/5'
                  : 'border-tml-border bg-tml-dark/50 opacity-60'
              }`}
            >
              <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                <input
                  type="checkbox"
                  checked={friend.active}
                  onChange={() => onToggleActive(friend.id)}
                  className="w-5 h-5 rounded accent-orange-400 shrink-0"
                />
                <span className="font-medium truncate">{friend.name}</span>
                <span className="text-xs text-white/40 shrink-0">
                  {friend.tracks.length} acts
                </span>
              </label>
              <button
                type="button"
                onClick={() => onRemoveFriend(friend.id)}
                title={`Remove ${friend.name}`}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/40 active:text-red-400 active:bg-red-400/10 transition-colors shrink-0 touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
