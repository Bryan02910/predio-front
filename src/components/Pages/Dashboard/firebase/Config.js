// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage" ;
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCtHRUNJGuXspfoYB10UpRoPZAnG61MRc",
  authDomain: "predio-2.firebaseapp.com",
  projectId: "predio-2",
  storageBucket: "predio-2.appspot.com",
  messagingSenderId: "927735829064",
  appId: "1:927735829064:web:adf691fe46e9cb2f07fe7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)