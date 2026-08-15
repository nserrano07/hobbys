import { COLUMN_LETTERS, FREE } from "../lib/bingoCard";

const HEADER_COLORS = ["bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-violet-500"];

export default function BingoCard({ card, calledSet }) {
  return (
    <div className="inline-block bg-white rounded-xl shadow border border-slate-200 p-3">
      <div className="grid grid-cols-5 gap-1.5">
        {COLUMN_LETTERS.map((letter, i) => (
          <div
            key={letter}
            className={`w-12 h-12 sm:w-14 sm:h-14 ${HEADER_COLORS[i]} rounded-lg flex items-center justify-center text-white font-extrabold text-lg`}
          >
            {letter}
          </div>
        ))}
        {[0, 1, 2, 3, 4].flatMap((row) =>
          COLUMN_LETTERS.map((_, col) => {
            const value = card[col][row];
            const marked = value === FREE || calledSet.has(value);
            return (
              <div
                key={`${col}-${row}`}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base border transition-colors duration-200 ${
                  marked
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {value === FREE ? "★" : value}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
