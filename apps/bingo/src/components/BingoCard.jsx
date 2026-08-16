import { COLUMN_LETTERS, FREE } from "../lib/bingoCard";

const HEADER_COLORS = ["bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-violet-500"];

const SIZES = {
  normal: { cell: "w-12 h-12 sm:w-14 sm:h-14", text: "text-sm sm:text-base", header: "text-lg", gap: "gap-1.5", pad: "p-3" },
  small: { cell: "w-7 h-7 sm:w-8 sm:h-8", text: "text-[10px] sm:text-xs", header: "text-[10px]", gap: "gap-1", pad: "p-2" },
};

// If onCellClick is given, the card is interactive: cells only count as
// marked once the player has clicked them (and only called numbers are
// clickable) — a "called" cell awaiting a click gets a nudge highlight.
// Without onCellClick, the card is read-only and auto-marks everything
// that's been called (used for the host's progress monitor).
export default function BingoCard({ card, calledSet, markedNumbers, onCellClick, size = "normal" }) {
  const s = SIZES[size] || SIZES.normal;
  const interactive = typeof onCellClick === "function";

  return (
    <div className={`inline-block bg-white rounded-xl shadow border border-slate-200 ${s.pad}`}>
      <div className={`grid grid-cols-5 ${s.gap}`}>
        {COLUMN_LETTERS.map((letter, i) => (
          <div
            key={letter}
            className={`${s.cell} ${HEADER_COLORS[i]} rounded-lg flex items-center justify-center text-white font-extrabold ${s.header}`}
          >
            {letter}
          </div>
        ))}
        {[0, 1, 2, 3, 4].flatMap((row) =>
          COLUMN_LETTERS.map((_, col) => {
            const value = card[col][row];
            const isFree = value === FREE;
            const called = isFree || calledSet.has(value);
            const marked = isFree || (interactive ? markedNumbers?.has(value) : called);
            const awaitingClick = interactive && called && !marked;

            return (
              <div
                key={`${col}-${row}`}
                onClick={interactive && called ? () => onCellClick(value) : undefined}
                className={`${s.cell} rounded-lg flex items-center justify-center font-bold ${s.text} border transition-colors duration-200 ${
                  marked
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : awaitingClick
                      ? "bg-amber-100 border-amber-400 text-amber-800 cursor-pointer animate-pulse hover:bg-amber-200"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {isFree ? "★" : value}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
