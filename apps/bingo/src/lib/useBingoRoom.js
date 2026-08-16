import { useCallback, useEffect, useRef, useState } from "react";
import { joinRoom, selfId } from "trystero";
import { generateCards, checkWinAcrossCards, TOTAL_NUMBERS, WIN_MODES } from "./bingoCard";

// Unique namespace for this app on the (public, serverless) Trystero
// signaling network — has nothing to do with any account or server of ours.
const APP_ID = "natalia-serrano-family-bingo-v1";
const DEFAULT_MODE = WIN_MODES[0].id;

export { selfId };

function remainingPool(calledNumbers) {
  const called = new Set(calledNumbers);
  const pool = [];
  for (let n = 1; n <= TOTAL_NUMBERS; n++) if (!called.has(n)) pool.push(n);
  return pool;
}

// Wires up a peer-to-peer bingo room over WebRTC (via Trystero — no server,
// no accounts). One peer is the "host": only they draw numbers and pick each
// round's win mode; they're the source of truth a newly-joined peer syncs
// against. Every peer keeps its own private cards locally; cards are never
// sent over the wire.
export function useBingoRoom({ roomCode, playerName, isHost, cardCount }) {
  const [players, setPlayers] = useState(() => ({ [selfId]: { name: playerName, isHost } }));
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [roundId, setRoundId] = useState(() => Date.now());
  const [roundMode, setRoundMode] = useState(DEFAULT_MODE);
  const [cards, setCards] = useState(() => generateCards(cardCount));
  const [winners, setWinners] = useState([]);
  const [synced, setSynced] = useState(isHost);

  const actionsRef = useRef({});
  const calledNumbersRef = useRef(calledNumbers);
  calledNumbersRef.current = calledNumbers;
  const roundIdRef = useRef(roundId);
  roundIdRef.current = roundId;
  const roundModeRef = useRef(roundMode);
  roundModeRef.current = roundMode;
  const playerNameRef = useRef(playerName);
  playerNameRef.current = playerName;
  const isHostRef = useRef(isHost);
  isHostRef.current = isHost;
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  const cardCountRef = useRef(cardCount);
  cardCountRef.current = cardCount;

  useEffect(() => {
    const room = joinRoom({ appId: APP_ID }, `bingo-${roomCode}`);

    const hello = room.makeAction("hello");
    const sync = room.makeAction("sync");
    const draw = room.makeAction("draw");
    const newRound = room.makeAction("newRound");
    const claim = room.makeAction("claim");
    actionsRef.current = { draw, newRound, claim };

    hello.onMessage = (payload, { peerId }) =>
      setPlayers((p) => ({ ...p, [peerId]: { name: payload.name, isHost: payload.isHost } }));

    // Only the host sends this (see onPeerJoin below) — it lets a peer who
    // joins mid-round catch up on what's already been called and what mode
    // this round is being played for.
    sync.onMessage = (state) => {
      setRoundId(state.roundId);
      setRoundMode(state.roundMode);
      setCalledNumbers(state.calledNumbers);
      setCards(generateCards(cardCountRef.current));
      setWinners([]);
      setSynced(true);
    };

    draw.onMessage = (payload) => {
      if (payload.roundId !== roundIdRef.current) return;
      setCalledNumbers((prev) => (prev.includes(payload.number) ? prev : [...prev, payload.number]));
    };

    newRound.onMessage = (payload) => {
      setRoundId(payload.roundId);
      setRoundMode(payload.roundMode);
      setCalledNumbers([]);
      setWinners([]);
      setCards(generateCards(cardCountRef.current));
    };

    claim.onMessage = (payload, { peerId }) => {
      if (payload.roundId !== roundIdRef.current) return;
      setWinners((w) => [...w, { peerId, name: payload.name, patternType: payload.patternType }]);
    };

    room.onPeerJoin = (peerId) => {
      hello.send({ name: playerNameRef.current, isHost: isHostRef.current }, { target: peerId });
      if (isHostRef.current) {
        sync.send(
          {
            calledNumbers: calledNumbersRef.current,
            roundId: roundIdRef.current,
            roundMode: roundModeRef.current,
          },
          { target: peerId }
        );
      }
    };

    room.onPeerLeave = (peerId) => {
      setPlayers((p) => {
        const next = { ...p };
        delete next[peerId];
        return next;
      });
    };

    return () => {
      room.leave();
    };
    // roomCode is the only thing that should ever tear down and rejoin the room.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  const drawNumber = useCallback(() => {
    const pool = remainingPool(calledNumbersRef.current);
    if (pool.length === 0) return null;
    const number = pool[Math.floor(Math.random() * pool.length)];
    setCalledNumbers((prev) => [...prev, number]);
    actionsRef.current.draw?.send({ number, roundId: roundIdRef.current });
    return number;
  }, []);

  const startNewRound = useCallback((modeId) => {
    const newRoundId = Date.now();
    const mode = modeId || DEFAULT_MODE;
    setRoundId(newRoundId);
    setRoundMode(mode);
    setCalledNumbers([]);
    setWinners([]);
    setCards(generateCards(cardCountRef.current));
    actionsRef.current.newRound?.send({ roundId: newRoundId, roundMode: mode });
  }, []);

  const claimBingo = useCallback(() => {
    const patternType = checkWinAcrossCards(cardsRef.current, new Set(calledNumbersRef.current), roundModeRef.current);
    if (!patternType) return null;
    setWinners((w) => [...w, { peerId: selfId, name: playerNameRef.current, patternType }]);
    actionsRef.current.claim?.send({
      name: playerNameRef.current,
      patternType,
      roundId: roundIdRef.current,
    });
    return patternType;
  }, []);

  return {
    players,
    calledNumbers,
    roundId,
    roundMode,
    cards,
    winners,
    synced,
    drawNumber,
    startNewRound,
    claimBingo,
  };
}
