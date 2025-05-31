
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, FileText } from 'lucide-react';

const Reports = () => {
  const { getExpensesByCategory, getIncomeOverTime, getDashboardSummary } = useApp();
  const [period, setPeriod] = useState('7');

  const expenseData = getExpensesByCategory();
  const incomeData = getIncomeOverTime(parseInt(period));
  const summary = getDashboardSummary('month');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const chartConfig = {
    amount: {
      label: "Amount",
    },
    income: {
      label: "Income",
    },
    expenses: {
      label: "Expenses",
    },
  };

  const profitData = incomeData.map(day => {
    const expenses = 0; // You could calculate daily expenses here
    return {
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: day.amount,
      profit: day.amount - expenses
    };
  });

  const exportData = () => {
    const data = {
      summary,
      expenses: expenseData,
      income: incomeData,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex flex-col gap-3 md:flex-row">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline" className="text-sm md:text-base">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Expense Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, amount }) => `${category}: $${amount.toFixed(0)}`}
                      outerRadius={window.innerWidth < 768 ? 60 : 80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground text-sm md:text-base">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={window.innerWidth < 768 ? 10 : 12}
                    angle={window.innerWidth < 768 ? -45 : 0}
                    textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                  />
                  <YAxis fontSize={window.innerWidth < 768 ? 10 : 12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    dot={{ fill: '#00C49F' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Expense Categories Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    height={window.innerWidth < 768 ? 60 : 80}
                    fontSize={window.innerWidth < 768 ? 10 : 12}
                  />
                  <YAxis fontSize={window.innerWidth < 768 ? 10 : 12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                  <div className="text-xs md:text-sm text-green-600 font-medium">Total Income</div>
                  <div className="text-lg md:text-2xl font-bold text-green-700">
                    ${summary.totalIncome.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-red-50 rounded-lg">
                  <div className="text-xs md:text-sm text-red-600 font-medium">Total Expenses</div>
                  <div className="text-lg md:text-2xl font-bold text-red-700">
                    ${summary.totalExpenses.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-xs md:text-sm text-blue-600 font-medium">Net Profit</div>
                <div className={`text-2xl md:text-3xl font-bold ${summary.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${summary.netProfit.toFixed(2)}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Profit margin: {summary.totalIncome > 0 ? ((summary.netProfit / summary.totalIncome) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                <div className="text-xs md:text-sm text-purple-600 font-medium">Business Mileage</div>
                <div className="text-lg md:text-2xl font-bold text-purple-700">
                  {summary.businessMileage.toFixed(1)} miles
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Est. deduction: ${(summary.businessMileage * 0.655).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
