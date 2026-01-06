import { useState } from 'react'
import type { WorkEntry } from '../types'

interface DayModalProps {
  date: string
  entries: WorkEntry[]
  onClose: () => void
  onAddEntry: (entry: Omit<WorkEntry, 'id'>) => Promise<void>
  onDeleteEntry: (id: string) => Promise<void>
}

export const DayModal = ({ date, entries, onClose, onAddEntry, onDeleteEntry }: DayModalProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [workType, setWorkType] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [hourlyWage, setHourlyWage] = useState('')

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0
    const startDate = new Date(`1970-01-01T${start}`)
    const endDate = new Date(`1970-01-01T${end}`)

    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1)
    }

    const diff = endDate.getTime() - startDate.getTime()
    return diff / (1000 * 60 * 60)
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    const newEntry = {
      workType,
      date,
      startTime,
      endTime,
      hourlyWage: wage,
      totalWages,
      hoursWorked: hours
    }

    try {
      await onAddEntry(newEntry)
      setWorkType('')
      setStartTime('')
      setEndTime('')
      setHourlyWage('')
      setIsAdding(false)
    } catch (error) {
      alert('Failed to add entry. Please try again.')
    }
  }

  const totalForDay = entries.reduce((sum, entry) => sum + entry.totalWages, 0)
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formattedDate}</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          {entries.length > 0 && (
            <div className="day-summary">
              <span>Total for this day:</span>
              <span className="day-total-amount">${totalForDay.toFixed(2)}</span>
            </div>
          )}

          <div className="entries-list-modal">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-item">
                <div className="entry-item-header">
                  <h3>{entry.workType}</h3>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="delete-btn-small"
                    aria-label="Delete entry"
                  >
                    ×
                  </button>
                </div>
                <div className="entry-item-details">
                  <span>{entry.startTime} - {entry.endTime}</span>
                  <span>{entry.hoursWorked.toFixed(2)}h</span>
                  <span>${entry.hourlyWage.toFixed(2)}/hr</span>
                  <span className="entry-item-total">${entry.totalWages.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {entries.length === 0 && !isAdding && (
              <div className="empty-day">
                <p>No work entries for this day</p>
              </div>
            )}
          </div>

          {!isAdding ? (
            <button onClick={() => setIsAdding(true)} className="add-entry-btn">
              + Add Work Entry
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group-modal">
                <label htmlFor="modal-workType">Type of Work</label>
                <input
                  id="modal-workType"
                  type="text"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="e.g., Freelance, Part-time"
                  required
                />
              </div>

              <div className="form-row-modal">
                <div className="form-group-modal">
                  <label htmlFor="modal-startTime">Start Time</label>
                  <input
                    id="modal-startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-modal">
                  <label htmlFor="modal-endTime">End Time</label>
                  <input
                    id="modal-endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-modal">
                <label htmlFor="modal-hourlyWage">Hourly Wage ($)</label>
                <input
                  id="modal-hourlyWage"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(e.target.value)}
                  placeholder="e.g., 25.00"
                  required
                />
              </div>

              <div className="modal-form-actions">
                <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Entry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
