import styled from 'styled-components'
import type { WorkEntry } from '../types'

interface CalendarProps {
  entries: WorkEntry[]
  onDateClick: (date: string) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
  isBulkMode?: boolean
  selectedDays?: string[]
}

const CalendarContainer = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    padding: 1rem 0.75rem;
  }
`

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    margin-bottom: 1.25rem;
  }
`

const MonthYear = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #e5e5e5;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    gap: 0.5rem;

    h2 {
      font-size: 1.1rem;
    }
  }
`

const MonthNavButton = styled.button`
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  color: #e5e5e5;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    color: #000;
    border-color: transparent;
    transform: scale(1.05);
  }

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
`

const TodayButton = styled.button`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4285f4 0%, #4285f4 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
  }
`

const CalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  div {
    text-align: center;
    font-weight: 600;
    color: #a0a0a0;
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  @media (max-width: 640px) {
    margin-bottom: 0.75rem;

    div {
      font-size: 0.65rem;
      padding: 0.3rem 0.1rem;
    }
  }
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;

  @media (max-width: 640px) {
    gap: 0.35rem;
  }
`

const CalendarDay = styled.div<{ $hasEntries?: boolean; $isToday?: boolean; $isEmpty?: boolean; $isSelected?: boolean }>`
  aspect-ratio: 1;
  background: ${props => 
    props.$isEmpty ? 'transparent' :
    props.$isSelected ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.3) 0%, rgba(74, 222, 128, 0.2) 100%)' :
    props.$hasEntries ? 'rgba(74, 222, 128, 0.15)' : '#2a2a2a'};
  border: ${props => 
    props.$isEmpty ? 'none' :
    props.$isSelected ? '3px dashed #4ade80' :
    props.$hasEntries ? '2px solid #4ade80' : '2px solid #3a3a3a'};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: ${props => props.$isEmpty ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  max-height: 100px;
  overflow: hidden;
  position: relative;

  ${props => props.$isSelected && `
    box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.3), inset 0 0 20px rgba(74, 222, 128, 0.2);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
      color: #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 900;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }
  `}

  &:not(:first-child):hover {
    ${props => !props.$isEmpty && `
      border-color: #4ade80;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
      background: rgba(74, 222, 128, 0.2);
    `}
  }

  @media (max-width: 640px) {
    min-height: 48px;
    max-height: 48px;
    padding: 0.25rem 0.15rem;
    border-radius: 6px;
    
    ${props => props.$isSelected && `
      &::after {
        width: 16px;
        height: 16px;
        top: 2px;
        right: 2px;
        font-size: 0.65rem;
      }
    `}
  }
`

const DayNumber = styled.div<{ $isToday?: boolean }>`
  font-weight: 600;
  font-size: 1rem;
  color: #e5e5e5;

  ${props => props.$isToday && `
    background: linear-gradient(135deg, #4285f4 0%, #4285f4 100%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    box-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
  `}

  @media (max-width: 640px) {
    font-size: 0.75rem;

    ${props => props.$isToday && `
      width: 24px;
      height: 24px;
      font-size: 0.7rem;
    `}
  }
`

const DayTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
`

const EntryCount = styled.span`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(74, 222, 128, 0.3);

  @media (max-width: 640px) {
    display: none;
  }
`

const EntryAmount = styled.span`
  color: #4ade80;
  font-weight: 700;
  font-size: 0.8rem;

  @media (max-width: 640px) {
    font-size: 0.55rem;
  }
`

export const Calendar = ({ entries, onDateClick, currentMonth, onMonthChange, isBulkMode = false, selectedDays = [] }: CalendarProps) => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Get entries grouped by date
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = []
    }
    acc[entry.date].push(entry)
    return acc
  }, {} as Record<string, WorkEntry[]>)

  // Calculate total wages for each date
  const totalsByDate = Object.entries(entriesByDate).reduce((acc, [date, dateEntries]) => {
    acc[date] = dateEntries.reduce((sum, entry) => sum + entry.totalWages, 0)
    return acc
  }, {} as Record<string, number>)

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    onMonthChange(new Date())
  }

  const renderCalendarDays = () => {
    const days = []
    const today = new Date().toISOString().split('T')[0]

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<CalendarDay key={`empty-${i}`} $isEmpty />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const hasEntries = entriesByDate[dateStr]
      const totalForDay = totalsByDate[dateStr] || 0
      const isToday = dateStr === today
      const isSelected = isBulkMode && selectedDays.includes(dateStr)

      days.push(
        <CalendarDay
          key={day}
          $hasEntries={!!hasEntries}
          $isToday={isToday}
          $isSelected={isSelected}
          onClick={() => onDateClick(dateStr)}
        >
          <DayNumber $isToday={isToday}>{day}</DayNumber>
          {hasEntries && (
            <DayTotal>
              <EntryCount>{entriesByDate[dateStr].length}</EntryCount>
              <EntryAmount>${totalForDay.toFixed(0)}</EntryAmount>
            </DayTotal>
          )}
        </CalendarDay>
      )
    }

    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavButton onClick={handlePrevMonth}>←</MonthNavButton>
        <MonthYear>
          <h2>{monthNames[month]} {year}</h2>
          <TodayButton onClick={handleToday}>Today</TodayButton>
        </MonthYear>
        <MonthNavButton onClick={handleNextMonth}>→</MonthNavButton>
      </CalendarHeader>

      <CalendarWeekdays>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </CalendarWeekdays>

      <CalendarGrid>
        {renderCalendarDays()}
      </CalendarGrid>
    </CalendarContainer>
  )
}
