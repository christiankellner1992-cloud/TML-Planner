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
    <section className="mb-6 rounded-xl border border-tml-border bg-tml-card/80 p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-tml-purple" />
        <h2 className="font-semibold text-lg">Compare friends&apos; timetables</h2>
      </div>

      <p className="text-sm text-white/50 mb-4">
        Paste your friends&apos; share links (
        <code className="text-white/40">?name=…&tracks=…</code>
        ). Active friends are highlighted in the lineup.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="url"
          value={friendLinkInput}
          onChange={(e) => onLinkInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddFriend()}
          placeholder="Paste share link…"
          className="flex-1 px-3 py-2 rounded-lg bg-tml-dark border border-tml-border text-sm focus:outline-none focus:border-tml-purple"
        />
        <button
          type="button"
          onClick={onAddFriend}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-tml-purple hover:bg-tml-purple/80 text-sm font-medium shrink-0"
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
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
                  className="w-4 h-4 rounded accent-orange-400 shrink-0"
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
                className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
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
