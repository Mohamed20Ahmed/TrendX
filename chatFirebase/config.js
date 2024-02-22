// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxm4gFU7zv3PrPDNgLCkD9w8awUEZaoqM",
  authDomain: "trendx-3a4eb.firebaseapp.com",
  databaseURL:
    "https://trendx-3a4eb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trendx-3a4eb",
  storageBucket: "trendx-3a4eb.appspot.com",
  messagingSenderId: "216249660131",
  appId: "1:216249660131:web:352288c6fbcb9f5ebc0bd6",
  measurementId: "G-4QCNJ14JV5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// TODO;): Add SDKs for Firebase products that you want to use

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://trendx-3a4eb-default-rtdb.europe-west1.firebasedatabase.app",
});
