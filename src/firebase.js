import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCQRgDm5NSS9aI9cU06wydxWkCrgazjx7s",
  authDomain: "whatsapp2clone.firebaseapp.com",
  databaseURL: "https://whatsapp2clone.firebaseio.com",
  projectId: "whatsapp2clone",
  storageBucket: "whatsapp2clone.appspot.com",
  messagingSenderId: "460061654255",
  appId: "1:460061654255:web:0c9083cd12961e43302f1a",
  measurementId: "G-HH9E05EQ03"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;