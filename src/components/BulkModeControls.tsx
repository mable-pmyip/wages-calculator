import styled from 'styled-components'

interface BulkModeControlsProps {
  isBulkMode: boolean
  selectedDays: string[]
  onToggleBulkMode: () => void
  onOpenBulkModal: () => void
}

const Container = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const BulkModeButton = styled.button<{ $isActive?: boolean }>`
  padding: 0.75rem 1.25rem;
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
    : 'linear-gradient(145deg, #2a2a2a 0%, #252525 100%)'};
  color: ${props => props.$isActive ? '#000' : '#e5e5e5'};
  border: 2px solid ${props => props.$isActive ? '#4ade80' : '#3a3a3a'};
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isActive ? '0 4px 12px rgba(74, 222, 128, 0.3)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
    border-color: #4ade80;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
  }
`

const BulkModeInfo = styled.div`
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(74, 222, 128, 0.1);
  border: 2px solid rgba(74, 222, 128, 0.3);
  border-radius: 10px;
  color: #4ade80;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;

  @media (max-width: 640px) {
    width: 100%;
    font-size: 0.85rem;
  }
`

const BulkAddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 222, 128, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
`

export const BulkModeControls = ({ isBulkMode, selectedDays, onToggleBulkMode, onOpenBulkModal }: BulkModeControlsProps) => {
  return (
    <Container>
      <BulkModeButton 
        $isActive={isBulkMode}
        onClick={onToggleBulkMode}
      >
        {isBulkMode ? '✓ Bulk Mode Active' : '📅 Enable Bulk Add'}
      </BulkModeButton>
      {isBulkMode && selectedDays.length > 0 && (
        <>
          <BulkModeInfo>
            {selectedDays.length} {selectedDays.length === 1 ? 'day' : 'days'} selected
          </BulkModeInfo>
          <BulkAddButton onClick={onOpenBulkModal}>
            Add Entry to {selectedDays.length} {selectedDays.length === 1 ? 'Day' : 'Days'}
          </BulkAddButton>
        </>
      )}
      {isBulkMode && selectedDays.length === 0 && (
        <BulkModeInfo>
          Click on calendar days to select them
        </BulkModeInfo>
      )}
    </Container>
  )
}
