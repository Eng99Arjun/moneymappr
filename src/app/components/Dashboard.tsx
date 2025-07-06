'use client';

import React from 'react';
import { Transaction } from '@/types';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import dynamic from 'next/dynamic';

// Lazy load chart components for better performance
const MonthlyBarChart = dynamic(() => import('./charts/MonthlyBarChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

const CategoryPieChart = dynamic(() => import('./charts/CategoryPieChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

const BudgetComparisonChart = dynamic(() => import('./charts/BudgetComparisonChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

export type Budget = {
  category: string;
  amount: number;
  month: string;
};

type DashboardProps = {
  transactions: Transaction[];
  budgets?: Budget[];
};

const Dashboard = React.memo(function Dashboard({ 
  transactions, 
  budgets = [] 
}: DashboardProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Data Available
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add some transactions to see your dashboard
        </p>
      </div>
    );
  }

  const dashboardData = React.useMemo(() => {
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    const categorySpending: Record<string, number> = {};
    transactions.forEach((tx) => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

    return { total, categorySpending };
  }, [transactions]);

  const { total, categorySpending } = dashboardData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Total Expenses Card */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Total Expenses
            </h2>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="text-4xl text-green-600 dark:text-green-400">💰</div>
        </div>
      </Card>

      {/* Budget Progress Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Budget vs Actual
          </h2>
          <span className="text-2xl">🎯</span>
        </div>
        
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 dark:text-gray-400">
              No budgets set for this month
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Set a budget to track your spending
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {budgets.map((budget) => {
              const spent = categorySpending[budget.category] || 0;
              const percent = Math.min((spent / budget.amount) * 100, 100);
              const remaining = Math.max(budget.amount - spent, 0);
              const isOverBudget = spent > budget.amount;
              const isNearLimit = percent > 80 && !isOverBudget;

              // Debug logging
              console.log(`Budget Debug - ${budget.category}:`, {
                spent,
                budgetAmount: budget.amount,
                percent,
                isOverBudget,
                categorySpending
              });

              return (
                <div key={budget.category} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {budget.category}
                    </span>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        isOverBudget ? 'text-red-600' : 
                        isNearLimit ? 'text-yellow-600' : 
                        'text-gray-700 dark:text-gray-300'
                      }`}>
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </div>
                      {!isOverBudget && (
                        <div className="text-xs text-gray-500">
                          {formatCurrency(remaining)} remaining
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Fixed Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{Math.round(percent)}%</span>
                    </div>
                    
                    {/* Custom Progress Bar Implementation */}
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          isOverBudget 
                            ? 'bg-red-500' 
                            : isNearLimit 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(percent, 100)}%`,
                          minWidth: percent > 0 ? '2px' : '0px' // Ensure visibility for small values
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Alternative: Use Radix Progress if available */}
                  {/* <div className="relative">
                    <Progress 
                      value={percent} 
                      className={`h-3 ${
                        isOverBudget ? 'bg-red-100 dark:bg-red-900/30' : 
                        isNearLimit ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                        'bg-gray-100 dark:bg-gray-800'
                      }`}
                    />
                  </div> */}
                  
                  {isOverBudget && (
                    <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <span>⚠️</span>
                      Over budget by {formatCurrency(spent - budget.amount)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyBarChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </div>
      
      {budgets.length > 0 && (
        <BudgetComparisonChart budgets={budgets} actuals={categorySpending} />
      )}
    </div>
  );
});

export default Dashboard;
