import { useState } from 'react'
import styled from 'styled-components'
import type { WorkEntry } from '../types'

interface DayModalProps {
  date: string
  entries: WorkEntry[]
  onClose: () => void
  onAddEntry: (entry: Omit<WorkEntry, 'id'>) => Promise<void>
  onDeleteEntry: (id: string) => Promise<void>
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-in-out;
  padding: 1rem;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ModalContent = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  border-radius: 16px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: slideUp 0.3s ease-out;
  overflow-y: auto;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    max-height: 95vh;
    margin: 0.5rem;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid rgba(74, 222, 128, 0.2);

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #e5e5e5;
  }

  @media (max-width: 640px) {
    padding: 1rem;

    h2 {
      font-size: 1.25rem;
    }
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #a0a0a0;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(74, 222, 128, 0.1);
    color: #4ade80;
  }
`

const ModalBody = styled.div`
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const DaySummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  color: #000;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);

  span:first-child {
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`

const DayTotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

const EntryItem = styled.div`
  padding: 16px;
  background: #1a1a1a;
  border-radius: 12px;
  border: 2px solid #3a3a3a;
  transition: all 0.2s;

  &:hover {
    border-color: #4ade80;
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
  }
`

const EntryItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #e5e5e5;
  }
`

const DeleteButton = styled.button`
  background: #ef4444;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  transition: all 0.2s;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`

const EntryItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #a0a0a0;

  span:last-child {
    font-weight: 700;
    color: #4ade80;
    font-size: 1.1rem;
  }
`

const EmptyDay = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;

  p {
    margin: 0;
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    padding: 2rem;
  }
`

const AddEntryButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 222, 128, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 1.5rem;
  background: #1a1a1a;
  border: 2px solid #3a3a3a;
  border-radius: 12px;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: #e5e5e5;
    font-size: 0.9rem;
  }

  input {
    padding: 12px 16px;
    background: #2a2a2a;
    border: 2px solid #3a3a3a;
    color: #e5e5e5;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #4ade80;
      box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
    }

    &::placeholder {
      color: #666;
    }
  }
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  color: #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4a4a4a;
    background: #3a3a3a;
  }
`

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`

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
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{formattedDate}</h2>
          <CloseButton onClick={onClose} aria-label="Close modal">
            ×
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {entries.length > 0 && (
            <DaySummary>
              <span>Total for this day:</span>
              <DayTotalAmount>${totalForDay.toFixed(2)}</DayTotalAmount>
            </DaySummary>
          )}

          <EntriesList>
            {entries.map((entry) => (
              <EntryItem key={entry.id}>
                <EntryItemHeader>
                  <h3>{entry.workType}</h3>
                  <DeleteButton
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label="Delete entry"
                  >
                    ×
                  </DeleteButton>
                </EntryItemHeader>
                <EntryItemDetails>
                  <span>{entry.startTime} - {entry.endTime}</span>
                  <span>{entry.hoursWorked.toFixed(2)}h</span>
                  <span>${entry.hourlyWage.toFixed(2)}/hr</span>
                  <span>${entry.totalWages.toFixed(2)}</span>
                </EntryItemDetails>
              </EntryItem>
            ))}

            {entries.length === 0 && !isAdding && (
              <EmptyDay>
                <p>No work entries for this day</p>
              </EmptyDay>
            )}
          </EntriesList>

          {!isAdding ? (
            <AddEntryButton onClick={() => setIsAdding(true)}>
              + Add Work Entry
            </AddEntryButton>
          ) : (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="modal-workType">Type of Work</label>
                <input
                  id="modal-workType"
                  type="text"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="e.g., Freelance, Part-time"
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label htmlFor="modal-startTime">Start Time</label>
                  <input
                    id="modal-startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="modal-endTime">End Time</label>
                  <input
                    id="modal-endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
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
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={() => setIsAdding(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  Add Entry
                </SubmitButton>
              </FormActions>
            </Form>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}
