// Currency utilities and exchange rate management

// Supported currencies with their details
export const CURRENCIES = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimals: 2,
    exchangeRate: 1.0 // Base currency
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
    exchangeRate: 0.85
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimals: 2,
    exchangeRate: 0.73
  },
  IQD: {
    code: 'IQD',
    name: 'Iraqi Dinar',
    symbol: 'د.ع',
    decimals: 0,
    exchangeRate: 1310.0
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'ر.س',
    decimals: 2,
    exchangeRate: 3.75
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    decimals: 2,
    exchangeRate: 3.67
  },
  KWD: {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    symbol: 'د.ك',
    decimals: 3,
    exchangeRate: 0.30
  },
  BHD: {
    code: 'BHD',
    name: 'Bahraini Dinar',
    symbol: 'د.ب',
    decimals: 3,
    exchangeRate: 0.38
  },
  QAR: {
    code: 'QAR',
    name: 'Qatari Riyal',
    symbol: 'ر.ق',
    decimals: 2,
    exchangeRate: 3.64
  },
  OMR: {
    code: 'OMR',
    name: 'Omani Rial',
    symbol: 'ر.ع',
    decimals: 3,
    exchangeRate: 0.38
  },
  JOD: {
    code: 'JOD',
    name: 'Jordanian Dinar',
    symbol: 'د.أ',
    decimals: 3,
    exchangeRate: 0.71
  },
  EGP: {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'ج.م',
    decimals: 2,
    exchangeRate: 30.90
  },
  LBP: {
    code: 'LBP',
    name: 'Lebanese Pound',
    symbol: 'ل.ل',
    decimals: 0,
    exchangeRate: 89500.0
  },
  TRY: {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    decimals: 2,
    exchangeRate: 27.50
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    decimals: 0,
    exchangeRate: 149.0
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    decimals: 2,
    exchangeRate: 7.24
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    decimals: 2,
    exchangeRate: 83.12
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    decimals: 2,
    exchangeRate: 1.36
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    decimals: 2,
    exchangeRate: 1.53
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    decimals: 2,
    exchangeRate: 0.88
  }
}

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!CURRENCIES[fromCurrency] || !CURRENCIES[toCurrency]) {
    throw new Error('Unsupported currency')
  }

  if (fromCurrency === toCurrency) {
    return amount
  }

  // Convert to USD first, then to target currency
  const usdAmount = amount / CURRENCIES[fromCurrency].exchangeRate
  return usdAmount * CURRENCIES[toCurrency].exchangeRate
}

/**
 * Format currency amount for display
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD', options = {}) => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD
  
  // Determine appropriate locale based on currency
  let locale = 'en-US'
  if (['SAR', 'AED', 'KWD', 'BHD', 'QAR', 'OMR', 'JOD', 'EGP', 'LBP', 'IQD'].includes(currencyCode)) {
    locale = 'ar-SA'
  } else if (currencyCode === 'EUR') {
    locale = 'de-DE'
  } else if (currencyCode === 'GBP') {
    locale = 'en-GB'
  } else if (['JPY', 'CNY'].includes(currencyCode)) {
    locale = 'ja-JP'
  } else if (currencyCode === 'INR') {
    locale = 'en-IN'
  }

  const formatOptions = {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
    ...options
  }

  try {
    const formatted = new Intl.NumberFormat(locale, formatOptions).format(amount)
    
    // Add currency symbol based on convention
    if (['USD', 'CAD', 'AUD'].includes(currencyCode)) {
      return `${currency.symbol}${formatted}`
    } else if (['EUR', 'GBP', 'CHF'].includes(currencyCode)) {
      return `${currency.symbol}${formatted}`
    } else if (['JPY', 'CNY'].includes(currencyCode)) {
      return `${currency.symbol}${formatted}`
    } else if (currencyCode === 'INR') {
      return `${currency.symbol}${formatted}`
    } else if (currencyCode === 'TRY') {
      return `${formatted}${currency.symbol}`
    } else {
      // Arabic currencies - symbol after amount
      return `${formatted} ${currency.symbol}`
    }
  } catch (error) {
    // Fallback formatting
    return `${amount.toFixed(currency.decimals)} ${currency.symbol}`
  }
}

/**
 * Get currency options for dropdowns
 * @returns {Array} Array of currency options
 */
export const getCurrencyOptions = () => {
  return Object.values(CURRENCIES).map(currency => ({
    value: currency.code,
    label: `${currency.name} (${currency.symbol})`
  }))
}

/**
 * Update exchange rates (placeholder for future API integration)
 * @param {Object} newRates - New exchange rates
 */
export const updateExchangeRates = (newRates) => {
  Object.keys(newRates).forEach(currencyCode => {
    if (CURRENCIES[currencyCode]) {
      CURRENCIES[currencyCode].exchangeRate = newRates[currencyCode]
    }
  })
}

/**
 * Get exchange rate for a currency
 * @param {string} currencyCode - Currency code
 * @returns {number} Exchange rate relative to USD
 */
export const getExchangeRate = (currencyCode) => {
  return CURRENCIES[currencyCode]?.exchangeRate || 1
}

/**
 * Get currency symbol
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || '$'
}

/**
 * Get currency name
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency name
 */
export const getCurrencyName = (currencyCode) => {
  return CURRENCIES[currencyCode]?.name || 'US Dollar'
}

/**
 * Check if currency is supported
 * @param {string} currencyCode - Currency code
 * @returns {boolean} True if supported
 */
export const isCurrencySupported = (currencyCode) => {
  return !!CURRENCIES[currencyCode]
}

/**
 * Get all supported currency codes
 * @returns {Array} Array of currency codes
 */
export const getAllCurrencyCodes = () => {
  return Object.keys(CURRENCIES)
}

/**
 * Format amount without currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code for decimal places
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted amount
 */
export const formatAmount = (amount, currencyCode = 'USD', locale = 'en-US') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals
  }).format(amount)
}