import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import SharedLayout from './layout';
import { UserRole } from './types';

// Admin Pages
import {
  Dashboard as AdminDashboard,
  Users,
  User as UserDetail,
  EditUser,
} from './pages/admin';

// User Pages
import {
  Dashboard as UserDashboard,
  Investments,
  InvestmentDetail,
  AddInvestment,
  EditInvestment,
  Transactions,
  AddTransaction,
  Reports,
  PerformanceSummary,
  InvestmentDistribution,
  TransactionHistory,
  YearOverYearComparison,
  TopPerformingInvestments,
  UserProfile,
  Portfolios,
  PortfolioDetail,
} from './pages/public';

// Auth Pages
import {
  UserLogin,
  EmailVerification,
  UserRegistration,
  PasswordReset,
  PasswordResetRequest,
} from './pages/auth';

// Error Pages
import {
  NotFound,
  Forbidden,
  ProtectedRoute,
  PublicRoute,
} from './pages/errors';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path='/auth/login'
            element={
              <PublicRoute>
                <UserLogin />
              </PublicRoute>
            }
          />
          <Route
            path='/auth/register'
            element={
              <PublicRoute>
                <UserRegistration />
              </PublicRoute>
            }
          />
          <Route
            path='/auth/forgot-password'
            element={
              <PublicRoute>
                <PasswordResetRequest />
              </PublicRoute>
            }
          />
          <Route
            path='/auth/reset-password'
            element={
              <PublicRoute>
                <PasswordReset />
              </PublicRoute>
            }
          />
          <Route path='/auth/verify-email' element={<EmailVerification />} />

          {/* Protected Routes - Requires Authentication */}
          <Route element={<ProtectedRoute requireAuth={true} />}>
            <Route path='/' element={<SharedLayout />}>
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to='/dashboard' replace />} />

              {/* User Dashboard - All authenticated users */}
              <Route path='dashboard' element={<UserDashboard />} />
              <Route path='profile' element={<UserProfile />} />

              {/* Portfolios Management */}
              <Route path='portfolios' element={<Portfolios />} />
              <Route
                path='portfolios/:portfolioId'
                element={<PortfolioDetail />}
              />

              {/* Investments Management */}
              <Route path='investments' element={<Investments />} />
              <Route path='investments/add' element={<AddInvestment />} />
              <Route
                path='investments/:investmentId'
                element={<InvestmentDetail />}
              />
              <Route
                path='investments/:investmentId/edit'
                element={<EditInvestment />}
              />

              {/* Transactions Management */}
              <Route path='transactions' element={<Transactions />} />
              <Route path='transactions/add' element={<AddTransaction />} />

              {/* Reports */}
              <Route path='reports' element={<Reports />} />
              <Route
                path='reports/performance-summary'
                element={<PerformanceSummary />}
              />
              <Route
                path='reports/investment-distribution'
                element={<InvestmentDistribution />}
              />
              <Route
                path='reports/transaction-history'
                element={<TransactionHistory />}
              />
              <Route
                path='reports/year-over-year'
                element={<YearOverYearComparison />}
              />
              <Route
                path='reports/top-performing'
                element={<TopPerformingInvestments />}
              />

              {/* Admin Routes - Only for Admin role */}
              <Route
                element={
                  <ProtectedRoute
                    requireAuth={true}
                    allowedRoles={[UserRole.Admin]}
                  />
                }
              >
                <Route path='admin'>
                  <Route
                    index
                    element={<Navigate to='/admin/dashboard' replace />}
                  />
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='users' element={<Users />} />
                  <Route path='users/:userId' element={<UserDetail />} />
                  <Route path='users/:userId/edit' element={<EditUser />} />
                </Route>
              </Route>

              {/* Forbidden Page */}
              <Route path='forbidden' element={<Forbidden />} />
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
