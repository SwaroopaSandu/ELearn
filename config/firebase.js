import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVWE1G3djO-kh2p-gKd_Yje5jUiuIKNx4",
  authDomain: "e-learning-3d26c.firebaseapp.com",
  projectId: "e-learning-3d26c",
  storageBucket: "e-learning-3d26c.appspot.com",
  messagingSenderId: "47120115813",
  appId: "1:47120115813:web:d6659b5c28a9eee9a2be8c",
};

export const app = initializeApp(firebaseConfig, "defaultApp");
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
