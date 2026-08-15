import { useState } from "react";

export default function GameHeader({ roomCode, isHost, synced, onStartNewRound, onLeave }) {
  const [copied, setCopied] = useState(false);

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
            <p className="text-indigo-200 text-xs font-medium flex items-center gap-1.5">
              Room <span className="font-mono font-bold tracking-widest">{roomCode}</span>
              {!synced && <span className="text-amber-300">· connecting…</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={copyInviteLink}
            className="bg-white hover:bg-slate-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg shadow text-sm transition-colors"
          >
            {copied ? "✓ Link Copied!" : "🔗 Copy Invite Link"}
          </button>
          {isHost && (
            <button
              onClick={onStartNewRound}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
              title="Clear the board and deal fresh cards for everyone"
            >
              🔄 Start New Round
            </button>
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
