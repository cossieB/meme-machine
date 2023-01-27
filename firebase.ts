import { getStorage } from 'firebase/storage';
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyBVTB183Ezv0KI512hX1kus015vkkO5Og4",
    authDomain: "meme-mesheen.firebaseapp.com",
    projectId: "meme-mesheen",
    storageBucket: "meme-mesheen.appspot.com",
    messagingSenderId: "1001975563232",
    appId: "1:1001975563232:web:d690a1d646af4893a62185",
    measurementId: "G-7YLKEDD2R8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

