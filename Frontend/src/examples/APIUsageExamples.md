```tsx
// ============================================
// API Layer Usage Examples
// ============================================
// This file demonstrates how to use the new API layer
// Delete this file after reviewing the examples

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  // Queries
  usePortfolios,
  usePortfolio,
  useInvestments,
  useInvestment,
  useUserDashboard,
  useRecentTransactions,
  useUser,
  useAdminDashboard,

  // Mutations
  useCreatePortfolio,
  useUpdateInvestment,
  useCreateTransaction,
  useDeletePortfolio,

  // Services (if you need direct API calls)
  portfolioService,
  investmentService,
} from '@/api';
import type { Portfolio, Investment, Transaction } from '@/types';

// ============================================
// Example 1: Simple Data Fetching
// ============================================

export function PortfolioList() {
  const { data, isLoading, error } = usePortfolios(1, 10);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.data) return <div>No data</div>;

  return (
    <div>
      <h2>Total: {data.data.totalCount} portfolios</h2>
      {data.data.items.map((portfolio) => (
        <div key={portfolio.id}>
          <h3>{portfolio.name}</h3>
          <p>Value: ${portfolio.currentValue}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Example 2: Mutations (Create/Update/Delete)
// ============================================

export function PortfolioManager() {
  const createMutation = useCreatePortfolio();
  const deleteMutation = useDeletePortfolio();

  const handleCreate = () => {
    createMutation.mutate(
      {
        name: 'My New Portfolio',
        description: 'Tech stocks',
      },
      {
        onSuccess: (response) => {
          console.log('Created!', response.data);
          // Automatically refreshes portfolio list
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate(id);
      // Automatically shows success toast and refreshes list
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Portfolio'}
      </button>
    </div>
  );
}

// ============================================
// Example 3: Filtering and Pagination
// ============================================

export function InvestmentList() {
  const [filters, setFilters] = useState({
    portfolioId: undefined,
    type: 'Stock',
    status: 'Active',
    searchTerm: '',
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortOrder: 'asc' as const,
  });

  const { data, isLoading, isFetching } = useInvestments(filters);

  return (
    <div>
      {isFetching && <div>Refreshing...</div>}

      <input
        placeholder='Search...'
        value={filters.searchTerm}
        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
      />

      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <option value=''>All Types</option>
        <option value='Stock'>Stock</option>
        <option value='Bond'>Bond</option>
        <option value='ETF'>ETF</option>
      </select>

      {data?.data?.items.map((investment) => (
        <div key={investment.id}>{investment.name}</div>
      ))}
    </div>
  );
}

// ============================================
// Example 4: Dependent Queries
// ============================================

export function PortfolioDetails({ portfolioId }: { portfolioId: number }) {
  // First query - portfolio details
  const { data: portfolio, isLoading: loadingPortfolio } =
    usePortfolio(portfolioId);

  // Second query - only runs when portfolio exists
  const { data: investments } = useInvestments(
    { portfolioId }
    //{ enabled: !!portfolio }
  );

  if (loadingPortfolio) return <div>Loading...</div>;

  return (
    <div>
      <h1>{portfolio?.data?.name}</h1>
      <p>Total Value: ${portfolio?.data?.currentValue}</p>

      <h2>Investments</h2>
      {investments?.data?.items.map((inv) => (
        <div key={inv.id}>{inv.name}</div>
      ))}
    </div>
  );
}

// ============================================
// Example 5: Dashboard with Multiple Queries
// ============================================

export function Dashboard() {
  const { data: stats } = useUserDashboard();
  const { data: recentTx } = useRecentTransactions(5);

  return (
    <div>
      <div className='stats-grid'>
        <div>Total Value: ${stats?.data?.currentValue}</div>
        <div>Total Portfolios: {stats?.data?.totalPortfolios}</div>
        <div>Total Investments: {stats?.data?.totalInvestments}</div>
        <div>
          Gain/Loss: ${stats?.data?.totalGainLoss}(
          {stats?.data?.totalGainLossPercentage}%)
        </div>
      </div>

      <h2>Recent Transactions</h2>
      {recentTx?.data?.map((tx) => (
        <div key={tx.id}>
          {tx.investmentName} - {tx.type} - ${tx.amount}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Example 6: Complex Mutation with Update
// ============================================

export function InvestmentEditor({ investmentId }: { investmentId: number }) {
  const { data: investment } = useInvestment(investmentId);
  const updateMutation = useUpdateInvestment();

  const handleSave = (formData: any) => {
    updateMutation.mutate(
      {
        id: investmentId,
        data: {
          name: formData.name,
          currentValue: formData.currentValue,
          notes: formData.notes,
        },
      },
      {
        onSuccess: () => {
          // Automatically invalidates and refetches:
          // - investment detail
          // - investments list
          // - portfolio data
          // - dashboard stats
          console.log('Saved!');
        },
      }
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); /* handleSave */
      }}
    >
      {/* Form fields */}
      <button type='submit' disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
      </button>

      {updateMutation.isError && (
        <div className='error'>{updateMutation.error.message}</div>
      )}
    </form>
  );
}

// ============================================
// Example 7: Direct Service Call (Advanced)
// ============================================
// Use this only when you can't use React Query hooks
// (e.g., in utility functions, middleware, etc.)

export async function exportPortfolioData(portfolioId: number) {
  try {
    const response = await portfolioService.getById(portfolioId);

    if (response.success && response.data) {
      const portfolio = response.data;
      // Process and export data
      console.log('Exporting:', portfolio.name);
    }
  } catch (error) {
    console.error('Export failed:', error);
  }
}

// ============================================
// Example 8: Custom Query Options
// ============================================

export function AutoRefreshingStats() {
  const { data } = useUserDashboard({
    // Refetch every 30 seconds
    refetchInterval: 30000,

    // Refetch when window gains focus
    refetchOnWindowFocus: true,

    // Keep previous data while fetching new
    placeholderData: (previousData) => previousData,

    // Custom error handling
    onError: (error) => {
      console.error('Failed to fetch stats:', error);
    },
  });

  return <div>{/* Render stats */}</div>;
}

// ============================================
// Example 9: Optimistic Updates
// ============================================

export function OptimisticPortfolio() {
  const queryClient = useQueryClient();

  const updateMutation = useUpdateInvestment({
    // Before mutation
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['investments', variables.id],
      });

      // Snapshot current value
      const previous = queryClient.getQueryData(['investments', variables.id]);

      // Optimistically update cache
      queryClient.setQueryData(['investments', variables.id], (old: any) => ({
        ...old,
        data: { ...old?.data, ...variables.data },
      }));

      return { previous };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['investments', variables.id],
        context?.previous
      );
    },
  });

  return <div>{/* UI with instant feedback */}</div>;
}

// ============================================
// Example 10: Conditional Queries
// ============================================

export function ConditionalData({ userId }: { userId?: string }) {
  // Only fetch if userId exists
  const { data: user } = useUser(userId || '', {
    enabled: !!userId, // Don't run query if userId is empty
  });

  // Only fetch if user is loaded and is admin
  const { data: adminData } = useAdminDashboard({
    enabled: !!user && user.data?.role === 'Admin',
  });

  return <div>{/* Render based on conditions */}</div>;
}

export default function APIExamples() {
  return (
    <div>
      <h1>API Layer Usage Examples</h1>
      <p>See the source code of this file for examples</p>
    </div>
  );
}
```
