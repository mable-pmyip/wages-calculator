import { useState } from 'react'
import styled from 'styled-components'
import type { WorkEntry } from '../types'
import { WorkTypeModal } from './WorkTypeModal'

interface MonthlyAnalysisProps {
  currentMonth: Date
  workTypeData: Array<{
    workType: string
    total: number
    percentage: number
    color: string
    entries: WorkEntry[]
  }>
  isYearly?: boolean
  yearLabel?: string
}

const Section = styled.div`
  background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
  border-radius: 16px;
  border: 1px solid rgba(74, 222, 128, 0.2);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin-top: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (max-width: 640px) {
    margin-top: 1.5rem;
  }
`

const Header = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: none;
  border: none;
  color: #e5e5e5;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(74, 222, 128, 0.1);

  &:hover {
    background: rgba(74, 222, 128, 0.05);
  }

  @media (max-width: 640px) {
    padding: 1rem 1.25rem;
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .count {
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    color: #000;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
  }

  @media (max-width: 640px) {
    gap: 0.65rem;

    h3 {
      font-size: 1rem;
    }

    .count {
      font-size: 0.75rem;
      padding: 0.2rem 0.6rem;
    }
  }
`

const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  transform: ${props => props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: #4ade80;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`

const Content = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
`

const Body = styled.div`
  padding: 1.5rem 2rem 2rem;

  @media (max-width: 640px) {
    padding: 1rem 1.25rem 1.5rem;
  }
`

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, #1f1f1f 0%, #1a1a1a 100%);
  border-radius: 12px;
  border: 2px solid #3a3a3a;

  @media (max-width: 640px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }
`

const PieChartWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`

const PieChartSvg = styled.svg`
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
`

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;

  @media (max-width: 640px) {
    width: 100%;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(74, 222, 128, 0.05);
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    background: rgba(74, 222, 128, 0.15);
    border-color: #4ade80;
  }
`

const LegendColor = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.$color};
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`

const LegendLabel = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: #e5e5e5;
  font-weight: 500;

  @media (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const LegendValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;

  .amount {
    font-weight: 700;
    color: #4ade80;
    font-size: 1rem;
  }

  .percentage {
    font-size: 0.75rem;
    color: #a0a0a0;
  }

  @media (max-width: 640px) {
    .amount {
      font-size: 0.9rem;
    }

    .percentage {
      font-size: 0.7rem;
    }
  }
`

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;

  @media (max-width: 640px) {
    padding: 1.5rem;
    font-size: 0.9rem;
  }
`

// Helper function to create pie chart path
const createPieSlice = (startAngle: number, endAngle: number, radius: number) => {
  const x1 = radius + radius * Math.cos(startAngle)
  const y1 = radius + radius * Math.sin(startAngle)
  const x2 = radius + radius * Math.cos(endAngle)
  const y2 = radius + radius * Math.sin(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  
  return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export const MonthlyAnalysis = ({ currentMonth, workTypeData, isYearly = false, yearLabel }: MonthlyAnalysisProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null)

  const displayLabel = isYearly 
    ? yearLabel || 'Financial Year'
    : currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const selectedWorkTypeData = selectedWorkType 
    ? workTypeData.find(wt => wt.workType === selectedWorkType)
    : null

  return (
    <>
      <Section>
        <Header onClick={() => setIsExpanded(!isExpanded)}>
          <Title>
            <h3>{isYearly ? 'Financial Year' : 'Monthly'} Analysis - {displayLabel}</h3>
          </Title>
          <ExpandIcon $isExpanded={isExpanded}>
            ▼
          </ExpandIcon>
        </Header>
        <Content $isExpanded={isExpanded}>
          <Body>
            {workTypeData.length === 0 ? (
              <EmptyMessage>
                No entries for this month yet. Start tracking your work!
              </EmptyMessage>
            ) : (
              <PieChartContainer>
                <PieChartWrapper>
                  <PieChartSvg width="200" height="200" viewBox="0 0 200 200">
                    {workTypeData.map((data, index) => {
                      const startAngle = workTypeData
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.percentage / 100) * 2 * Math.PI, -Math.PI / 2)
                      const endAngle = startAngle + (data.percentage / 100) * 2 * Math.PI
                      const path = createPieSlice(startAngle, endAngle, 100)
                      
                      return (
                        <path
                          key={data.workType}
                          d={path}
                          fill={data.color}
                          opacity="0.9"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedWorkType(data.workType)}
                        />
                      )
                    })}
                  </PieChartSvg>
                  <Legend>
                    {workTypeData.map(data => (
                      <LegendItem 
                        key={data.workType}
                        onClick={() => setSelectedWorkType(data.workType)}
                      >
                        <LegendColor $color={data.color} />
                        <LegendLabel>{data.workType}</LegendLabel>
                        <LegendValue>
                          <div className="amount">${data.total.toFixed(2)}</div>
                          <div className="percentage">{data.percentage.toFixed(1)}%</div>
                        </LegendValue>
                      </LegendItem>
                    ))}
                  </Legend>
                </PieChartWrapper>
              </PieChartContainer>
            )}
          </Body>
        </Content>
      </Section>

      {/* Work Type Modal */}
      {selectedWorkTypeData && (
        <WorkTypeModal
          workType={selectedWorkTypeData.workType}
          entries={selectedWorkTypeData.entries}
          color={selectedWorkTypeData.color}
          total={selectedWorkTypeData.total}
          onClose={() => setSelectedWorkType(null)}
        />
      )}
    </>
  )
}
