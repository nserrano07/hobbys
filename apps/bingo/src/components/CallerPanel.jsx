import { columnLetterForNumber, TOTAL_NUMBERS } from "../lib/bingoCard";

export default function CallerPanel({ isHost, lastCalled, remainingCount, onDraw }) {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow p-6 flex flex-col items-center gap-4">
      <div className="text-center min-h-16">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          {lastCalled ? "Last Called" : "No numbers called yet"}
        </span>
        {lastCalled && (
          <div key={lastCalled} className="mt-1 flex items-center justify-center gap-2 animate-popIn">
            <span className="text-3xl font-black text-indigo-400">{columnLetterForNumber(lastCalled)}</span>
            <span className="text-5xl font-black">{lastCalled}</span>
          </div>
        )}
      </div>

      {isHost ? (
        <button
          onClick={onDraw}
          disabled={remainingCount === 0}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-extrabold py-3 px-8 rounded-lg text-sm shadow-lg transition-colors"
        >
          {remainingCount === 0 ? "All 75 numbers called!" : "🎙️ Draw Next Number"}
        </button>
      ) : (
        <p className="text-xs text-slate-400 text-center">Waiting for the caller to draw the next number…</p>
      )}

      <span className="text-[11px] text-slate-500">
        {TOTAL_NUMBERS - remainingCount} of {TOTAL_NUMBERS} called
      </span>
    </div>
  );
}
