export default function WinnerBanner({ winners }) {
  if (winners.length === 0) return null;

  return (
    <div className="space-y-2">
      {winners
        .slice()
        .reverse()
        .map((w, i) => (
          <div
            key={`${w.peerId}-${winners.length - i}`}
            className="bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-xl p-4 flex items-center gap-3 animate-popIn"
          >
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-bold">
              {w.name || "Someone"} got BINGO! <span className="font-normal">({w.patternType})</span>
            </p>
          </div>
        ))}
    </div>
  );
}
