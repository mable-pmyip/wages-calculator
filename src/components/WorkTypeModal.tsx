import styled from 'styled-components'
import type { WorkEntry } from '../types'

interface WorkTypeModalProps {
  workType: string
  entries: WorkEntry[]
  color: string
  total: number
  onClose: () => void
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

const Summary = styled.div`
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

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DateGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(74, 222, 128, 0.08);
  border-left: 4px solid #4ade80;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(74, 222, 128, 0.12);
  }

  @media (max-width: 640px) {
    padding: 0.6rem 0.85rem;
    margin-bottom: 0.6rem;
  }
`

const DateLabel = styled.div`
  font-weight: 600;
  color: #e5e5e5;
  font-size: 0.95rem;

  @media (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const EntryCard = styled.div`
  padding: 1rem 1.25rem;
  background: linear-gradient(145deg, #1f1f1f 0%, #1a1a1a 100%);
  border-radius: 10px;
  border: 2px solid #3a3a3a;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
    opacity: 0.5;
  }

  &:hover {
    border-color: #4ade80;
    transform: translateX(2px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    padding: 0.85rem 1rem;
    margin-bottom: 0.6rem;
  }
`

const EntryCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;

  @media (max-width: 640px) {
    margin-bottom: 0.5rem;
  }
`

const EntryWorkType = styled.div`
  font-weight: 600;
  color: #e5e5e5;
  font-size: 1rem;

  @media (max-width: 640px) {
    font-size: 0.9rem;
  }
`

const EntrySubtotalBadge = styled.div`
  font-weight: 800;
  color: #4ade80;
  font-size: 1.15rem;
  letter-spacing: -0.3px;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`

const EntryDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  font-size: 0.875rem;
  color: #a0a0a0;

  span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  @media (max-width: 640px) {
    font-size: 0.8rem;
    gap: 0.65rem;
  }
`

export const WorkTypeModal = ({ workType, entries, total, onClose }: WorkTypeModalProps) => {
  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = []
    }
    acc[entry.date].push(entry)
    return acc
  }, {} as Record<string, typeof entries>)

  // Sort dates in descending order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{workType}</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Summary>
            <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
            <span>Total: ${total.toFixed(2)}</span>
          </Summary>
          <EntriesList>
            {sortedDates.map(date => {
              const dateEntries = entriesByDate[date]
              const dateTotal = dateEntries.reduce((sum, entry) => sum + entry.totalWages, 0)
              
              return (
                <div key={date}>
                  <DateGroupHeader>
                    <DateLabel>{formatDate(date)}</DateLabel>
                    <EntrySubtotalBadge>${dateTotal.toFixed(2)}</EntrySubtotalBadge>
                  </DateGroupHeader>
                  {dateEntries.map(entry => (
                    <EntryCard key={entry.id}>
                      <EntryCardHeader>
                        <EntryWorkType>{entry.workType}</EntryWorkType>
                        <EntrySubtotalBadge>${entry.totalWages.toFixed(2)}</EntrySubtotalBadge>
                      </EntryCardHeader>
                      <EntryDetails>
                        <span>🕐 Start: {entry.startTime}</span>
                        <span>⏱️ Duration: {entry.hoursWorked.toFixed(2)} hrs</span>
                        <span>💵 Rate: ${entry.hourlyWage.toFixed(2)}/hr</span>
                      </EntryDetails>
                    </EntryCard>
                  ))}
                </div>
              )
            })}
          </EntriesList>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  )
}
