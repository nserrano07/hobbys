const STORAGE_KEY = "family_bingo_player_v1";

// Only the player's own display name is remembered across visits — room
// membership is always re-entered explicitly (see README for why).
export function loadPlayerName() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function savePlayerName(name) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // Storage may be unavailable (private browsing, quota); the app still
    // works within the session, it just won't remember the name next time.
  }
}
