import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './layout';

// Admin Pages
// import {
//   AdminDashboard,
//   Users,
//   UserDetail,
//   Investments as AdminInvestments,
//   InvestmentDetail as AdminInvestmentDetail,
//   Transactions as AdminTransactions,
//   Reports as AdminReports,
//   ActivityLog,
// } from './pages/admin';

// User Pages
// import {
//   UserDashboard,
//   Investments,
//   InvestmentDetail,
//   AddInvestment,
//   EditInvestment,
//   Transactions,
//   AddTransaction,
//   Reports,
//   Profile,
// } from './pages/user';

// Auth Pages
import { UserLogin, EmailVerification } from './pages/auth';

// Error Pages
import { NotFound, Forbidden } from './pages/errors';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SharedLayout />}>
          <Route index element={<h1>Dashboard</h1>} />
          <Route path='dashboard' element={<h1>Dashboard</h1>} />
          <Route path='profile' element={<h1>Profile</h1>} />

          <Route path='investments' element={<h1>Investments</h1>} />
          <Route
            path='investments/:investmentId'
            element={<h1>Investment Detail</h1>}
          />
          <Route path='investments/add' element={<h1>Add Investment</h1>} />
          <Route
            path='investments/:investmentId/edit'
            element={<h1>Edit Investment</h1>}
          />

          <Route path='transactions' element={<h1>Transactions</h1>} />
          <Route path='transactions/add' element={<h1>Add Transaction</h1>} />

          <Route path='reports' element={<h1>Reports</h1>} />

          <Route path='admin'>
            <Route index element={<h1>Admin Dashboard</h1>} />
            <Route path='dashboard' element={<h1>Admin Dashboard</h1>} />
            <Route path='users' element={<h1>Users</h1>} />
            <Route path='users/:userId' element={<h1>User Detail</h1>} />
            <Route path='investments' element={<h1>Admin Investments</h1>} />
            <Route
              path='investments/:investmentId'
              element={<h1>Admin Investment Detail</h1>}
            />
            <Route path='transactions' element={<h1>Admin Transactions</h1>} />
            <Route path='reports' element={<h1>Admin Reports</h1>} />
            <Route path='activity-log' element={<h1>Admin Activity Log</h1>} />
          </Route>

          <Route path='forbidden' element={<Forbidden />} />
        </Route>

        <Route path='auth/login' element={<UserLogin />} />
        <Route path='auth/register' element={<UserLogin />} />
        <Route path='auth/forgot-password' element={<UserLogin />} />
        <Route path='auth/verify-email' element={<EmailVerification />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
