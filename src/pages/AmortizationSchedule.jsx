import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  Table, 
  Download, 
  FileText, 
  Calendar,
  DollarSign,
  TrendingDown,
  Filter,
  Eye,
  Printer,
  Mail,
  Calculator,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, getCurrencyOptions, convertCurrency } from '../utils/currency'

const AmortizationSchedule = () => {
  const [schedule, setSchedule] = useState([])
  const [summary, setSummary] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState('full') // full, summary, yearly
  const [currentPage, setCurrentPage] = useState(1)
  const [currency, setCurrency] = useState('IQD')
  const itemsPerPage = 12

  const currencyOptions = getCurrencyOptions()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      principal: '',
      annualRate: '',
      termYears: '',
      startDate: new Date().toISOString().split('T')[0],
      paymentFrequency: 'monthly',
      extraPayment: '0'
    }
  })

  const paymentFrequencies = [
    { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
    { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
    { value: 'semiannual', label: 'Semi-Annual', periodsPerYear: 2 },
    { value: 'annual', label: 'Annual', periodsPerYear: 1 }
  ]

  const generateAmortizationSchedule = (data) => {
    const principal = parseFloat(data.principal)
    const annualRate = parseFloat(data.annualRate) / 100
    const termYears = parseFloat(data.termYears)
    const extraPayment = parseFloat(data.extraPayment) || 0
    const startDate = new Date(data.startDate)
    const frequency = paymentFrequencies.find(f => f.value === data.paymentFrequency)?.periodsPerYear || 12

    const periodicRate = annualRate / frequency
    const numberOfPayments = termYears * frequency
    
    // Calculate periodic payment
    let periodicPayment
    if (periodicRate === 0) {
      periodicPayment = principal / numberOfPayments
    } else {
      periodicPayment = principal * (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / 
                      (Math.pow(1 + periodicRate, numberOfPayments) - 1)
    }

    const schedule = []
    let remainingBalance = principal
    let totalInterestPaid = 0
    let totalPrincipalPaid = 0
    let actualPayments = 0

    let currentDate = new Date(startDate)
    
    for (let i = 1; i <= numberOfPayments && remainingBalance > 0.01; i++) {
      const interestPayment = remainingBalance * periodicRate
      let principalPayment = periodicPayment - interestPayment + extraPayment
      
      // Adjust for final payment
      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance
        periodicPayment = principalPayment + interestPayment
      }

      const paymentDate = new Date(currentDate)

      remainingBalance -= principalPayment
      totalInterestPaid += interestPayment
      totalPrincipalPaid += principalPayment
      actualPayments++

      schedule.push({
        paymentNumber: i,
        paymentDate: paymentDate.toLocaleDateString('en-US'),
        monthlyPayment: periodicPayment,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        extraPayment: extraPayment,
        remainingBalance: Math.max(0, remainingBalance),
        cumulativeInterest: totalInterestPaid,
        cumulativePrincipal: totalPrincipalPaid
      })
      
      // Update date for next payment
      if (frequency === 12) {
        currentDate.setMonth(currentDate.getMonth() + 1)
      } else if (frequency === 4) {
        currentDate.setMonth(currentDate.getMonth() + 3)
      } else if (frequency === 2) {
        currentDate.setMonth(currentDate.getMonth() + 6)
      } else {
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      }

      if (remainingBalance <= 0.01) break
    }

    const summaryData = {
      originalPrincipal: principal,
      totalPayments: actualPayments,
      totalAmountPaid: totalPrincipalPaid + totalInterestPaid,
      totalInterestPaid: totalInterestPaid,
      totalPrincipalPaid: totalPrincipalPaid,
      monthlyPayment: periodicPayment,
      extraPaymentTotal: extraPayment * actualPayments,
      timeSaved: numberOfPayments - actualPayments,
      interestSaved: extraPayment > 0 ? (periodicPayment * numberOfPayments - principal) - totalInterestPaid : 0,
      payoffDate: schedule[schedule.length - 1]?.paymentDate
    }

    return { schedule, summary: summaryData }
  }

  const onSubmit = async (data) => {
    setIsGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { schedule: newSchedule, summary: newSummary } = generateAmortizationSchedule(data)
      setSchedule(newSchedule)
      setSummary(newSummary)
      setCurrentPage(1)
      
      toast.success('Amortization schedule generated successfully!')
    } catch (error) {
      toast.error('Error generating schedule')
      console.error('Schedule generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number)
  }

  // Pagination
  const totalPages = Math.ceil(schedule.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSchedule = schedule.slice(startIndex, endIndex)

  const exportToPDF = () => {
    toast.success('PDF export will be available soon')
  }

  const exportToExcel = () => {
    toast.success('Excel export will be available soon')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Amortization Schedule</h2>
        </div>
        <p className="mt-2 text-gray-600">
          Calculate detailed amortization schedule for your loan with optional extra payments
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Table className="h-5 w-5 mr-2 text-purple-600" />
            Schedule Data
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-field"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal Amount ({currencyOptions.find(c => c.code === currency)?.symbol})
              </label>
              <input
                type="number"
                step="1000"
                min="1000"
                {...register('principal', { 
                  required: 'Principal amount is required',
                  min: { value: 1000, message: 'Minimum amount is 1,000' }
                })}
                className="input-field"
                placeholder="500,000"
              />
              {errors.principal && (
                <p className="text-red-500 text-sm mt-1">{errors.principal.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="50"
                {...register('annualRate', { 
                  required: 'Interest rate is required',
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                className="input-field"
                placeholder="3.5"
              />
              {errors.annualRate && (
                <p className="text-red-500 text-sm mt-1">{errors.annualRate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (Years)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                {...register('termYears', { 
                  required: 'Loan term is required',
                  min: { value: 1, message: 'Minimum is one year' }
                })}
                className="input-field"
                placeholder="25"
              />
              {errors.termYears && (
                <p className="text-red-500 text-sm mt-1">{errors.termYears.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required' })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Frequency
              </label>
              <select
                {...register('paymentFrequency')}
                className="input-field"
              >
                {paymentFrequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Payment ({currencyOptions.find(c => c.code === currency)?.symbol})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                {...register('extraPayment')}
                className="input-field"
                placeholder="0"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <TrendingDown className="h-4 w-4 animate-pulse" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Table className="h-4 w-4" />
                  <span>Generate Schedule</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 space-y-6"
        >
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Monthly Payment</p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatCurrency(summary.monthlyPayment, currency)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Interest</p>
                    <p className="text-xl font-bold text-green-900">
                      {formatCurrency(summary.totalInterestPaid, currency)}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Number of Payments</p>
                    <p className="text-xl font-bold text-purple-900">
                      {summary.totalPayments}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          )}

          {/* Schedule Table */}
          {schedule.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Table Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Amortization Schedule</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={exportToPDF}
                      className="btn-secondary flex items-center space-x-1 text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="btn-secondary flex items-center space-x-1 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>Excel</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Principal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remaining Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSchedule.map((payment, index) => (
                      <tr key={payment.paymentNumber} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {payment.paymentNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {payment.paymentDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {formatCurrency(payment.monthlyPayment, currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600">
                          {formatCurrency(payment.principalPayment, currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600">
                          {formatCurrency(payment.interestPayment, currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {formatCurrency(payment.remainingBalance, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, schedule.length)} of {schedule.length} payments
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Table className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Yet</h3>
              <p className="text-gray-500">Fill out the form and click "Generate Schedule" to view the amortization schedule</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AmortizationSchedule