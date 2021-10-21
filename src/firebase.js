import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDd_9P3-hguUkbQKx3tiLPDXknDcKzJLTw",
    authDomain: "linked-in-clone-39ab6.firebaseapp.com",
    projectId: "linked-in-clone-39ab6",
    storageBucket: "linked-in-clone-39ab6.appspot.com",
    messagingSenderId: "142442577480",
    appId: "1:142442577480:web:a4c653847e5372e899e27d"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();


export { auth,provider,storage}
export default db;