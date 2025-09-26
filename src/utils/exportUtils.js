// Export Utilities for PDF and Excel
// Financial reporting export tools

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatPercentage } from './calculations'
import { formatCurrency } from './currency'

/**
 * Export amortization schedule to PDF
 * @param {Array} schedule - Amortization schedule
 * @param {Object} loanDetails - Loan details
 * @param {string} filename - File name
 */
export const exportAmortizationToPDF = (schedule, loanDetails, filename = 'amortization-schedule') => {
  const doc = new jsPDF()
  
  // Set up font (Arabic support if available)
  doc.setFont('helvetica')
  doc.setFontSize(16)
  
  // Title
  doc.text('Amortization Schedule', 20, 20)
  
  // Loan details
  doc.setFontSize(12)
  let yPosition = 40
  
  const details = [
    `Principal Amount: ${formatCurrency(loanDetails.principal, 'USD')}`,
    `Annual Interest Rate: ${formatPercentage(loanDetails.annualRate)}`,
    `Loan Term: ${loanDetails.years} years`,
    `Monthly Payment: ${formatCurrency(loanDetails.monthlyPayment, 'USD')}`,
    `Total Interest: ${formatCurrency(loanDetails.totalInterest, 'USD')}`,
    `Total Payments: ${formatCurrency(loanDetails.totalPayments, 'USD')}`
  ]
  
  details.forEach(detail => {
    doc.text(detail, 20, yPosition)
    yPosition += 8
  })
  
  // Amortization table
  const tableData = schedule.map(payment => [
    payment.paymentNumber,
    payment.date.toLocaleDateString('en-US'),
    formatCurrency(payment.monthlyPayment, 'USD', 0),
    formatCurrency(payment.principalPayment, 'USD', 0),
    formatCurrency(payment.interestPayment, 'USD', 0),
    formatCurrency(payment.remainingBalance, 'USD', 0)
  ])
  
  doc.autoTable({
    startY: yPosition + 10,
    head: [['#', 'Date', 'Payment', 'Principal', 'Interest', 'Balance']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    }
  })
  
  // Save file
  doc.save(`${filename}.pdf`)
}

/**
 * Export amortization schedule to Excel
 * @param {Array} schedule - Amortization schedule
 * @param {Object} loanDetails - Loan details
 * @param {string} filename - File name
 */
export const exportAmortizationToExcel = (schedule, loanDetails, filename = 'amortization-schedule') => {
  // Create new workbook
  const wb = XLSX.utils.book_new()
  
  // Loan details sheet
  const detailsData = [
    ['Loan Details', ''],
    ['Principal Amount', loanDetails.principal],
    ['Annual Interest Rate (%)', loanDetails.annualRate],
    ['Loan Term (Years)', loanDetails.years],
    ['Monthly Payment', loanDetails.monthlyPayment],
    ['Total Interest', loanDetails.totalInterest],
    ['Total Payments', loanDetails.totalPayments],
    ['', ''],
    ['Amortization Schedule', ''],
    ['Payment #', 'Date', 'Monthly Payment', 'Principal Payment', 'Interest Payment', 'Remaining Balance', 'Cumulative Interest']
  ]
  
  // Add amortization schedule data
  let cumulativeInterest = 0
  schedule.forEach(payment => {
    cumulativeInterest += payment.interestPayment
    detailsData.push([
      payment.paymentNumber,
      payment.date.toLocaleDateString('en-US'),
      payment.monthlyPayment,
      payment.principalPayment,
      payment.interestPayment,
      payment.remainingBalance,
      cumulativeInterest
    ])
  })
  
  // Format columns
  const ws = XLSX.utils.aoa_to_sheet(detailsData)
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }
  ]
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Amortization')
  
  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Export investment report to PDF
 * @param {Object} investmentData - Investment data
 * @param {Array} yearlyData - Yearly data
 * @param {string} filename - File name
 */
export const exportInvestmentToPDF = (investmentData, yearlyData, filename = 'investment-report') => {
  const doc = new jsPDF()
  
  doc.setFont('helvetica')
  doc.setFontSize(16)
  
  // Title
  doc.text('Investment Analysis Report', 20, 20)
  
  // Investment details
  doc.setFontSize(12)
  let yPosition = 40
  
  const details = [
    `Initial Investment: ${formatCurrency(investmentData.initialAmount, 'USD')}`,
    `Monthly Contribution: ${formatCurrency(investmentData.monthlyContribution, 'USD')}`,
    `Annual Return Rate: ${formatPercentage(investmentData.annualReturn)}`,
    `Investment Period: ${investmentData.years} years`,
    `Final Value: ${formatCurrency(investmentData.futureValue, 'USD')}`,
    `Total Contributions: ${formatCurrency(investmentData.totalContributions, 'USD')}`,
    `Total Gains: ${formatCurrency(investmentData.totalGains, 'USD')}`,
    `Gain Percentage: ${formatPercentage(investmentData.gainPercentage)}`
  ]
  
  details.forEach(detail => {
    doc.text(detail, 20, yPosition)
    yPosition += 8
  })
  
  // Yearly growth table
  const tableData = yearlyData.map(year => [
    year.year,
    formatCurrency(year.startingBalance, 'USD', 0),
    formatCurrency(year.contributions, 'USD', 0),
    formatCurrency(year.interest, 'USD', 0),
    formatCurrency(year.endingBalance, 'USD', 0)
  ])
  
  doc.autoTable({
    startY: yPosition + 10,
    head: [['Year', 'Starting Balance', 'Contributions', 'Interest', 'Ending Balance']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2
    }
  })
  
  doc.save(`${filename}.pdf`)
}

/**
 * Export investment report to Excel
 * @param {Object} investmentData - Investment data
 * @param {Array} yearlyData - Yearly data
 * @param {string} filename - File name
 */
export const exportInvestmentToExcel = (investmentData, yearlyData, filename = 'investment-report') => {
  const wb = XLSX.utils.book_new()
  
  // Investment summary sheet
  const summaryData = [
    ['Investment Summary', ''],
    ['Initial Investment', investmentData.initialAmount],
    ['Monthly Contribution', investmentData.monthlyContribution],
    ['Annual Return Rate (%)', investmentData.annualReturn],
    ['Investment Period (Years)', investmentData.years],
    ['Final Value', investmentData.futureValue],
    ['Total Contributions', investmentData.totalContributions],
    ['Total Gains', investmentData.totalGains],
    ['Gain Percentage (%)', investmentData.gainPercentage],
    ['', ''],
    ['Yearly Growth', ''],
    ['Year', 'Starting Balance', 'Contributions', 'Interest', 'Ending Balance']
  ]
  
  // Add yearly data
  yearlyData.forEach(year => {
    summaryData.push([
      year.year,
      year.startingBalance,
      year.contributions,
      year.interest,
      year.endingBalance
    ])
  })
  
  const ws = XLSX.utils.aoa_to_sheet(summaryData)
  
  // Format columns
  ws['!cols'] = [
    { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
  ]
  
  XLSX.utils.book_append_sheet(wb, ws, 'Investment Report')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Export loan comparison report to PDF
 * @param {Array} loans - List of loans for comparison
 * @param {string} filename - File name
 */
export const exportLoanComparisonToPDF = (loans, filename = 'loan-comparison') => {
  const doc = new jsPDF()
  
  doc.setFont('helvetica')
  doc.setFontSize(16)
  
  doc.text('Loan Comparison Report', 20, 20)
  
  // Comparison table
  const tableData = loans.map((loan, index) => [
    `Loan ${index + 1}`,
    formatCurrency(loan.principal, 'USD', 0),
    formatPercentage(loan.rate),
    `${loan.term} years`,
    formatCurrency(loan.monthlyPayment, 'USD', 0),
    formatCurrency(loan.totalInterest, 'USD', 0),
    formatCurrency(loan.totalPayments, 'USD', 0)
  ])
  
  doc.autoTable({
    startY: 40,
    head: [['Loan', 'Principal', 'Rate', 'Term', 'Payment', 'Interest', 'Total']],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 3
    }
  })
  
  doc.save(`${filename}.pdf`)
}

/**
 * Export general financial data to CSV
 * @param {Array} data - Data
 * @param {Array} headers - Column headers
 * @param {string} filename - File name
 */
export const exportToCSV = (data, headers, filename = 'financial-data') => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, `${filename}.csv`)
}

/**
 * Print report
 * @param {string} elementId - Element ID to print
 * @param {string} title - Report title
 */
export const printReport = (elementId, title = 'Financial Report') => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found for printing')
    return
  }

  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .print-content {
          margin: 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .no-print {
          display: none !important;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <h1>${title}</h1>
        <p>Print Date: ${new Date().toLocaleDateString('en-US')}</p>
      </div>
      <div class="print-content">
        ${element.innerHTML}
      </div>
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

/**
 * Create download link for file
 * @param {Blob} blob - File
 * @param {string} filename - File name
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Convert data to JSON format for export
 * @param {Object} data - Data
 * @param {string} filename - File name
 */
export const exportToJSON = (data, filename = 'financial-data') => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  downloadFile(blob, `${filename}.json`)
}

/**
 * Import data from JSON file
 * @param {File} file - File
 * @returns {Promise} Imported data
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('File reading error: Invalid JSON format'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('File reading error'))
    }
    
    reader.readAsText(file)
  })
}