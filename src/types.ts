export interface WorkEntry {
  id: string // Firestore document ID
  workType: string
  date: string // Date in YYYY-MM-DD format
  startTime: string
  endTime: string
  hourlyWage: number
  totalWages: number
  hoursWorked: number
  userId?: string // Links to authenticated user
  createdAt?: any // Firestore Timestamp
}
