import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useAuth } from './hooks/useAuth'
import { useWorkEntries } from './hooks/useWorkEntries'
import { useUserSettings } from './hooks/useUserSettings'
import { calculateNetWages } from './utils/mpf'
import { Login } from './components/Login'
import { Calendar } from './components/Calendar'
import { DayModal } from './components/DayModal'
import { Header } from './components/Header'
import { TotalCard } from './components/TotalCard'
import { BulkModeControls } from './components/BulkModeControls'
import { MonthlyAnalysis } from './components/MonthlyAnalysis'

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #e5e5e5;
  padding: 0;
  transition: all 0.3s ease;
`

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`

const Title = styled.h1`
  color: #e5e5e5;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(135deg, #22c55e 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`

const Subtitle = styled.p`
  color: #a0a0a0;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;

  @media (max-width: 640px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ef4444;
  margin-bottom: 16px;
  font-size: 0.9rem;
`

const EntriesLoading = styled.div`
  text-align: center;
  padding: 32px;
  color: #a0a0a0;
  font-style: italic;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #1a1a1a;
  gap: 16px;
  color: #e5e5e5;
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #2a2a2a;
  border-top: 4px solid #4ade80;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Generate colors for pie chart
const colors = [
  '#4ade80', // green
  '#60a5fa', // blue
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
]

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

  // User settings
  const { settings, updateSettings } = useUserSettings(user?.uid || null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteEntry(id)
    } catch (error) {
      alert('Failed to delete entry. Please try again.')
    }
  }

  const handleDateClick = (date: string) => {
    if (isBulkMode) {
      // Toggle day selection in bulk mode
      setSelectedDays(prev => 
        prev.includes(date) 
          ? prev.filter(d => d !== date)
          : [...prev, date].sort()
      )
    } else {
      setSelectedDate(date)
    }
  }

  const handleOpenBulkModal = () => {
    if (selectedDays.length > 0) {
      // Use the first selected day as the date for the modal
      setSelectedDate(selectedDays[0])
    }
  }

  const handleBulkModeToggle = () => {
    setIsBulkMode(!isBulkMode)
    setSelectedDays([])
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
    if (isBulkMode) {
      setSelectedDays([])
      setIsBulkMode(false)
    }
  }

  // Calculate totals for current month and financial year
  const currentYear = currentMonth.getFullYear()
  const currentMonthNum = currentMonth.getMonth()

  const monthTotalGross = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonthNum
    })
    .reduce((sum, entry) => sum + entry.totalWages, 0)

  // Financial year runs from April 1 to March 31
  // If current month is Jan-Mar (0-2), FY is (currentYear-1)/(currentYear)
  // If current month is Apr-Dec (3-11), FY is (currentYear)/(currentYear+1)
  const financialYearStart = currentMonthNum < 3 ? currentYear - 1 : currentYear
  const financialYearEnd = financialYearStart + 1
  const financialYearLabel = `FY ${financialYearStart}/${String(financialYearEnd).slice(-2)}`

  const yearTotalGross = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      const entryYear = entryDate.getFullYear()
      const entryMonth = entryDate.getMonth()
      
      // Entry is in financial year if:
      // - It's in financialYearStart and month >= 3 (April onwards), OR
      // - It's in financialYearEnd and month < 3 (January to March)
      return (entryYear === financialYearStart && entryMonth >= 3) ||
             (entryYear === financialYearEnd && entryMonth < 3)
    })
    .reduce((sum, entry) => sum + entry.totalWages, 0)

  // Apply MPF deduction if enabled
  const monthTotal = calculateNetWages(monthTotalGross, settings.deductMPF)
  const yearTotal = calculateNetWages(yearTotalGross, settings.deductMPF)

  const entriesForSelectedDate = selectedDate
    ? entries.filter((entry) => entry.date === selectedDate)
    : []

  // Get entries for current month, grouped by work type
  const monthEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonthNum
  })

  // Group entries by work type
  const entriesByWorkType = monthEntries.reduce((acc, entry) => {
    if (!acc[entry.workType]) {
      acc[entry.workType] = []
    }
    acc[entry.workType].push(entry)
    return acc
  }, {} as Record<string, typeof entries>)

  // Sort work types alphabetically
  const sortedWorkTypes = Object.keys(entriesByWorkType).sort()

  // Calculate work type data for pie chart
  const workTypeData = sortedWorkTypes.map((workType, index) => {
    const workTypeEntries = entriesByWorkType[workType]
    const total = workTypeEntries.reduce((sum, entry) => sum + entry.totalWages, 0)
    const percentage = monthTotal > 0 ? (total / monthTotalGross) * 100 : 0
    return {
      workType,
      total,
      percentage,
      color: colors[index % colors.length],
      entries: workTypeEntries
    }
  })

  // Show loading screen during initial auth check
  if (authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading...</p>
      </LoadingContainer>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Login />
  }

  // Main app (authenticated users only)
  return (
    <AppContainer>
      <Container>
        {/* Header with GitHub and user info */}
        <Header
          user={user}
          signOut={signOut}
          settings={settings}
          updateSettings={updateSettings}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          dropdownRef={dropdownRef}
        />

        <Title>💰 Wages Calculator</Title>
        <Subtitle>Track your work hours and calculate total earnings</Subtitle>

        {/* Total earnings card at the top */}
        <TotalCard
          currentMonth={currentMonth}
          monthTotal={monthTotal}
          financialYearLabel={financialYearLabel}
          yearTotal={yearTotal}
          deductMPF={settings.deductMPF}
        />

        {/* Show error if any */}
        {entriesError && (
          <ErrorMessage>
            Error loading entries. Please refresh the page.
          </ErrorMessage>
        )}

        {/* Show loading state for entries */}
        {entriesLoading ? (
          <EntriesLoading>Loading your work entries...</EntriesLoading>
        ) : (
          <>
            {/* Bulk Mode Controls */}
            <BulkModeControls
              isBulkMode={isBulkMode}
              selectedDays={selectedDays}
              onToggleBulkMode={handleBulkModeToggle}
              onOpenBulkModal={handleOpenBulkModal}
            />

            <Calendar
              entries={entries}
              onDateClick={handleDateClick}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              isBulkMode={isBulkMode}
              selectedDays={selectedDays}
            />

            {/* Monthly Analysis */}
            <MonthlyAnalysis
              currentMonth={currentMonth}
              workTypeData={workTypeData}
            />
          </>
        )}

        {/* Day modal */}
        {selectedDate && (
          <DayModal
            date={selectedDate}
            entries={entriesForSelectedDate}
            onClose={handleCloseModal}
            onAddEntry={addEntry}
            onDeleteEntry={handleDeleteEntry}
            isBulkMode={isBulkMode}
            selectedDays={selectedDays}
          />
        )}
      </Container>
    </AppContainer>
  )
}

export default App
