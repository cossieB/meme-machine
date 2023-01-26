import {getStorage} from 'firebase/storage';
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyDu_GSKWh-KdkBN0CF4CGUCisRuQmlj1T0",
    authDomain: "cossie-91.firebaseapp.com",
    projectId: "cossie-91",
    storageBucket: "cossie-91.appspot.com",
    messagingSenderId: "650544894410",
    appId: "1:650544894410:web:34e96bafbbc5f62f03bf33",
    measurementId: "G-GY12Y3D6CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

