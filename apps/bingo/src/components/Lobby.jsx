import { useState } from "react";
import { normalizeRoomCode } from "../lib/roomCode";

export default function Lobby({ defaultName, defaultRoomCode, onHost, onJoin }) {
  const [name, setName] = useState(defaultName);
  const [roomCode, setRoomCode] = useState(defaultRoomCode);
  const [mode, setMode] = useState(defaultRoomCode ? "join" : "host");

  const trimmedName = name.trim();
  const cleanRoomCode = normalizeRoomCode(roomCode);
  const canHost = trimmedName.length > 0;
  const canJoin = canHost && cleanRoomCode.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <span className="text-5xl">🎱</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Family Bingo</h1>
          <p className="text-slate-500 text-sm mt-1">
            Classic 75-ball bingo, played live with whoever you invite. No accounts, nothing installed.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mom, Uncle Pete..."
            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setMode("host")}
            className={`flex-1 px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
              mode === "host" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-400"
            }`}
          >
            🆕 Host a Game
          </button>
          <button
            onClick={() => setMode("join")}
            className={`flex-1 px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
              mode === "join" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-400"
            }`}
          >
            🔗 Join a Game
          </button>
        </div>

        {mode === "host" ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              You'll get a room code to share with family. You'll be the caller who draws numbers — everyone
              else marks their own card live as you go.
            </p>
            <button
              disabled={!canHost}
              onClick={() => onHost(trimmedName)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              Create Room →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Room code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. K7QXP"
              className="w-full border border-slate-300 rounded-lg p-3 text-sm tracking-widest font-bold text-center uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              disabled={!canJoin}
              onClick={() => onJoin(trimmedName, cleanRoomCode)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              Join Room →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
