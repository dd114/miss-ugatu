// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtES9zd4KL9QeIUNug38EqtDzp5VbEF6s",
    authDomain: "miss-usatu.firebaseapp.com",
    projectId: "miss-usatu",
    storageBucket: "miss-usatu.appspot.com",
    messagingSenderId: "887500677098",
    appId: "1:887500677098:web:798d60384b56a9b570dc93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireStore = getFirestore(app)

export default fireStore;
