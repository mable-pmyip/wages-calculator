import type { WorkEntry } from '../types'

interface CalendarProps {
  entries: WorkEntry[]
  onDateClick: (date: string) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export const Calendar = ({ entries, onDateClick, currentMonth, onMonthChange }: CalendarProps) => {
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
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const hasEntries = entriesByDate[dateStr]
      const totalForDay = totalsByDate[dateStr] || 0
      const isToday = dateStr === today

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasEntries ? 'has-entries' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => onDateClick(dateStr)}
        >
          <div className="day-number">{day}</div>
          {hasEntries && (
            <div className="day-total">
              <span className="entry-count">{entriesByDate[dateStr].length}</span>
              <span className="entry-amount">${totalForDay.toFixed(0)}</span>
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="month-nav-btn">←</button>
        <div className="month-year">
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={handleToday} className="today-btn">Today</button>
        </div>
        <button onClick={handleNextMonth} className="month-nav-btn">→</button>
      </div>

      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  )
}
