import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB7rAXp_kD-g4C4MQTQMPsCG-L-GKs8-Cc",
  authDomain: "buyandsell-620d2.firebaseapp.com",
  databaseURL: "https://buyandsell-620d2-default-rtdb.firebaseio.com/",
  projectId: "buyandsell-620d2",
  storageBucket: "buyandsell-620d2.appspot.com",
  messagingSenderId: "278875643670",
  appId: "1:278875643670:ios:c31a5e6295f5f9e5fb7a37",
  measurementId: "G-6276083425",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, app };
