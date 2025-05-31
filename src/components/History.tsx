
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingDown, Car, Calendar } from 'lucide-react';

const History = () => {
  const { income, expenses, mileageEntries } = useApp();

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Transaction History</h1>

      <Tabs defaultValue="income" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income" className="text-xs md:text-sm">Income</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs md:text-sm">Expenses</TabsTrigger>
          <TabsTrigger value="mileage" className="text-xs md:text-sm">Mileage</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                Income History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {income.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Date</TableHead>
                        <TableHead className="text-xs md:text-sm">Platform</TableHead>
                        <TableHead className="text-xs md:text-sm">Amount</TableHead>
                        <TableHead className="hidden md:table-cell text-xs md:text-sm">Time Period</TableHead>
                        <TableHead className="hidden lg:table-cell text-xs md:text-sm">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {income.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs md:text-sm">{formatDate(entry.date)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{entry.platform}</Badge>
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold text-xs md:text-sm">
                            {formatCurrency(entry.amount)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs md:text-sm">
                            {entry.startTime && entry.endTime 
                              ? `${entry.startTime} - ${entry.endTime}`
                              : '-'
                            }
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-xs truncate text-xs md:text-sm">
                            {entry.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm md:text-base">
                  No income entries yet. Start by adding your first trip income!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                Expense History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Date</TableHead>
                        <TableHead className="text-xs md:text-sm">Category</TableHead>
                        <TableHead className="text-xs md:text-sm">Amount</TableHead>
                        <TableHead className="hidden md:table-cell text-xs md:text-sm">Description</TableHead>
                        <TableHead className="hidden lg:table-cell text-xs md:text-sm">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs md:text-sm">{formatDate(entry.date)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
                          </TableCell>
                          <TableCell className="text-red-600 font-semibold text-xs md:text-sm">
                            {formatCurrency(entry.amount)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-xs truncate text-xs md:text-sm">
                            {entry.description || '-'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs md:text-sm">
                            {entry.receiptPhoto ? (
                              <Badge variant="outline" className="text-green-600 text-xs">
                                Attached
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm md:text-base">
                  No expenses recorded yet. Start tracking your business expenses!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mileage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Car className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                Mileage History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mileageEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Date</TableHead>
                        <TableHead className="hidden md:table-cell text-xs md:text-sm">Start</TableHead>
                        <TableHead className="hidden md:table-cell text-xs md:text-sm">End</TableHead>
                        <TableHead className="text-xs md:text-sm">Miles</TableHead>
                        <TableHead className="text-xs md:text-sm">Purpose</TableHead>
                        <TableHead className="hidden lg:table-cell text-xs md:text-sm">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mileageEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs md:text-sm">{formatDate(entry.date)}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs md:text-sm">{entry.startMileage.toFixed(1)}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs md:text-sm">{entry.endMileage.toFixed(1)}</TableCell>
                          <TableCell className="font-semibold text-xs md:text-sm">
                            {(entry.endMileage - entry.startMileage).toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={entry.purpose === 'business' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {entry.purpose}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-xs truncate text-xs md:text-sm">
                            {entry.description || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm md:text-base">
                  No mileage entries yet. Start logging your trips!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
