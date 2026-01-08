import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import type { WorkEntry } from '../types'

export const useWorkEntries = (userId: string | null) => {
  const [entries, setEntries] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setEntries([])
      setLoading(false)
      return
    }

    // Create query for user's work entries
    const q = query(
      collection(db, 'workEntries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entriesData: WorkEntry[] = []
        snapshot.forEach((doc) => {
          entriesData.push({
            id: doc.id,
            ...doc.data()
          } as WorkEntry)
        })
        setEntries(entriesData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching entries:', err)
        setError(err as Error)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return unsubscribe
  }, [userId])

  const addEntry = async (entry: Omit<WorkEntry, 'id'>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await addDoc(collection(db, 'workEntries'), {
        ...entry,
        userId,
        createdAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Error adding entry:', err)
      setError(err as Error)
      throw err
    }
  }

  const updateEntry = async (entryId: string, entry: Omit<WorkEntry, 'id'>) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await updateDoc(doc(db, 'workEntries', entryId), {
        ...entry,
        userId
      })
    } catch (err) {
      console.error('Error updating entry:', err)
      setError(err as Error)
      throw err
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!userId) throw new Error('User not authenticated')

    try {
      await deleteDoc(doc(db, 'workEntries', entryId))
    } catch (err) {
      console.error('Error deleting entry:', err)
      setError(err as Error)
      throw err
    }
  }

  return { entries, loading, error, addEntry, updateEntry, deleteEntry }
}
