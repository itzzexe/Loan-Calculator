// Advanced financial calculations for time value of money

/**
 * Calculate monthly loan payment
 * @param {number} principal - Principal amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Loan term in years
 * @returns {number} Monthly payment
 */
export const calculateMonthlyPayment = (principal, annualRate, years) => {
  if (principal <= 0 || annualRate < 0 || years <= 0) {
    throw new Error('Values must be positive')
  }

  if (annualRate === 0) {
    return principal / (years * 12)
  }

  const monthlyRate = annualRate / 100 / 12
  const numberOfPayments = years * 12

  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  return monthlyPayment
}

/**
 * Calculate total interest paid
 * @param {number} monthlyPayment - Monthly payment
 * @param {number} years - Loan term in years
 * @param {number} principal - Principal amount
 * @returns {number} Total interest
 */
export const calculateTotalInterest = (monthlyPayment, years, principal) => {
  const totalPayments = monthlyPayment * years * 12
  return totalPayments - principal
}

/**
 * Generate amortization schedule
 * @param {number} principal - Principal amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Loan term in years
 * @param {number} extraPayment - Monthly extra payment
 * @param {Date} startDate - Start date
 * @returns {Array} Amortization schedule
 */
export const generateAmortizationSchedule = (principal, annualRate, years, extraPayment = 0, startDate = new Date()) => {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years)
  
  const schedule = []
  let remainingBalance = principal
  let paymentNumber = 1
  let currentDate = new Date(startDate)
  let cumulativeInterest = 0

  while (remainingBalance > 0.01 && paymentNumber <= years * 12 * 2) { // Maximum limit for protection
    const interestPayment = remainingBalance * monthlyRate
    cumulativeInterest += interestPayment
    
    // Ensure we don't exceed remaining balance
    let principalPayment = Math.min(
      monthlyPayment - interestPayment + extraPayment,
      remainingBalance
    )
    
    const totalPayment = interestPayment + principalPayment
    remainingBalance -= principalPayment

    schedule.push({
      paymentNumber,
      date: new Date(currentDate),
      monthlyPayment: totalPayment,
      principalPayment,
      interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
      cumulativeInterest
    })

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1)
    paymentNumber++
  }

  return schedule
}

/**
 * Calculate future value of investment
 * @param {number} presentValue - Present value
 * @param {number} monthlyContribution - Monthly deposit
 * @param {number} annualRate - Annual return rate (%)
 * @param {number} years - Investment period in years
 * @param {number} compoundingFrequency - Compounding frequency per year (default: 12 monthly)
 * @returns {Object} Investment details
 */
export const calculateFutureValue = (presentValue, monthlyContribution, annualRate, years, compoundingFrequency = 12) => {
  const rate = annualRate / 100
  const periods = years * compoundingFrequency
  const periodicRate = rate / compoundingFrequency

  // Future value of present amount
  const futureValuePV = presentValue * Math.pow(1 + periodicRate, periods)

  // Future value of monthly contributions
  let futureValuePMT = 0
  if (monthlyContribution > 0 && periodicRate > 0) {
    futureValuePMT = monthlyContribution * 
      ((Math.pow(1 + periodicRate, periods) - 1) / periodicRate)
  } else if (monthlyContribution > 0) {
    futureValuePMT = monthlyContribution * periods
  }

  const totalFutureValue = futureValuePV + futureValuePMT
  const totalContributions = presentValue + (monthlyContribution * years * 12)
  const totalGains = totalFutureValue - totalContributions

  return {
    futureValue: totalFutureValue,
    totalContributions,
    totalGains,
    gainPercentage: totalContributions > 0 ? (totalGains / totalContributions) * 100 : 0
  }
}

/**
 * Calculate required amount to reach investment goal
 * @param {number} targetAmount - Target amount
 * @param {number} currentAmount - Current amount
 * @param {number} annualRate - Annual return rate (%)
 * @param {number} years - Investment period in years
 * @returns {number} Required monthly deposit
 */
export const calculateRequiredMonthlyContribution = (targetAmount, currentAmount, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12
  const periods = years * 12

  // Future value of current amount
  const futureValueCurrent = currentAmount * Math.pow(1 + monthlyRate, periods)

  // Remaining amount needed
  const remainingAmount = targetAmount - futureValueCurrent

  if (remainingAmount <= 0) {
    return 0 // Current amount is sufficient
  }

  if (monthlyRate === 0) {
    return remainingAmount / periods
  }

  // Calculate required monthly deposit
  const requiredMonthlyContribution = remainingAmount / 
    ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate)

  return requiredMonthlyContribution
}

/**
 * Calculate present value
 * @param {number} futureValue - Future value
 * @param {number} annualRate - Annual discount rate (%)
 * @param {number} years - Number of years
 * @returns {number} Present value
 */
export const calculatePresentValue = (futureValue, annualRate, years) => {
  const rate = annualRate / 100
  return futureValue / Math.pow(1 + rate, years)
}

/**
 * Calculate Internal Rate of Return (IRR) - approximate
 * @param {Array} cashFlows - Cash flows (first negative for initial investment)
 * @returns {number} Internal rate of return (%)
 */
export const calculateIRR = (cashFlows) => {
  if (cashFlows.length < 2) {
    throw new Error('At least two cash flows are required')
  }

  // Use Newton-Raphson method for approximation
  let rate = 0.1 // Initial rate 10%
  const maxIterations = 100
  const tolerance = 0.0001

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0
    let dnpv = 0

    for (let j = 0; j < cashFlows.length; j++) {
      const period = j
      npv += cashFlows[j] / Math.pow(1 + rate, period)
      dnpv -= (period * cashFlows[j]) / Math.pow(1 + rate, period + 1)
    }

    const newRate = rate - npv / dnpv

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100
    }

    rate = newRate
  }

  return rate * 100
}

/**
 * Calculate Net Present Value (NPV)
 * @param {Array} cashFlows - Cash flows
 * @param {number} discountRate - Discount rate (%)
 * @returns {number} Net present value
 */
export const calculateNPV = (cashFlows, discountRate) => {
  const rate = discountRate / 100
  let npv = 0

  for (let i = 0; i < cashFlows.length; i++) {
    npv += cashFlows[i] / Math.pow(1 + rate, i)
  }

  return npv
}

/**
 * Calculate inflation impact on purchasing power
 * @param {number} amount - Current amount
 * @param {number} inflationRate - Annual inflation rate (%)
 * @param {number} years - Number of years
 * @returns {Object} Inflation impact details
 */
export const calculateInflationImpact = (amount, inflationRate, years) => {
  const rate = inflationRate / 100
  const futureValue = amount * Math.pow(1 + rate, years)
  const realValue = amount / Math.pow(1 + rate, years)
  const purchasingPowerLoss = amount - realValue

  return {
    originalAmount: amount,
    futureNominalValue: futureValue,
    realValue,
    purchasingPowerLoss,
    lossPercentage: (purchasingPowerLoss / amount) * 100
  }
}

/**
 * Calculate risk-adjusted return (Sharpe Ratio)
 * @param {number} portfolioReturn - Portfolio return (%)
 * @param {number} riskFreeRate - Risk-free rate (%)
 * @param {number} standardDeviation - Standard deviation of returns (%)
 * @returns {number} Sharpe ratio
 */
export const calculateSharpeRatio = (portfolioReturn, riskFreeRate, standardDeviation) => {
  if (standardDeviation === 0) {
    throw new Error('Standard deviation cannot be zero')
  }
  
  return (portfolioReturn - riskFreeRate) / standardDeviation
}

/**
 * Calculate payback period
 * @param {number} initialInvestment - Initial investment
 * @param {Array} annualCashFlows - Annual cash flows
 * @returns {number} Payback period in years
 */
export const calculatePaybackPeriod = (initialInvestment, annualCashFlows) => {
  let cumulativeCashFlow = 0
  
  for (let year = 0; year < annualCashFlows.length; year++) {
    cumulativeCashFlow += annualCashFlows[year]
    
    if (cumulativeCashFlow >= initialInvestment) {
      // Calculate fractional part of the year
      const previousCumulative = cumulativeCashFlow - annualCashFlows[year]
      const remainingAmount = initialInvestment - previousCumulative
      const fractionOfYear = remainingAmount / annualCashFlows[year]
      
      return year + fractionOfYear
    }
  }
  
  return -1 // Investment not recovered
}

/**
 * Format percentage for display
 * @param {number} number - The number
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (number, decimals = 2) => {
  if (isNaN(number)) return '0%'
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number)
  
  return `${formatted}%`
}

/**
 * Validate financial data
 * @param {Object} data - Financial data
 * @returns {Object} Validation result
 */
export const validateFinancialData = (data) => {
  const errors = []
  
  if (data.principal !== undefined && (isNaN(data.principal) || data.principal <= 0)) {
    errors.push('Principal amount must be a positive number')
  }
  
  if (data.interestRate !== undefined && (isNaN(data.interestRate) || data.interestRate < 0)) {
    errors.push('Interest rate must be a non-negative number')
  }
  
  if (data.years !== undefined && (isNaN(data.years) || data.years <= 0)) {
    errors.push('Loan term must be a positive number')
  }
  
  if (data.monthlyContribution !== undefined && (isNaN(data.monthlyContribution) || data.monthlyContribution < 0)) {
    errors.push('Monthly contribution must be a non-negative number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}