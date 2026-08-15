// Excludes visually-ambiguous characters (0/O, 1/I/L) so codes are easy to read aloud and retype.
const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 5) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function normalizeRoomCode(code) {
  return (code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
