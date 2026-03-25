import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
     apiKey: "AIzaSyAC0K_7GdPfZ1idnpa0VkwgZ9zBYOB4PRk",
  authDomain: "crudfbtest.firebaseapp.com",
  projectId: "crudfbtest",
  storageBucket: "crudfbtest.firebasestorage.app",
  messagingSenderId: "171088113288",
  appId: "1:171088113288:web:eb8b6e333edce9be90b93d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
