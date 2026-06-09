import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAgJDllP0qfQEQi59An59-e9T3CuyEnxM",
  authDomain: "nba-all-time-draft.firebaseapp.com",
  projectId: "nba-all-time-draft",
  storageBucket: "nba-all-time-draft.firebasestorage.app",
  messagingSenderId: "489674132564",
  appId: "1:489674132564:web:1039fd34bd61bc552431c1",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);