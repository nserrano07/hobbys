import BingoCard from "./BingoCard";
import { checkWin } from "../lib/bingoCard";

// Host-only: a read-only, auto-marked view of every other player's cards, so
// the caller can see at a glance how close everyone is without needing them
// to click "Claim BINGO" first. Marks here are computed straight from the
// called numbers, not from what that player has actually clicked — this is
// a monitoring aid, not the real win check (each player still claims for
// themselves against their own manual marks).
export default function PlayerMonitor({ players, playerCards, calledSet, roundMode, selfId }) {
  const entries = Object.entries(playerCards).filter(([peerId]) => peerId !== selfId);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Player Progress</h3>
        <p className="text-sm text-slate-400 italic">Waiting for players' cards…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Player Progress</h3>
      <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
        {entries.map(([peerId, cards]) => {
          const name = players[peerId]?.name || "Someone";
          const hasWin = cards.some((card) => checkWin(card, calledSet, roundMode));
          return (
            <div key={peerId} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-700">{name}</span>
                {hasWin && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">
                    ✓ Complete!
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {cards.map((card, i) => (
                  <BingoCard key={i} card={card} calledSet={calledSet} size="small" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
