import { useState } from 'react'
import './App.css'

interface WorkEntry {
  id: number
  workType: string
  startTime: string
  endTime: string
  hourlyWage: number
  totalWages: number
  hoursWorked: number
}

function App() {
  const [workType, setWorkType] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [hourlyWage, setHourlyWage] = useState('')
  const [entries, setEntries] = useState<WorkEntry[]>([])

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0
    const startDate = new Date(`1970-01-01T${start}`)
    const endDate = new Date(`1970-01-01T${end}`)
    
    // Handle overnight shifts
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1)
    }
    
    const diff = endDate.getTime() - startDate.getTime()
    return diff / (1000 * 60 * 60)
  }

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!workType || !startTime || !endTime || !hourlyWage) {
      alert('Please fill in all fields')
      return
    }

    const wage = parseFloat(hourlyWage)
    if (wage <= 0) {
      alert('Hourly wage must be greater than 0')
      return
    }

    const hours = calculateHours(startTime, endTime)
    if (hours <= 0) {
      alert('End time must be after start time')
      return
    }

    const totalWages = hours * wage

    const newEntry: WorkEntry = {
      id: Date.now(),
      workType,
      startTime,
      endTime,
      hourlyWage: wage,
      totalWages,
      hoursWorked: hours
    }

    setEntries([...entries, newEntry])
    
    // Reset form
    setWorkType('')
    setStartTime('')
    setEndTime('')
    setHourlyWage('')
  }

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const grandTotal = entries.reduce((sum, entry) => sum + entry.totalWages, 0)

  return (
    <div className="app">
      <div className="container">
        <h1>💰 Wages Calculator</h1>
        <p className="subtitle">Track your work hours and calculate total earnings</p>

        <form onSubmit={handleAddEntry} className="form">
          <div className="form-group">
            <label htmlFor="workType">Type of Work</label>
            <input
              id="workType"
              type="text"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              placeholder="e.g., Freelance, Part-time, Contract"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="hourlyWage">Hourly Wage ($)</label>
            <input
              id="hourlyWage"
              type="number"
              step="0.01"
              min="0.01"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              placeholder="e.g., 25.00"
              required
            />
          </div>

          <button type="submit" className="add-button">
            + Add Work Entry
          </button>
        </form>

        {entries.length > 0 && (
          <div className="results">
            <h2>Work Entries</h2>
            <div className="entries-list">
              {entries.map((entry) => (
                <div key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <h3>{entry.workType}</h3>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="delete-button"
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                  <div className="entry-details">
                    <div className="detail">
                      <span className="label">Time:</span>
                      <span>{entry.startTime} - {entry.endTime}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Hours:</span>
                      <span>{entry.hoursWorked.toFixed(2)}h</span>
                    </div>
                    <div className="detail">
                      <span className="label">Rate:</span>
                      <span>${entry.hourlyWage.toFixed(2)}/hr</span>
                    </div>
                    <div className="detail total">
                      <span className="label">Total:</span>
                      <span className="amount">${entry.totalWages.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grand-total">
              <span>Total Wages:</span>
              <span className="total-amount">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div className="empty-state">
            <p>📝 No work entries yet. Add your first entry above!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
