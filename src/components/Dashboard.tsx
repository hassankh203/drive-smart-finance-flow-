
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, Car } from 'lucide-react';
import AddIncomeDialog from './AddIncomeDialog';
import AddExpenseDialog from './AddExpenseDialog';
import AddMileageDialog from './AddMileageDialog';

const Dashboard = () => {
  const { getDashboardSummary } = useApp();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMileage, setShowAddMileage] = useState(false);

  const summary = getDashboardSummary(period);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button onClick={() => setShowAddIncome(true)} className="bg-green-600 hover:bg-green-700 text-sm md:text-base">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Income
          </Button>
          <Button onClick={() => setShowAddExpense(true)} variant="outline" className="text-sm md:text-base">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button onClick={() => setShowAddMileage(true)} variant="outline" className="text-sm md:text-base">
            <Car className="w-4 h-4 mr-2" />
            Log Mileage
          </Button>
        </div>
      </div>

      <Tabs value={period} onValueChange={(value) => setPeriod(value as 'today' | 'week' | 'month')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-green-600">
                  ${summary.totalIncome.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-red-600">
                  ${summary.totalExpenses.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className={`h-4 w-4 ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${summary.netProfit.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Business Miles</CardTitle>
                <Car className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-blue-600">
                  {summary.businessMileage.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total: {summary.totalMileage.toFixed(1)} miles
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowAddExpense(true)} 
                  className="w-full justify-start text-sm md:text-base" 
                  variant="outline"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Quick Expense Entry
                </Button>
                <Button 
                  onClick={() => setShowAddIncome(true)} 
                  className="w-full justify-start text-sm md:text-base" 
                  variant="outline"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Log Trip Income
                </Button>
                <Button 
                  onClick={() => setShowAddMileage(true)} 
                  className="w-full justify-start text-sm md:text-base" 
                  variant="outline"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Record Mileage
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Period Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Profit Margin:</span>
                    <span className={`font-semibold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.totalIncome > 0 ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Business Mileage:</span>
                    <span className="font-semibold">{summary.businessMileage.toFixed(1)} miles</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Avg. per Mile:</span>
                    <span className="font-semibold">
                      ${summary.businessMileage > 0 ? (summary.netProfit / summary.businessMileage).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AddIncomeDialog open={showAddIncome} onOpenChange={setShowAddIncome} />
      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
      <AddMileageDialog open={showAddMileage} onOpenChange={setShowAddMileage} />
    </div>
  );
};

export default Dashboard;
