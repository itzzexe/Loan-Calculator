import React, { useState } from 'react';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';
import { calculateMonthlyPayment } from '../utils/calculations';
import { formatCurrency, getCurrencyOptions } from '../utils/currency';

function LoanCalculator() {
  const [calculationType, setCalculationType] = useState('payment');
  const [currency, setCurrency] = useState('IQD');
  const currencyOptions = getCurrencyOptions();
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    monthlyPayment: '',
    downPayment: '',
    fees: '',
    insurance: '',
    taxes: ''
  });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (calculationType === 'payment') {
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
      if (!formData.interestRate) newErrors.interestRate = 'Interest rate is required';
      if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    } else if (calculationType === 'amount') {
      if (!formData.monthlyPayment) newErrors.monthlyPayment = 'Monthly payment is required';
      if (!formData.interestRate) newErrors.interestRate = 'Interest rate is required';
      if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    } else if (calculationType === 'term') {
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
      if (!formData.monthlyPayment) newErrors.monthlyPayment = 'Monthly payment is required';
      if (!formData.interestRate) newErrors.interestRate = 'Interest rate is required';
    } else if (calculationType === 'rate') {
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
      if (!formData.monthlyPayment) newErrors.monthlyPayment = 'Monthly payment is required';
      if (!formData.loanTerm) newErrors.loanTerm = 'Loan term is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const handleCalculate = () => {
    if (!validateForm()) return;

    try {
      const principal = parseFloat(formData.loanAmount) || 0;
      const rate = parseFloat(formData.interestRate) / 100;
      const years = parseFloat(formData.loanTerm);
      const payment = parseFloat(formData.monthlyPayment) || 0;
      const downPayment = parseFloat(formData.downPayment) || 0;
      const fees = parseFloat(formData.fees) || 0;
      const insurance = parseFloat(formData.insurance) || 0;
      const taxes = parseFloat(formData.taxes) || 0;

      let calculatedResults = {};

      if (calculationType === 'payment') {
        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(principal, rate * 100, years);
        const totalPayments = monthlyPayment * years * 12;
        const totalInterest = totalPayments - principal;
        const totalMonthlyPayment = monthlyPayment + insurance + taxes;
        
        calculatedResults = {
          monthlyPayment,
          totalPayments,
          totalInterest,
          totalMonthlyPayment,
          loanAmount: principal,
          totalCost: totalPayments + fees
        };
      } else if (calculationType === 'amount') {
        // Calculate loan amount
        const monthlyRate = rate / 12;
        const numPayments = years * 12;
        
        let maxLoanAmount;
        if (monthlyRate === 0) {
          maxLoanAmount = payment * numPayments;
        } else {
          maxLoanAmount = payment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
        }
        
        const maxPurchasePrice = maxLoanAmount + downPayment;
        const totalPayments = payment * numPayments;
        const totalInterest = totalPayments - maxLoanAmount;
        const totalMonthlyPayment = payment + insurance + taxes;
        
        calculatedResults = {
          maxLoanAmount,
          maxPurchasePrice,
          totalPayments,
          totalInterest,
          totalMonthlyPayment,
          monthlyPayment: payment,
          totalCost: totalPayments + fees
        };
      } else if (calculationType === 'term') {
        // Calculate loan term
        const monthlyRate = rate / 12;
        
        let loanTermMonths;
        if (monthlyRate === 0) {
          loanTermMonths = principal / payment;
        } else {
          loanTermMonths = -Math.log(1 - (principal * monthlyRate) / payment) / Math.log(1 + monthlyRate);
        }
        
        const loanTerm = loanTermMonths / 12;
        const totalPayments = payment * loanTermMonths;
        const totalInterest = totalPayments - principal;
        const totalMonthlyPayment = payment + insurance + taxes;
        
        calculatedResults = {
          loanTerm,
          loanTermMonths,
          totalPayments,
          totalInterest,
          totalMonthlyPayment,
          loanAmount: principal,
          monthlyPayment: payment,
          totalCost: totalPayments + fees
        };
      } else if (calculationType === 'rate') {
        // Calculate interest rate (approximate)
        const numPayments = years * 12;
        
        // Newton-Raphson method for approximation
        let rate = 0.01; // Initial guess: 1% monthly
        for (let i = 0; i < 100; i++) {
          const f = principal * rate * Math.pow(1 + rate, numPayments) / (Math.pow(1 + rate, numPayments) - 1) - payment;
          const df = principal * (Math.pow(1 + rate, numPayments) * (numPayments * rate + 1) - Math.pow(1 + rate, numPayments)) / Math.pow(Math.pow(1 + rate, numPayments) - 1, 2);
          
          const newRate = rate - f / df;
          if (Math.abs(newRate - rate) < 0.000001) break;
          rate = newRate;
        }
        
        const annualRate = rate * 12 * 100;
        const monthlyRate = rate * 100;
        const totalPayments = payment * numPayments;
        const totalInterest = totalPayments - principal;
        const totalMonthlyPayment = payment + insurance + taxes;
        
        calculatedResults = {
          annualRate,
          monthlyRate,
          totalPayments,
          totalInterest,
          totalMonthlyPayment,
          loanAmount: principal,
          monthlyPayment: payment,
          totalCost: totalPayments + fees
        };
      }

      setResults(calculatedResults);
    } catch (error) {
      setErrors({ general: 'Calculation error. Please check your input data.' });
    }
  };

  const calculationTypes = [
    { id: 'payment', name: 'Calculate Monthly Payment', description: 'Calculate required monthly payment' },
    { id: 'amount', name: 'Calculate Loan Amount', description: 'Calculate maximum loan amount' },
    { id: 'term', name: 'Calculate Loan Term', description: 'Calculate required repayment period' },
    { id: 'rate', name: 'Calculate Interest Rate', description: 'Calculate effective interest rate' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Loan Calculator</h2>
        </div>
        <p className="text-gray-600">
          Calculate monthly payments, loan amount, repayment term, or interest rate
        </p>
      </div>

      {/* Calculation Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculationTypes.map((type) => (
            <label key={type.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="calculationType"
                value={type.id}
                checked={calculationType === type.id}
                onChange={(e) => setCalculationType(e.target.value)}
                className="text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">{type.name}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Loan Amount */}
          {calculationType !== 'amount' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount - {currencyOptions.find(c => c.code === currency)?.name}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.loanAmount && <p className="mt-1 text-sm text-red-600">{errors.loanAmount}</p>}
            </div>
          )}

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                step="0.01"
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interestRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.interestRate && <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>}
          </div>

          {/* Loan Term */}
          {calculationType !== 'term' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (Years)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.loanTerm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.loanTerm && <p className="mt-1 text-sm text-red-600">{errors.loanTerm}</p>}
            </div>
          )}

          {/* Monthly Payment */}
          {(calculationType === 'amount' || calculationType === 'term' || calculationType === 'rate') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Payment - {currencyOptions.find(c => c.code === currency)?.name}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="monthlyPayment"
                  value={formData.monthlyPayment}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.monthlyPayment ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.monthlyPayment && <p className="mt-1 text-sm text-red-600">{errors.monthlyPayment}</p>}
            </div>
          )}

          {/* Additional Costs */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Costs (Optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment</label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Fees & Commissions</label>
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
                <label className="block text-sm text-gray-600 mb-1">Monthly Insurance</label>
                <input
                  type="number"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Monthly Taxes</label>
                <input
                  type="number"
                  name="taxes"
                  value={formData.taxes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Result</h3>
          
          <div className="mt-4 space-y-4">
            {/* Main Result */}
            <div className="bg-blue-50 p-4 rounded-lg">
              {calculationType === 'payment' && (
                <div>
                  <div className="text-sm text-blue-600 font-medium mb-2">Monthly Payment</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results.monthlyPayment, currency)}
                  </div>
                  {results.totalMonthlyPayment > results.monthlyPayment && (
                    <div className="text-sm text-blue-700 mt-1">
                      Total Monthly Payment (with insurance and taxes): {formatCurrency(results.totalMonthlyPayment, currency)}
                    </div>
                  )}
                </div>
              )}
              
              {calculationType === 'amount' && (
                <div>
                  <div className="text-sm text-green-600 font-medium mb-2">Maximum Loan Amount</div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(results.maxLoanAmount, currency)}
                  </div>
                  {results.maxPurchasePrice > results.maxLoanAmount && (
                    <div className="text-sm text-green-700 mt-1">
                      Maximum Purchase Price (with down payment): {formatCurrency(results.maxPurchasePrice, currency)}
                    </div>
                  )}
                </div>
              )}
              
              {calculationType === 'term' && (
                <div>
                  <div className="text-sm text-purple-600 font-medium mb-2">Required Loan Term</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {formatNumber(results.loanTerm)} years
                  </div>
                  <div className="text-sm text-purple-700 mt-1">
                    ({formatNumber(results.loanTermMonths)} months)
                  </div>
                </div>
              )}
              
              {calculationType === 'rate' && (
                <div>
                  <div className="text-sm text-orange-600 font-medium mb-2">Effective Interest Rate</div>
                  <div className="text-2xl font-bold text-orange-900">{formatNumber(results.annualRate)}%</div>
                  <div className="text-sm text-orange-700 mt-1">
                    Monthly rate: {formatNumber(results.monthlyRate)}%
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium">{formatCurrency(results.loanAmount || results.maxLoanAmount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-medium">{formatCurrency(results.totalInterest, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-medium">{formatCurrency(results.totalCost, currency)}</span>
              </div>
            </div>

            {/* Monthly Payment Breakdown */}
            {(parseFloat(formData.insurance) > 0 || parseFloat(formData.taxes) > 0) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Monthly Payment Breakdown:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal:</span>
                    <span>{formatCurrency(results.monthlyPayment, currency)}</span>
                  </div>
                  {parseFloat(formData.insurance) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance:</span>
                      <span>{formatCurrency(parseFloat(formData.insurance), currency)}</span>
                    </div>
                  )}
                  {parseFloat(formData.taxes) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes:</span>
                      <span>{formatCurrency(parseFloat(formData.taxes), currency)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Financial Tips */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Financial Tips:</p>
              <ul className="mt-2 space-y-1">
                <li>• Compare offers from different banks to get the best interest rate</li>
                <li>• Make sure you can comfortably afford the monthly payment</li>
                <li>• Calculate debt-to-income ratio (preferably not exceeding 40%)</li>
                <li>• Consider extra payments to save on interest</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!results && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">Enter the required data and click "Calculate" to view the result</p>
        </div>
      )}
    </div>
  );
}

export default LoanCalculator;