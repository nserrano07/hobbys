export default function PlayersList({ players, selfId }) {
  const entries = Object.entries(players);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Players ({entries.length})</h3>
      <ul className="space-y-1.5">
        {entries.map(([peerId, info]) => (
          <li key={peerId} className="flex items-center gap-2 text-sm text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-semibold">{info.name || "Someone"}</span>
            {peerId === selfId && <span className="text-xs text-slate-400">(you)</span>}
            {info.isHost && (
              <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-bold">Caller</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
