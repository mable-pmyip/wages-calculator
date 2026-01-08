// MPF (Mandatory Provident Fund) calculation for Hong Kong
// Based on monthly income brackets

export interface WorkEntry {
  type: string
  income: number
}

// Calculate MPF for a single income source
const calculateSingleMPF = (income: number): number => {
  // Below HK$ 7,100: 0% employee contribution
  if (income < 7100) {
    return 0
  }
  
  // HK$ 7,100 - 30,000: 5% employee contribution
  if (income <= 30000) {
    return income * 0.05
  }
  
  // Above HK$ 30,000: HK$ 1,500 max employee contribution
  return 1500
}

// Calculate MPF grouped by work type
// Each work type is treated separately for MPF calculation
export const calculateMPFDeduction = (workEntries: WorkEntry[]): number => {
  return workEntries.reduce((total, entry) => {
    return total + calculateSingleMPF(entry.income)
  }, 0)
}

// Legacy function for backward compatibility - calculates MPF on total income
export const calculateMPFDeductionSimple = (monthlyIncome: number): number => {
  return calculateSingleMPF(monthlyIncome)
}

export const calculateNetWages = (grossWages: number, deductMPF: boolean): number => {
  if (!deductMPF) {
    return grossWages
  }
  
  const mpfDeduction = calculateMPFDeductionSimple(grossWages)
  return grossWages - mpfDeduction
}

// Calculate net wages with work type breakdown
export const calculateNetWagesByWorkType = (workEntries: WorkEntry[], deductMPF: boolean): number => {
  const totalIncome = workEntries.reduce((sum, entry) => sum + entry.income, 0)
  
  if (!deductMPF) {
    return totalIncome
  }
  
  const mpfDeduction = calculateMPFDeduction(workEntries)
  return totalIncome - mpfDeduction
}
