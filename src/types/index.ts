
export interface Income {
  id: string;
  date: string;
  amount: number;
  platform: string;
  notes?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
  receiptPhoto?: string;
  createdAt: string;
}

export interface MileageEntry {
  id: string;
  date: string;
  startMileage: number;
  endMileage: number;
  purpose: 'business' | 'personal';
  description?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalMileage: number;
  businessMileage: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Gas', isDefault: true },
  { id: '2', name: 'Maintenance', isDefault: true },
  { id: '3', name: 'Car Wash', isDefault: true },
  { id: '4', name: 'Phone', isDefault: true },
  { id: '5', name: 'Insurance', isDefault: true },
  { id: '6', name: 'Tolls', isDefault: true },
];

export const PLATFORMS = [
  'Uber',
  'Lyft',
  'DoorDash',
  'UberEats',
  'Grubhub',
  'Instacart',
  'Other'
];
