import { db } from "./firebaseConfig.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
export async function saveUser(uid, name, email, role) {
  await setDoc(doc(db, "users", uid), {
    name,
    email,
    role,
    createdAt: serverTimestamp()
  });
}
export async function getUser(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }

  return null;
}
export async function saveLocation(uid, latitude, longitude) {
  await setDoc(doc(db, "locations", uid), {
    latitude,
    longitude,
    updatedAt: serverTimestamp()
  });
}
export async function sendSOS(uid, latitude, longitude) {
  await setDoc(doc(db, "sos", uid), {
    active: true,
    latitude,
    longitude,
    time: serverTimestamp()
  });
}
export async function saveMedicalHistory(uid, history) {
  await setDoc(doc(db, "medicalHistory", uid), history);
}
