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

export function columnLetterForNumber(num) {
  const index = COLUMN_RANGES.findIndex(([min, max]) => num >= min && num <= max);
  return index === -1 ? "" : COLUMN_LETTERS[index];
}

const WIN_LINES = (() => {
  const lines = [];
  for (let row = 0; row < 5; row++) lines.push([0, 1, 2, 3, 4].map((col) => [col, row]));
  for (let col = 0; col < 5; col++) lines.push([0, 1, 2, 3, 4].map((row) => [col, row]));
  lines.push([0, 1, 2, 3, 4].map((i) => [i, i]));
  lines.push([0, 1, 2, 3, 4].map((i) => [i, 4 - i]));
  return lines;
})();

// Checks a card against a Set of called numbers.
// Returns "Blackout", "Line", or null.
export function checkWin(card, calledSet) {
  const isMarked = ([col, row]) => {
    const val = card[col][row];
    return val === FREE || calledSet.has(val);
  };
  if (card.every((col) => col.every((val) => val === FREE || calledSet.has(val)))) {
    return "Blackout";
  }
  if (WIN_LINES.some((line) => line.every(isMarked))) {
    return "Line";
  }
  return null;
}
