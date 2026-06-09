"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../src/lib/firebase";

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [status, setStatus] = useState("waiting");
  const [isHost, setIsHost] = useState(false);

  async function createRoom() {
    if (!playerName.trim()) {
      alert("Enter your name");
      return;
    }

    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const docRef = await addDoc(collection(db, "draftRooms"), {
      roomCode: code,
      hostName: playerName,
      status: "waiting",
      currentPick: 1,
      createdAt: Date.now(),

      players: [
        {
          id: "host",
          name: playerName,
        },
      ],

      draftOrder: [],
      draftedPlayers: [],
      teams: {},
    });

    setRoomId(docRef.id);
    setRoomCode(code);
    setIsHost(true);
  }

  async function joinRoom() {
    if (!playerName.trim()) {
      alert("Enter your name");
      return;
    }

    const q = query(
      collection(db, "draftRooms"),
      where("roomCode", "==", joinCode.toUpperCase())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("Room not found");
      return;
    }

    const roomDoc = snapshot.docs[0];
    const roomData = roomDoc.data();

    if ((roomData.players || []).length >= 10) {
      alert("Room is full");
      return;
    }

    await updateDoc(doc(db, "draftRooms", roomDoc.id), {
      players: [
        ...(roomData.players || []),
        {
          id: Date.now().toString(),
          name: playerName,
        },
      ],
    });

    setRoomId(roomDoc.id);
    setRoomCode(roomData.roomCode);
    setIsHost(false);
  }

  async function startDraft() {
  if (players.length < 2) {
    alert("At least 2 players are required to start the draft.");
    return;
  }

  await updateDoc(doc(db, "draftRooms", roomId), {
    status: "drafting",
  });
}

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(
      doc(db, "draftRooms", roomId),
      (snapshot) => {
        const data = snapshot.data();

        console.log("ROOM UPDATE", data);

        if (!data) return;

        setPlayers(data.players || []);
        setStatus(data.status || "waiting");
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
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

      <button
        onClick={joinRoom}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
        }}
      >
        Join Room
      </button>

      {roomCode && (
        <>
          <h2>
            Room Code: <strong>{roomCode}</strong>
          </h2>

          <h3>Status: {status}</h3>

          <h2>Players ({players.length}/10)</h2>

          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>

          {isHost && status === "waiting" && (
            <button
              onClick={startDraft}
              style={{
                padding: "12px 20px",
                fontSize: "18px",
              }}
            >
              Start Draft
            </button>
          )}
        </>
      )}
    </main>
  );
}