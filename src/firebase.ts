import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAO4XDD1YBeUXF2v3knhJGhHU1mc_T4MdU',
  authDomain: 'wages-calculator-ed37a.firebaseapp.com',
  projectId: 'wages-calculator-ed37a',
  storageBucket: 'wages-calculator-ed37a.firebasestorage.app',
  messagingSenderId: '637759007582',
  appId: '1:637759007582:web:627af08a467a55517c3dcf'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize and export services
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
