// A tiny 5x5 diagram illustrating what shape wins for a given round mode —
// a picture is a lot faster to parse than "any row, column, or diagonal."
function highlightedCells(modeId) {
  const cells = new Set();
  if (modeId === "blackout") {
    for (let c = 0; c < 5; c++) for (let r = 0; r < 5; r++) cells.add(`${c}-${r}`);
  } else if (modeId === "letter") {
    for (let r = 0; r < 5; r++) cells.add(`0-${r}`); // one full column, e.g. "B"
  } else {
    for (let c = 0; c < 5; c++) cells.add(`${c}-2`); // one row
  }
  return cells;
}

const SIZES = {
  sm: { cell: "w-2 h-2 sm:w-2.5 sm:h-2.5", gap: "gap-0.5" },
  md: { cell: "w-4 h-4 sm:w-5 sm:h-5", gap: "gap-1" },
};

export default function WinPatternExample({ modeId, size = "sm" }) {
  const highlighted = highlightedCells(modeId);
  const { cell, gap } = SIZES[size] || SIZES.sm;

  return (
    <div className={`grid grid-cols-5 ${gap}`}>
      {[0, 1, 2, 3, 4].flatMap((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <div
            key={`${col}-${row}`}
            className={`${cell} rounded-sm ${highlighted.has(`${col}-${row}`) ? "bg-indigo-500" : "bg-slate-200"}`}
          />
        ))
      )}
    </div>
  );
}
