import React, { useState } from 'react';
import { TrendingUp, Calculator, AlertCircle, DollarSign } from 'lucide-react';
import { formatCurrency, getCurrencyOptions, convertCurrency } from '../utils/currency';

const TimeValueCalculator = () => {
  const [calculationType, setCalculationType] = useState('pv');
  const [formData, setFormData] = useState({
    presentValue: '',
    futureValue: '',
    payment: '',
    interestRate: '',
    periods: '',
    compoundingFrequency: '12',
    paymentTiming: 'end'
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [currency, setCurrency] = useState('IQD');

  const currencyOptions = getCurrencyOptions();

  const calculationTypes = [
    { id: 'pv', name: 'Present Value (PV)', description: 'Calculate present value of future amount' },
    { id: 'fv', name: 'Future Value (FV)', description: 'Calculate future value of present amount' },
    { id: 'pmt', name: 'Payment (PMT)', description: 'Calculate periodic payment amount' },
    { id: 'rate', name: 'Interest Rate (Rate)', description: 'Calculate required interest rate' },
    { id: 'nper', name: 'Number of Periods (NPER)', description: 'Calculate required number of periods' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields based on calculation type
    switch (calculationType) {
      case 'pv':
        if (!formData.futureValue) newErrors.futureValue = 'Required';
        if (!formData.interestRate) newErrors.interestRate = 'Required';
        if (!formData.periods) newErrors.periods = 'Required';
        break;
      case 'fv':
        if (!formData.presentValue) newErrors.presentValue = 'Required';
        if (!formData.interestRate) newErrors.interestRate = 'Required';
        if (!formData.periods) newErrors.periods = 'Required';
        break;
      case 'pmt':
        if (!formData.presentValue && !formData.futureValue) {
          newErrors.presentValue = 'Either present value or future value is required';
        }
        if (!formData.interestRate) newErrors.interestRate = 'Required';
        if (!formData.periods) newErrors.periods = 'Required';
        break;
      case 'rate':
        if (!formData.presentValue) newErrors.presentValue = 'Required';
        if (!formData.futureValue) newErrors.futureValue = 'Required';
        if (!formData.periods) newErrors.periods = 'Required';
        break;
      case 'nper':
        if (!formData.presentValue) newErrors.presentValue = 'Required';
        if (!formData.futureValue) newErrors.futureValue = 'Required';
        if (!formData.interestRate) newErrors.interestRate = 'Required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validateForm()) return;

    const pv = parseFloat(formData.presentValue) || 0;
    const fv = parseFloat(formData.futureValue) || 0;
    const pmt = parseFloat(formData.payment) || 0;
    const rate = parseFloat(formData.interestRate) / 100;
    const nper = parseFloat(formData.periods) || 0;
    const compounding = parseFloat(formData.compoundingFrequency);
    const type = formData.paymentTiming === 'beginning' ? 1 : 0;

    let result = 0;
    let formula = '';
    let explanation = '';

    try {
      switch (calculationType) {
        case 'pv':
          // Present Value
          if (pmt === 0) {
            // Present value of single amount
            result = fv / Math.pow(1 + rate, nper);
            formula = `PV = FV / (1 + r)^n = ${fv} / (1 + ${rate})^${nper}`;
            explanation = `Present value of amount ${fv.toLocaleString()} at ${(rate*100).toFixed(2)}% interest rate for ${nper} periods`;
          } else {
            // Present value of annuity
            const pvAnnuity = pmt * ((1 - Math.pow(1 + rate, -nper)) / rate) * (1 + rate * type);
            const pvLump = fv / Math.pow(1 + rate, nper);
            result = pvAnnuity + pvLump;
            formula = `PV = PMT × [(1 - (1 + r)^-n) / r] + FV / (1 + r)^n`;
            explanation = `Present value of payment series ${pmt.toLocaleString()} with future value ${fv.toLocaleString()}`;
          }
          break;

        case 'fv':
          // Future Value
          if (pmt === 0) {
            // Future value of single amount
            result = pv * Math.pow(1 + rate, nper);
            formula = `FV = PV × (1 + r)^n = ${pv} × (1 + ${rate})^${nper}`;
            explanation = `Future value of amount ${pv.toLocaleString()} at ${(rate*100).toFixed(2)}% interest rate for ${nper} periods`;
          } else {
            // Future value of annuity
            const fvAnnuity = pmt * (((Math.pow(1 + rate, nper) - 1) / rate)) * (1 + rate * type);
            const fvLump = pv * Math.pow(1 + rate, nper);
            result = fvAnnuity + fvLump;
            formula = `FV = PMT × [((1 + r)^n - 1) / r] + PV × (1 + r)^n`;
            explanation = `Future value of payment series ${pmt.toLocaleString()} with present value ${pv.toLocaleString()}`;
          }
          break;

        case 'pmt':
          // Payment
          if (fv === 0) {
            // Payment for loan
            result = (pv * rate) / (1 - Math.pow(1 + rate, -nper));
            formula = `PMT = PV × r / (1 - (1 + r)^-n)`;
            explanation = `Payment required to pay off loan ${pv.toLocaleString()} at ${(rate*100).toFixed(2)}% interest rate`;
          } else {
            // Payment to reach future value
            result = (fv * rate) / (Math.pow(1 + rate, nper) - 1);
            formula = `PMT = FV × r / ((1 + r)^n - 1)`;
            explanation = `Payment required to reach future value ${fv.toLocaleString()}`;
          }
          break;

        case 'rate':
          // Interest rate (approximation)
          let r = 0.1; // Initial guess
          for (let i = 0; i < 100; i++) {
            const f = pv * Math.pow(1 + r, nper) - fv;
            const df = pv * nper * Math.pow(1 + r, nper - 1);
            const newR = r - f / df;
            if (Math.abs(newR - r) < 0.0001) break;
            r = newR;
          }
          result = r * 100;
          formula = `Approximation using Newton-Raphson method`;
          explanation = `Interest rate required to convert ${pv.toLocaleString()} to ${fv.toLocaleString()} over ${nper} periods`;
          break;

        case 'nper':
          // Number of periods
          result = Math.log(fv / pv) / Math.log(1 + rate);
          formula = `NPER = ln(FV/PV) / ln(1 + r) = ln(${fv}/${pv}) / ln(1 + ${rate})`;
          explanation = `Number of periods required to convert ${pv.toLocaleString()} to ${fv.toLocaleString()} at ${(rate*100).toFixed(2)}% interest rate`;
          break;
      }

      setResults({
        value: result,
        formula: formula,
        explanation: explanation,
        type: calculationType
      });

    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ general: 'Calculation error. Please check your input data.' });
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Time Value of Money Calculator</h2>
        </div>
        <p className="mt-2 text-gray-600">
          Calculate various financial values using time value of money principles
        </p>
      </div>

      {/* Calculation Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculationTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setCalculationType(type.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                calculationType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{type.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Data</h3>
          
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

            {/* Present Value */}
            {(calculationType === 'fv' || calculationType === 'pmt' || calculationType === 'rate' || calculationType === 'nper') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Present Value (PV) - {currencyOptions.find(c => c.code === currency)?.symbol}
                </label>
                <input
                  type="number"
                  name="presentValue"
                  value={formData.presentValue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.presentValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10000"
                />
                {errors.presentValue && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.presentValue}
                  </p>
                )}
              </div>
            )}

            {/* Future Value */}
            {(calculationType === 'pv' || calculationType === 'pmt' || calculationType === 'rate' || calculationType === 'nper') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Future Value (FV) - {currencyOptions.find(c => c.code === currency)?.symbol}
                </label>
                <input
                  type="number"
                  name="futureValue"
                  value={formData.futureValue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.futureValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="15000"
                />
                {errors.futureValue && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.futureValue}
                  </p>
                )}
              </div>
            )}

            {/* Payment */}
            {calculationType === 'pmt' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periodic Payment (PMT) - {currencyOptions.find(c => c.code === currency)?.symbol}
                </label>
                <input
                  type="number"
                  name="payment"
                  value={formData.payment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>
            )}

            {/* Interest Rate */}
            {calculationType !== 'rate' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Interest Rate (%)
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
            )}

            {/* Number of Periods */}
            {calculationType !== 'nper' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Periods
                </label>
                <input
                  type="number"
                  name="periods"
                  value={formData.periods}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.periods ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10"
                />
                {errors.periods && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.periods}
                  </p>
                )}
              </div>
            )}

            {/* Compounding Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compounding Frequency per Year
              </label>
              <select
                name="compoundingFrequency"
                value={formData.compoundingFrequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Annual</option>
                <option value="2">Semi-Annual</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>

            {/* Payment Timing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Timing
              </label>
              <select
                name="paymentTiming"
                value={formData.paymentTiming}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="end">End of Period</option>
                <option value="beginning">Beginning of Period</option>
              </select>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.general}
                </p>
              </div>
            )}

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Result</h3>
          </div>

          {results ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium mb-1">
                  {calculationTypes.find(t => t.id === results.type)?.name}
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {results.type === 'rate' 
                    ? `${formatNumber(results.value)}%`
                    : results.type === 'nper'
                    ? `${formatNumber(results.value)} periods`
                    : formatCurrency(results.value, currency)
                  }
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
                  <p className="text-gray-700 text-sm">{results.explanation}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Formula Used:</h4>
                  <p className="text-gray-700 text-sm font-mono bg-gray-50 p-2 rounded">
                    {results.formula}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Tip:</p>
                    <p>The time value of money means that money today is worth more than the same amount in the future due to its potential earning capacity.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Enter required data and click "Calculate" to view result</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeValueCalculator;