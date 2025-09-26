import React, { useState } from 'react';
import { Calculator, FileText, Percent, TrendingUp } from 'lucide-react';
import './index.css';

// Page components
import LoanCalculator from './pages/LoanCalculator';
import AmortizationSchedule from './pages/AmortizationSchedule';
import APRCalculator from './pages/APRCalculator';
import TimeValueCalculator from './pages/TimeValueCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('loan');

  const tabs = [
    { id: 'loan', name: 'Loan Calculator', icon: Calculator, component: LoanCalculator },
    { id: 'amortization', name: 'Amortization Schedule', icon: FileText, component: AmortizationSchedule },
    { id: 'apr', name: 'APR Calculator', icon: Percent, component: APRCalculator },
    { id: 'timevalue', name: 'Time Value of Money', icon: TrendingUp, component: TimeValueCalculator },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || LoanCalculator;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Loan Calculator - Advanced Financial Calculator</h1>
            </div>
            <div className="text-sm text-gray-500">
              Version 6.0
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ActiveComponent />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>Loan Calculator - Advanced Financial Calculator</p>
            <p className="mt-1">All rights reserved © 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;