import { useState } from "react";
import { WIN_MODES, winModeLabel } from "../lib/bingoCard";

export default function GameHeader({
  roomCode,
  isHost,
  synced,
  roundMode,
  bigScreen,
  onToggleBigScreen,
  onStartNewRound,
  onLeave,
}) {
  const [copied, setCopied] = useState(false);
  const [nextMode, setNextMode] = useState(roundMode);

  const copyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch((err) => console.error("Could not copy invite link: ", err));
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎱</span>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Family Bingo</h1>
            <p className="text-indigo-200 text-xs font-medium flex items-center gap-1.5 flex-wrap">
              Room <span className="font-mono font-bold tracking-widest">{roomCode}</span>
              {!synced && <span className="text-amber-300">· connecting…</span>}
              <span className="text-indigo-300">
                · Playing for: <span className="text-white font-semibold">{winModeLabel(roundMode)}</span>
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end items-center">
          <button
            onClick={copyInviteLink}
            className="bg-white hover:bg-slate-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg shadow text-sm transition-colors"
          >
            {copied ? "✓ Link Copied!" : "🔗 Copy Invite Link"}
          </button>
          <button
            onClick={onToggleBigScreen}
            className={`font-semibold py-2 px-3 rounded-lg text-xs transition-colors ${
              bigScreen ? "bg-white text-indigo-700" : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
            title="A shared display of the goal and called numbers — for screen-sharing or a spare device"
          >
            🖥️ {bigScreen ? "Exit Big Screen" : "Big Screen"}
          </button>
          {isHost && (
            <>
              <select
                value={nextMode}
                onChange={(e) => setNextMode(e.target.value)}
                className="bg-indigo-800 border border-indigo-500 text-white text-xs font-semibold rounded-lg py-2 px-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                title="Win pattern for the next round"
              >
                {WIN_MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onStartNewRound(nextMode)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                title="Clear the board and deal fresh cards for everyone"
              >
                🔄 Start New Round
              </button>
            </>
          )}
          <button
            onClick={onLeave}
            className="bg-red-600/90 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
          >
            🚪 Leave
          </button>
        </div>
      </div>
    </header>
  );
}
