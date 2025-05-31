
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Home, FileText, Settings, Car } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'history', label: 'History', icon: FileText },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-r border-gray-200 w-64 min-h-screen p-4">
        <div className="flex items-center gap-2 mb-8">
          <Car className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">DriveProfit</h1>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center p-2 h-auto min-h-0 ${
                  currentView === item.id ? 'text-blue-600' : 'text-gray-600'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
