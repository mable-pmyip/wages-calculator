import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useAuth } from './hooks/useAuth'
import { useWorkEntries } from './hooks/useWorkEntries'
import { useUserSettings } from './hooks/useUserSettings'
import { calculateNetWages } from './utils/mpf'
import { Login } from './components/Login'
import { Calendar } from './components/Calendar'
import { DayModal } from './components/DayModal'

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

const AppHeader = styled.header`
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    flex-direction: row;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
`

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  color: #e5e5e5;
  text-decoration: none;
  font-size: 1.8rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: #4ade80;
  }

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  @media (max-width: 640px) {
    justify-content: flex-end;
    gap: 8px;
  }
`

const UserMenuContainer = styled.div`
  position: relative;
`

const UserTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.1);

    img {
      border-color: #22c55e;
      box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
    }

    span {
      color: #4ade80;
    }
  }
`

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4ade80;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
  }
`

const UserName = styled.span`
  font-weight: 500;
  color: #e5e5e5;
  font-size: 16px;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    display: none;
  }
`

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 12px;
  min-width: 240px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease-out;
  backdrop-filter: blur(10px);

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const DropdownDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(74, 222, 128, 0.3) 50%, transparent 100%);
  margin: 4px 0;
`

const DropdownItem = styled.div`
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #e5e5e5;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: linear-gradient(90deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.05) 100%);
    padding-left: 22px;
  }

  &:active {
    background: rgba(74, 222, 128, 0.2);
  }
`

const MPFToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  width: 100%;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #4ade80;
    border-radius: 4px;
  }

  span {
    flex: 1;
    user-select: none;
    font-weight: 500;
    letter-spacing: 0.2px;
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

const TotalCard = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    padding: 1.25rem 0.75rem;
  }
`

const TotalsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr auto 1fr;
    gap: 0.75rem;
  }
`

const TotalSection = styled.div`
  text-align: center;
`

const TotalDivider = styled.div`
  width: 2px;
  height: 80px;
  background: linear-gradient(180deg, transparent 0%, #4ade80 50%, transparent 100%);
  opacity: 0.3;

  @media (max-width: 640px) {
    width: 1px;
    height: 60px;
  }
`

const TotalLabel = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
  font-weight: 500;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 640px) {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
  }
`

const TotalAmountLarge = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const TotalSubtitle = styled.div`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;

  @media (max-width: 640px) {
    font-size: 0.65rem;
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
    setSelectedDate(date)
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
  }

  // Calculate totals for current month and year
  const currentYear = currentMonth.getFullYear()
  const currentMonthNum = currentMonth.getMonth()

  const monthTotalGross = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonthNum
    })
    .reduce((sum, entry) => sum + entry.totalWages, 0)

  const yearTotalGross = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === currentYear
    })
    .reduce((sum, entry) => sum + entry.totalWages, 0)

  // Apply MPF deduction if enabled
  const monthTotal = calculateNetWages(monthTotalGross, settings.deductMPF)
  const yearTotal = calculateNetWages(yearTotalGross, settings.deductMPF)

  const entriesForSelectedDate = selectedDate
    ? entries.filter((entry) => entry.date === selectedDate)
    : []

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
        <AppHeader>
          <GitHubLink
            href="https://github.com/mable-pmyip/wages-calculator"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </GitHubLink>
          
          <UserInfo>
            <UserMenuContainer ref={dropdownRef}>
              <UserTrigger onClick={() => setShowDropdown(!showDropdown)}>
                {user.photoURL && (
                  <UserAvatar
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                  />
                )}
                <UserName>{user.displayName || user.email}</UserName>
              </UserTrigger>
              {showDropdown && (
                <UserDropdown>
                  <DropdownDivider />
                  <DropdownItem onClick={(e) => e.stopPropagation()}>
                    <MPFToggle>
                      <input
                        type="checkbox"
                        checked={settings.deductMPF}
                        onChange={(e) => updateSettings({ deductMPF: e.target.checked })}
                      />
                      <span>Deduct MPF</span>
                    </MPFToggle>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={signOut}>
                    <span>Logout</span>
                  </DropdownItem>
                </UserDropdown>
              )}
            </UserMenuContainer>
          </UserInfo>
        </AppHeader>

        <Title>💰 Wages Calculator</Title>
        <Subtitle>Track your work hours and calculate total earnings</Subtitle>

        {/* Total earnings card at the top */}
        <TotalCard>
          <TotalsGrid>
            <TotalSection>
              <TotalLabel>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </TotalLabel>
              <TotalAmountLarge>${monthTotal.toFixed(2)}</TotalAmountLarge>
              <TotalSubtitle>Monthly Total{settings.deductMPF && ' (MPF Deducted)'}</TotalSubtitle>
            </TotalSection>
            
            <TotalDivider />
            
            <TotalSection>
              <TotalLabel>{currentYear}</TotalLabel>
              <TotalAmountLarge>${yearTotal.toFixed(2)}</TotalAmountLarge>
              <TotalSubtitle>
                Year Total{settings.deductMPF && ' (MPF Deducted)'}
              </TotalSubtitle>
            </TotalSection>
          </TotalsGrid>
        </TotalCard>

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
      </Container>
    </AppContainer>
  )
}

export default App
