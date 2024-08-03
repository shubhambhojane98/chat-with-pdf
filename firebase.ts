import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKDhOM7fAEhWVsX7zn9M2HDkwGykiP9QI",
  authDomain: "chat-with-pdf-46122.firebaseapp.com",
  projectId: "chat-with-pdf-46122",
  storageBucket: "chat-with-pdf-46122.appspot.com",
  messagingSenderId: "619933918133",
  appId: "1:619933918133:web:3ac0976d8d6dd4de226ffc",
  measurementId: "G-WRT8WHTNS4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
