import styled from 'styled-components'

interface TotalCardProps {
  currentMonth: Date
  monthTotal: number
  monthTotalHours: number
  financialYearLabel: string
  yearTotal: number
  yearTotalHours: number
  deductMPF: boolean
}

const Card = styled.div`
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

const TotalHours = styled.div`
  font-size: 0.95rem;
  color: #fbbf24;
  font-weight: 600;
  margin-top: 0.5rem;

  @media (max-width: 640px) {
    font-size: 0.75rem;
    margin-top: 0.35rem;
  }
`

export const TotalCard = ({ currentMonth, monthTotal, monthTotalHours, financialYearLabel, yearTotal, yearTotalHours, deductMPF }: TotalCardProps) => {
  return (
    <Card>
      <TotalsGrid>
        <TotalSection>
          <TotalLabel>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </TotalLabel>
          <TotalAmountLarge>${monthTotal.toFixed(2)}</TotalAmountLarge>
          <TotalSubtitle>Monthly Total{deductMPF && ' (MPF Deducted)'}</TotalSubtitle>
          <TotalHours>{monthTotalHours.toFixed(1)} work hours</TotalHours>
        </TotalSection>
        
        <TotalDivider />
        
        <TotalSection>
          <TotalLabel>{financialYearLabel}</TotalLabel>
          <TotalAmountLarge>${yearTotal.toFixed(2)}</TotalAmountLarge>
          <TotalSubtitle>
            Financial Year Total{deductMPF && ' (MPF Deducted)'}
          </TotalSubtitle>
          <TotalHours>{yearTotalHours.toFixed(1)} work hours</TotalHours>
        </TotalSection>
      </TotalsGrid>
    </Card>
  )
}
