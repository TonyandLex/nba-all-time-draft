"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/lib/firebase";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");

  async function createRoom() {
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    await addDoc(collection(db, "draftRooms"), {
  roomCode: code,
  hostName: "Anthony",
  status: "waiting",
  currentPick: 1,
  createdAt: Date.now(),

  players: [
    {
      id: "host",
      name: "Anthony",
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