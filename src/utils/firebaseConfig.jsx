import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDARQoxm-YjL1tDu-ceITfekIBvavDzHzU",
    authDomain: "taskmanager-b88a9.firebaseapp.com",
    projectId: "taskmanager-b88a9",
    storageBucket: "taskmanager-b88a9.firebasestorage.app",
    messagingSenderId: "661230921191",
    appId: "1:661230921191:web:20aa41ad548115751a0942",
    measurementId: "G-R2K14LPHCR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
