import { columnLetterForNumber } from "../lib/bingoCard";

export default function CallHistory({ calledNumbers }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Call History ({calledNumbers.length})</h3>
      {calledNumbers.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Nothing called yet.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          {calledNumbers
            .slice()
            .reverse()
            .map((n) => (
              <span key={n} className="text-xs font-bold bg-slate-100 text-slate-700 rounded-full px-2 py-1">
                {columnLetterForNumber(n)}
                {n}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
