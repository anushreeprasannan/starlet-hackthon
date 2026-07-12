import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyBSQpqEvS87oYS0A_JOX_tMy46JSFbEEO8",
  authDomain: "guardian-angel-5abbd.firebaseapp.com",
  projectId: "guardian-angel-5abbd",
  storageBucket: "guardian-angel-5abbd.firebasestorage.app",
  messagingSenderId: "741475060037",
  appId: "1:741475060037:web:201f54a5c625f797a2d62c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
