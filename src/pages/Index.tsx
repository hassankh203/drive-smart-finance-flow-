
import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Reports from '@/components/Reports';
import History from '@/components/History';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <Reports />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {renderCurrentView()}
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
