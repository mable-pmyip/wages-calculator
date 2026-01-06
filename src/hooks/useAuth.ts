import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return { user, loading, signInWithGoogle, signOut }
}
