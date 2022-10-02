import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBkijDk5q9KRLRotO0WnYSPMI635Cd2Avo",
  authDomain: "dropdown-tugerente.firebaseapp.com",
  projectId: "dropdown-tugerente",
  storageBucket: "dropdown-tugerente.appspot.com",
  messagingSenderId: "190878277696",
  appId: "1:190878277696:web:28e2fa68023e5185b03fa5"
});

const db = firebaseApp.firestore();
export default db;