import { useState } from 'react'
import './App.css'
import { useAuth } from './hooks/useAuth'
import { useWorkEntries } from './hooks/useWorkEntries'
import { Login } from './components/Login'
import { Calendar } from './components/Calendar'
import { DayModal } from './components/DayModal'

function App() {
  // Authentication
  const { user, loading: authLoading, signOut } = useAuth()

  // Firestore data
  const {
    entries,
    loading: entriesLoading,
    error: entriesError,
    addEntry,
    deleteEntry
  } = useWorkEntries(user?.uid || null)

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteEntry(id)
    } catch (error) {
      alert('Failed to delete entry. Please try again.')
    }
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
  }

  // Calculate totals for current month and year
  const currentYear = currentMonth.getFullYear()
  const currentMonthNum = currentMonth.getMonth()

  const monthTotal = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonthNum
    })
    .reduce((sum, entry) => sum + entry.totalWages, 0)

  const yearTotal = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === currentYear
    })
    .reduce((sum, entry) => sum + entry.totalWages, 0)

  const entriesForSelectedDate = selectedDate
    ? entries.filter((entry) => entry.date === selectedDate)
    : []

  // Show loading screen during initial auth check
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Login />
  }

  // Main app (authenticated users only)
  return (
    <div className="app">
      <div className="container">
        {/* Header with GitHub and user info */}
        <header className="app-header">
          <a
            href="https://github.com/mable-pmyip/wages-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="View source on GitHub"
          >
            <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          
          <div className="user-info">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="user-avatar"
              />
            )}
            <span className="user-name">{user.displayName || user.email}</span>
            <button onClick={signOut} className="logout-button">
              Logout
            </button>
          </div>
        </header>

        <h1>💰 Wages Calculator</h1>
        <p className="subtitle">Track your work hours and calculate total earnings</p>

        {/* Total earnings card at the top */}
        <div className="total-card">
          <div className="totals-grid">
            <div className="total-section">
              <div className="total-label">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              <div className="total-amount-large">${monthTotal.toFixed(2)}</div>
              <div className="total-subtitle">Monthly Total</div>
            </div>
            
            <div className="total-divider"></div>
            
            <div className="total-section">
              <div className="total-label">{currentYear}</div>
              <div className="total-amount-large">${yearTotal.toFixed(2)}</div>
              <div className="total-subtitle">Year Total</div>
            </div>
          </div>
        </div>

        {/* Show error if any */}
        {entriesError && (
          <div className="error-message">
            Error loading entries. Please refresh the page.
          </div>
        )}

        {/* Show loading state for entries */}
        {entriesLoading ? (
          <div className="entries-loading">Loading your work entries...</div>
        ) : (
          <Calendar
            entries={entries}
            onDateClick={handleDateClick}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        )}

        {/* Day modal */}
        {selectedDate && (
          <DayModal
            date={selectedDate}
            entries={entriesForSelectedDate}
            onClose={handleCloseModal}
            onAddEntry={addEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
      </div>
    </div>
  )
}

export default App
