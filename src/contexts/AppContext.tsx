import React, { createContext, useContext, useState, useEffect } from 'react';
import { Income, Expense, MileageEntry, Category, DEFAULT_CATEGORIES, DashboardSummary } from '@/types';

interface AppContextType {
  income: Income[];
  expenses: Expense[];
  mileageEntries: MileageEntry[];
  categories: Category[];
  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  addMileageEntry: (entry: Omit<MileageEntry, 'id' | 'createdAt'>) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void; // <-- deleteCategory function
  getDashboardSummary: (period: 'today' | 'week' | 'month') => DashboardSummary;
  getExpensesByCategory: () => { category: string; amount: number; count: number }[];
  getIncomeOverTime: (days: number) => { date: string; amount: number }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [mileageEntries, setMileageEntries] = useState<MileageEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedIncome = localStorage.getItem('driverapp_income');
    const savedExpenses = localStorage.getItem('driverapp_expenses');
    const savedMileage = localStorage.getItem('driverapp_mileage');
    const savedCategories = localStorage.getItem('driverapp_categories');

    if (savedIncome) setIncome(JSON.parse(savedIncome));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedMileage) setMileageEntries(JSON.parse(savedMileage));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('driverapp_income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('driverapp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('driverapp_mileage', JSON.stringify(mileageEntries));
  }, [mileageEntries]);

  useEffect(() => {
    localStorage.setItem('driverapp_categories', JSON.stringify(categories));
  }, [categories]);

  const addIncome = (newIncome: Omit<Income, 'id' | 'createdAt'>) => {
    const income: Income = {
      ...newIncome,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setIncome(prev => [income, ...prev]);
  };

  const addExpense = (newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const addMileageEntry = (newEntry: Omit<MileageEntry, 'id' | 'createdAt'>) => {
    const entry: MileageEntry = {
      ...newEntry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMileageEntries(prev => [entry, ...prev]);
  };

  const addCategory = (name: string) => {
    const category: Category = {
      id: Date.now().toString(),
      name,
      isDefault: false,
    };
    setCategories(prev => [...prev, category]);
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
  };

  const getDateRange = (period: 'today' | 'week' | 'month') => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today': {
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      }
      case 'week': {
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start: weekStart, end: now };
      }
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: now };
      }
      default: {
        return { start: today, end: now };
      }
    }
  };

  const getDashboardSummary = (period: 'today' | 'week' | 'month'): DashboardSummary => {
    const { start, end } = getDateRange(period);
    
    const filteredIncome = income.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    
    const filteredExpenses = expenses.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    
    const filteredMileage = mileageEntries.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });

    const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    const totalMileage = filteredMileage.reduce((sum, item) => sum + (item.endMileage - item.startMileage), 0);
    const businessMileage = filteredMileage
      .filter(item => item.purpose === 'business')
      .reduce((sum, item) => sum + (item.endMileage - item.startMileage), 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      totalMileage,
      businessMileage,
    };
  };

  const getExpensesByCategory = () => {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    
    expenses.forEach(expense => {
      const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
      categoryMap.set(expense.category, {
        amount: existing.amount + expense.amount,
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count
    }));
  };

  const getIncomeOverTime = (days: number) => {
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayIncome = income
        .filter(item => item.date === dateStr)
        .reduce((sum, item) => sum + item.amount, 0);
      
      result.push({
        date: dateStr,
        amount: dayIncome
      });
    }
    
    return result;
  };

  return (
    <AppContext.Provider value={{
      income,
      expenses,
      mileageEntries,
      categories,
      addIncome,
      addExpense,
      addMileageEntry,
      addCategory,
      deleteCategory, // add to context
      getDashboardSummary,
      getExpensesByCategory,
      getIncomeOverTime,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
