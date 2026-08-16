import { useMemo, useState } from "react";
import Lobby from "./components/Lobby";
import GameHeader from "./components/GameHeader";
import BingoCard from "./components/BingoCard";
import CallerPanel from "./components/CallerPanel";
import CallHistory from "./components/CallHistory";
import PlayersList from "./components/PlayersList";
import WinnerBanner from "./components/WinnerBanner";
import { useBingoRoom, selfId } from "./lib/useBingoRoom";
import { generateRoomCode } from "./lib/roomCode";
import { TOTAL_NUMBERS } from "./lib/bingoCard";
import { loadPlayerName, savePlayerName } from "./lib/storage";

function readRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("room") || "").toUpperCase();
}

function setRoomInUrl(roomCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("room", roomCode);
  window.history.replaceState({}, "", url);
}

function clearRoomFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("room");
  window.history.replaceState({}, "", url);
}

export default function App() {
  const [session, setSession] = useState(null); // { roomCode, playerName, isHost }
  const defaultName = useMemo(() => loadPlayerName(), []);
  const defaultRoomCode = useMemo(() => readRoomFromUrl(), []);

  if (!session) {
    return (
      <Lobby
        defaultName={defaultName}
        defaultRoomCode={defaultRoomCode}
        onHost={(name, cardCount) => {
          savePlayerName(name);
          const roomCode = generateRoomCode();
          setRoomInUrl(roomCode);
          setSession({ roomCode, playerName: name, isHost: true, cardCount });
        }}
        onJoin={(name, roomCode, cardCount) => {
          savePlayerName(name);
          setRoomInUrl(roomCode);
          setSession({ roomCode, playerName: name, isHost: false, cardCount });
        }}
      />
    );
  }

  return (
    <Game
      session={session}
      onLeave={() => {
        clearRoomFromUrl();
        setSession(null);
      }}
    />
  );
}

function Game({ session, onLeave }) {
  const { roomCode, playerName, isHost, cardCount } = session;
  const { players, calledNumbers, roundMode, cards, winners, synced, drawNumber, startNewRound, claimBingo } =
    useBingoRoom({ roomCode, playerName, isHost, cardCount });
  const [claimMessage, setClaimMessage] = useState("");

  const calledSet = useMemo(() => new Set(calledNumbers), [calledNumbers]);
  const lastCalled = calledNumbers[calledNumbers.length - 1];
  const remainingCount = TOTAL_NUMBERS - calledNumbers.length;

  const handleClaim = () => {
    const result = claimBingo();
    setClaimMessage(result ? "" : "Not quite — none of your cards have a win yet.");
    if (!result) setTimeout(() => setClaimMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <GameHeader
        roomCode={roomCode}
        isHost={isHost}
        synced={synced}
        roundMode={roundMode}
        onStartNewRound={startNewRound}
        onLeave={onLeave}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        <WinnerBanner winners={winners} />

        <CallerPanel isHost={isHost} lastCalled={lastCalled} remainingCount={remainingCount} onDraw={drawNumber} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              {cards.map((card, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  {cards.length > 1 && <span className="text-xs font-bold text-slate-400 uppercase">Card {i + 1}</span>}
                  <BingoCard card={card} calledSet={calledSet} />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleClaim}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-10 rounded-full text-base shadow-lg transition-colors"
              >
                🎉 Claim BINGO!
              </button>
              {claimMessage && <p className="text-xs text-slate-500">{claimMessage}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <PlayersList players={players} selfId={selfId} />
            <CallHistory calledNumbers={calledNumbers} />
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-12 border-t border-slate-800 text-xs">
        <p>Family Bingo — a portfolio project by Natalia Serrano Ortiz.</p>
        <p className="mt-1 text-slate-600">
          Peer-to-peer, no server: your game only exists while everyone's tab is open.
        </p>
      </footer>
    </div>
  );
}
