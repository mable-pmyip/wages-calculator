// MPF (Mandatory Provident Fund) calculation for Hong Kong
// Based on monthly income brackets

export const calculateMPFDeduction = (monthlyIncome: number): number => {
  // Below HK$ 7,100: 0% employee contribution
  if (monthlyIncome < 7100) {
    return 0
  }
  
  // HK$ 7,100 - 30,000: 5% employee contribution
  if (monthlyIncome <= 30000) {
    return monthlyIncome * 0.05
  }
  
  // Above HK$ 30,000: HK$ 1,500 max employee contribution
  return 1500
}

export const calculateNetWages = (grossWages: number, deductMPF: boolean): number => {
  if (!deductMPF) {
    return grossWages
  }
  
  const mpfDeduction = calculateMPFDeduction(grossWages)
  return grossWages - mpfDeduction
}
