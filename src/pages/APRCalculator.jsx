import React, { useState } from 'react';
import { Calculator, FileText, AlertCircle } from 'lucide-react';
import { formatCurrency, getCurrencyOptions, convertCurrency } from '../utils/currency';

const APRCalculator = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    paymentFrequency: 'monthly',
    fees: '',
    points: '',
    compoundingMethod: 'monthly'
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [currency, setCurrency] = useState('IQD');

  const currencyOptions = getCurrencyOptions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Remove error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = 'Please enter loan amount';
    }
    
    if (!formData.interestRate || parseFloat(formData.interestRate) < 0) {
      newErrors.interestRate = 'Please enter interest rate';
    }
    
    if (!formData.loanTerm || parseInt(formData.loanTerm) <= 0) {
      newErrors.loanTerm = 'Please enter loan term';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAPR = () => {
    if (!validateForm()) return;

    const principal = parseFloat(formData.loanAmount);
    const rate = parseFloat(formData.interestRate) / 100;
    const term = parseInt(formData.loanTerm);
    const fees = parseFloat(formData.fees) || 0;
    const points = parseFloat(formData.points) || 0;
    
    // Calculate monthly payment
    const monthlyRate = rate / 12;
    const numPayments = term * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Calculate total costs
    const totalFees = fees + (points * principal / 100);
    const netLoanAmount = principal - totalFees;
    
    // Calculate APR using approximation method
    let apr = rate;
    let iteration = 0;
    const maxIterations = 100;
    const tolerance = 0.0001;

    while (iteration < maxIterations) {
      const monthlyAPR = apr / 12;
      const presentValue = monthlyPayment * ((1 - Math.pow(1 + monthlyAPR, -numPayments)) / monthlyAPR);
      
      if (Math.abs(presentValue - netLoanAmount) < tolerance) {
        break;
      }
      
      if (presentValue > netLoanAmount) {
        apr += 0.0001;
      } else {
        apr -= 0.0001;
      }
      
      iteration++;
    }

    const totalInterest = (monthlyPayment * numPayments) - principal;
    const totalCost = principal + totalInterest + totalFees;

    setResults({
      monthlyPayment: monthlyPayment,
      apr: apr * 100,
      totalInterest: totalInterest,
      totalFees: totalFees,
      totalCost: totalCost,
      netLoanAmount: netLoanAmount,
      effectiveRate: apr * 100
    });
  };

  const formatPercentage = (rate) => {
    return `${rate.toFixed(4)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Annual Percentage Rate (APR) Calculator</h2>
        </div>
        <p className="mt-2 text-gray-600">
          Calculate the effective annual interest rate including all fees and additional costs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Information</h3>
          
          <div className="space-y-4">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount ({currencyOptions.find(c => c.code === currency)?.symbol})
              </label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100000"
              />
              {errors.loanAmount && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.loanAmount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interestRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5.5"
              />
              {errors.interestRate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.interestRate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Term (Years)
              </label>
              <input
                type="number"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.loanTerm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="20"
              />
              {errors.loanTerm && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.loanTerm}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Fees ({currencyOptions.find(c => c.code === currency)?.symbol})
              </label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points (%)
              </label>
              <input
                type="number"
                step="0.01"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compounding Method
              </label>
              <select
                name="compoundingMethod"
                value={formData.compoundingMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semiannual">Semi-Annual</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <button
              onClick={calculateAPR}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Calculate APR
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Calculation Results</h3>
          </div>

          {results ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Annual Percentage Rate (APR)</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatPercentage(results.apr)}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Monthly Payment</div>
                  <div className="text-xl font-bold text-green-900">
                    {formatCurrency(results.monthlyPayment, currency)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-semibold">{formatCurrency(results.totalInterest, currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fees:</span>
                    <span className="font-semibold">{formatCurrency(results.totalFees, currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Loan Amount:</span>
                    <span className="font-semibold">{formatCurrency(results.netLoanAmount, currency)}</span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Total Cost:</span>
                    <span className="font-bold text-lg">{formatCurrency(results.totalCost, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Important Note:</p>
                    <p>The Annual Percentage Rate (APR) includes all costs and fees associated with the loan, providing a more accurate picture of the true cost of borrowing.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Enter loan information and click "Calculate APR" to view results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APRCalculator;