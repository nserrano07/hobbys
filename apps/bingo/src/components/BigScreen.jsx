import { COLUMN_LETTERS, COLUMN_RANGES, columnLetterForNumber, winModeLabel } from "../lib/bingoCard";

const HEADER_COLORS = ["bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-violet-500"];

// A shared, projector/screen-share-friendly view: the current goal, the most
// recent call in huge type, and a full caller board so a room (or a video
// call) can follow along without everyone crowding one phone screen. This is
// just a display mode for whichever device shows it — it doesn't change
// who's hosting or playing.
export default function BigScreen({ roundMode, calledNumbers, onExit }) {
  const calledSet = new Set(calledNumbers);
  const lastCalled = calledNumbers[calledNumbers.length - 1];

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-950 text-white flex flex-col items-center py-10 px-4 gap-8">
      <button
        onClick={onExit}
        className="self-start ml-2 -mt-4 text-slate-400 hover:text-white text-sm font-semibold"
      >
        ← Back to my card
      </button>

      <div className="text-center">
        <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Playing for</p>
        <p className="text-4xl sm:text-5xl font-black text-indigo-400">{winModeLabel(roundMode)}</p>
      </div>

      <div className="text-center">
        <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-2">
          {lastCalled ? "Last Called" : "No numbers called yet"}
        </p>
        {lastCalled && (
          <div key={lastCalled} className="flex items-center justify-center gap-4 animate-popIn">
            <span className="text-6xl sm:text-8xl font-black text-indigo-400">{columnLetterForNumber(lastCalled)}</span>
            <span className="text-8xl sm:text-[10rem] font-black leading-none">{lastCalled}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-2xl w-full max-w-3xl">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {COLUMN_LETTERS.map((letter, i) => (
            <div key={letter} className="flex flex-col items-center gap-2 sm:gap-3">
              <div className={`w-full py-2 rounded-lg ${HEADER_COLORS[i]} text-center font-extrabold text-lg sm:text-2xl`}>
                {letter}
              </div>
              {Array.from(
                { length: COLUMN_RANGES[i][1] - COLUMN_RANGES[i][0] + 1 },
                (_, j) => COLUMN_RANGES[i][0] + j
              ).map((n) => (
                <div
                  key={n}
                  className={`w-full aspect-square rounded-md flex items-center justify-center text-xs sm:text-base font-bold transition-colors ${
                    calledSet.has(n) ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {n}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-slate-500 text-xs">{calledNumbers.length} of 75 called</p>
    </div>
  );
}
