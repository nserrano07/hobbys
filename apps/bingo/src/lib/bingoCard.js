// Classic 75-ball bingo: columns B(1-15) I(16-30) N(31-45) G(46-60) O(61-75),
// laid out as a 5x5 grid with a free center space.

export const COLUMN_LETTERS = ["B", "I", "N", "G", "O"];
export const COLUMN_RANGES = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75],
];
export const FREE = "FREE";
export const TOTAL_NUMBERS = 75;
export const MAX_CARDS = 5;

function sampleUnique(min, max, count) {
  const pool = [];
  for (let n = min; n <= max; n++) pool.push(n);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

// A card is 5 columns of 5 numbers each: card[col][row]. The center cell
// (col 2, row 2 — the "N" column) is the free space.
export function generateCard() {
  const columns = COLUMN_RANGES.map(([min, max]) => sampleUnique(min, max, 5));
  columns[2][2] = FREE;
  return columns;
}

export function generateCards(count) {
  const n = Math.max(1, Math.min(MAX_CARDS, count || 1));
  return Array.from({ length: n }, () => generateCard());
}

export function columnLetterForNumber(num) {
  const index = COLUMN_RANGES.findIndex(([min, max]) => num >= min && num <= max);
  return index === -1 ? "" : COLUMN_LETTERS[index];
}

const ROWS = [0, 1, 2, 3, 4].map((row) => [0, 1, 2, 3, 4].map((col) => [col, row]));
const COLUMNS = [0, 1, 2, 3, 4].map((col) => [0, 1, 2, 3, 4].map((row) => [col, row]));
const DIAGONALS = [
  [0, 1, 2, 3, 4].map((i) => [i, i]),
  [0, 1, 2, 3, 4].map((i) => [i, 4 - i]),
];

// The set of win conditions a host can pick for a round — chosen up front so
// every player knows what shape they're watching for, same as a caller
// announcing "playing for a line" at a real bingo hall.
export const WIN_MODES = [
  { id: "line", label: "Any Line", patterns: [...ROWS, ...DIAGONALS] },
  { id: "letter", label: "Any Letter (Column)", patterns: COLUMNS },
  { id: "blackout", label: "Full House (Blackout)", patterns: null },
];

export function winModeLabel(modeId) {
  return WIN_MODES.find((m) => m.id === modeId)?.label || WIN_MODES[0].label;
}

// Checks a card against a Set of called numbers for a specific round mode.
// Returns the mode's label on a win, or null.
export function checkWin(card, calledSet, modeId) {
  const mode = WIN_MODES.find((m) => m.id === modeId) || WIN_MODES[0];
  const isMarked = ([col, row]) => {
    const val = card[col][row];
    return val === FREE || calledSet.has(val);
  };
  if (mode.id === "blackout") {
    return card.every((col) => col.every((val) => val === FREE || calledSet.has(val))) ? mode.label : null;
  }
  return mode.patterns.some((pattern) => pattern.every(isMarked)) ? mode.label : null;
}

// Checks every held card against the current mode; returns the label of the
// first winning card found, or null if none qualify yet.
export function checkWinAcrossCards(cards, calledSet, modeId) {
  for (const card of cards) {
    const result = checkWin(card, calledSet, modeId);
    if (result) return result;
  }
  return null;
}
