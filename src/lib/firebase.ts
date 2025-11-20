import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXM48dJFH7xUWcB5WT40EsAt7JO9Cd20A",
  authDomain: "trello-bb293.firebaseapp.com",
  projectId: "trello-bb293",
  storageBucket: "trello-bb293.firebasestorage.app",
  messagingSenderId: "663809552208",
  appId: "1:663809552208:web:807a0b2938e392d114c655",
  measurementId: "G-CFDV4457LD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
