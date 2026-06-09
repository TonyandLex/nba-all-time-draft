"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/lib/firebase";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
const [joinCode, setJoinCode] = useState("");

  async function createRoom() {
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    await addDoc(collection(db, "draftRooms"), {
  roomCode: code,
  hostName: "playerName",
  status: "waiting",
  currentPick: 1,
  createdAt: Date.now(),

  players: [
    {
      id: "host",
      name: "playerName",
    },
  ],
});
setRoomCode(code);
  }
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>🏀 NBA All-Time Draft Simulator</h1>
      <input
  placeholder="Your Name"
  value={playerName}
  onChange={(e) => setPlayerName(e.target.value)}
/>

<input
  placeholder="Room Code"
  value={joinCode}
  onChange={(e) => setJoinCode(e.target.value)}
/>

      <button
        onClick={createRoom}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
        }}
      >
        Create Draft Room
      </button>

      {roomCode && (
        <h2>
          Room Code: <strong>{roomCode}</strong>
        </h2>
      )}
    </main>
  );
}