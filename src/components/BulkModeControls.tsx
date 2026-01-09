import styled from 'styled-components'

interface BulkModeControlsProps {
  selectedDays: string[]
  onOpenBulkModal: () => void
  onClearSelection: () => void
}

const Container = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.12) 0%, rgba(74, 222, 128, 0.05) 100%);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 2px solid rgba(74, 222, 128, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 640px) {
    width: 100%;
    flex-direction: column;
  }
`

const AddButton = styled.button`
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
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

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.75rem 1rem;
  }
`

const ClearButton = styled.button`
  padding: 0.65rem 1rem;
  background: transparent;
  color: #a0a0a0;
  border: 2px solid #3a3a3a;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.65rem 1rem;
  }
`

export const BulkModeControls = ({ selectedDays, onOpenBulkModal, onClearSelection }: BulkModeControlsProps) => {
  if (selectedDays.length === 0) return null

  console.log('hello')

  return (
    <Container>
      <ButtonGroup>
        <AddButton onClick={onOpenBulkModal}>
          {selectedDays.length === 1 ? 'Add/Edit Entry' :
          `Add Entry to ${selectedDays.length} Days`}
        </AddButton>
        <ClearButton onClick={onClearSelection}>
          Clear
        </ClearButton>
      </ButtonGroup>
    </Container>
  )
}
