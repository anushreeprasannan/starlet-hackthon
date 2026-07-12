import { auth } from "./firebaseConfig.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}


async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}


async function logout() {
  await signOut(auth);
}


function checkUser(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

export { signUp, login, logout, checkUser };
