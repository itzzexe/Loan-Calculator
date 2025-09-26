# 🏦 Modern Loan Calculator

A comprehensive, multi-currency financial calculator built with React and Vite. This application provides powerful tools for loan calculations, APR analysis, amortization schedules, and time value of money computations.

![Loan Calculator](https://img.shields.io/badge/React-18.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🌟 Features

### 💰 **Multi-Currency Support**
- **20 International Currencies** including USD, EUR, GBP, IQD, SAR, AED, KWD, BHD, QAR, OMR, JOD, EGP, LBP, TRY, JPY, CNY, INR, CAD, AUD, CHF
- **Iraqi Dinar (IQD) as Default Currency**
- Real-time currency conversion
- Locale-aware formatting for each currency

### 🧮 **Four Powerful Calculators**

#### 1. **Loan Calculator**
- Calculate monthly payments
- Determine total interest paid
- Compare different loan scenarios
- Support for various loan terms

#### 2. **APR Calculator**
- Calculate Annual Percentage Rate
- Include fees and additional costs
- Compare loan offers effectively
- Transparent cost analysis

#### 3. **Amortization Schedule**
- Detailed payment breakdown
- Principal vs. interest analysis
- Remaining balance tracking
- Export to PDF and Excel

#### 4. **Time Value Calculator**
- Present Value calculations
- Future Value projections
- Investment growth analysis
- Compound interest computations

### 📊 **Export Capabilities**
- **PDF Export** - Professional formatted reports
- **Excel Export** - Detailed spreadsheet analysis
- **Print-friendly** layouts
- **Customizable** report formats

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works on all devices
- **Clean Interface** - Intuitive and user-friendly
- **Real-time Validation** - Instant feedback
- **Accessibility** - WCAG compliant
- **Dark/Light Theme** support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/itzzexe/Loan-Calculator.git
   cd Loan-Calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Usage

### Loan Calculator
1. Enter loan amount in your preferred currency
2. Set interest rate (annual percentage)
3. Choose loan term (months or years)
4. View instant calculations and payment breakdown

### APR Calculator
1. Input loan amount and nominal interest rate
2. Add any additional fees or costs
3. Calculate the true APR including all costs
4. Compare different loan offers

### Amortization Schedule
1. Enter loan details (amount, rate, term)
2. Generate complete payment schedule
3. View principal vs. interest breakdown
4. Export detailed reports

### Time Value Calculator
1. Choose calculation type (PV or FV)
2. Enter relevant financial parameters
3. Set compounding frequency
4. Calculate investment projections

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **PDF Generation**: jsPDF
- **Excel Export**: SheetJS
- **Icons**: Lucide React
- **Deployment**: GitHub Pages Ready

## 📁 Project Structure

```
modern-tvalue/
├── public/
│   └── calculator-icon.svg
├── src/
│   ├── pages/
│   │   ├── LoanCalculator.jsx
│   │   ├── APRCalculator.jsx
│   │   ├── AmortizationSchedule.jsx
│   │   └── TimeValueCalculator.jsx
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── currency.js
│   │   └── exportUtils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🌍 Supported Currencies

| Currency | Code | Symbol | Region |
|----------|------|--------|---------|
| Iraqi Dinar | IQD | ع.د | Iraq (Default) |
| US Dollar | USD | $ | United States |
| Euro | EUR | € | European Union |
| British Pound | GBP | £ | United Kingdom |
| Saudi Riyal | SAR | ر.س | Saudi Arabia |
| UAE Dirham | AED | د.إ | UAE |
| Kuwaiti Dinar | KWD | د.ك | Kuwait |
| Bahraini Dinar | BHD | د.ب | Bahrain |
| Qatari Riyal | QAR | ر.ق | Qatar |
| Omani Rial | OMR | ر.ع | Oman |
| Jordanian Dinar | JOD | د.أ | Jordan |
| Egyptian Pound | EGP | ج.م | Egypt |
| Lebanese Pound | LBP | ل.ل | Lebanon |
| Turkish Lira | TRY | ₺ | Turkey |
| Japanese Yen | JPY | ¥ | Japan |
| Chinese Yuan | CNY | ¥ | China |
| Indian Rupee | INR | ₹ | India |
| Canadian Dollar | CAD | C$ | Canada |
| Australian Dollar | AUD | A$ | Australia |
| Swiss Franc | CHF | Fr | Switzerland |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/itzzexe/Loan-Calculator/issues) page to report bugs or request features.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Review the FAQ section

## 🎯 Roadmap

- [ ] Mobile app version (React Native)
- [ ] Advanced investment calculators
- [ ] Multi-language support
- [ ] Cloud save functionality
- [ ] Loan comparison tools
- [ ] Integration with banking APIs

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Made with ❤️ for the financial community**

*Last updated: January 2025*