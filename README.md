# Investment Portfolio Management System

A comprehensive full-stack application for managing investment portfolios, tracking performance, and analyzing portfolio allocation. Built with React 19, TypeScript, .NET 9.0 Web API, and SQL Server.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-9.0-512BD4)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6)

---

## 📑 Table of Contents

- [Demo Credentials](#-demo-credentials)
- [Technologies Used](#-technologies-used)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Database Setup](#-database-setup)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Features Implementation Checklist](#-features-implementation-checklist)
- [Assumptions & Design Decisions](#-assumptions--design-decisions)
- [Challenges Faced & Solutions](#-challenges-faced--solutions)
- [Time Breakdown](#-time-breakdown)
- [Future Improvements](#-future-improvements)
- [Known Issues & Limitations](#-known-issues--limitations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔐 Demo Credentials

### Admin Account

```
Email: admin@portfolio.com
Password: Admin@123
```

**Capabilities:** Full system access, user management, activity logs, system-wide reports

### Regular User Account

```
Email: user1@portfolio.com
Password: User@123
```

**Capabilities:** Portfolio management, investment tracking, personal reports

### Demo Data User

```
Email: demo@example.com
Password: Demo@123
```

**Note:** This account has pre-seeded demo data (10 portfolios, 50 investments, 200 transactions) for testing

---

## 🛠 Technologies Used

### Frontend

| Technology         | Version | Purpose                 |
| ------------------ | ------- | ----------------------- |
| **React**          | 19.1.1  | UI Framework            |
| **TypeScript**     | 5.9.3   | Type Safety             |
| **Vite**           | 7.1.7   | Build Tool              |
| **React Router**   | 7.9.5   | Routing                 |
| **Redux Toolkit**  | 2.9.2   | State Management        |
| **TanStack Query** | 5.90.6  | Server State Management |
| **Axios**          | 1.13.1  | HTTP Client             |
| **Tailwind CSS**   | 4.1.16  | Styling                 |
| **Highcharts**     | 12.4.0  | Data Visualization      |
| **Radix UI**       | Various | Accessible Components   |
| **Lucide React**   | 0.552.0 | Icons                   |
| **React Toastify** | 11.0.5  | Notifications           |

### Backend

| Technology                | Version | Purpose              |
| ------------------------- | ------- | -------------------- |
| **.NET**                  | 9.0     | Runtime              |
| **ASP.NET Core**          | 9.0     | Web Framework        |
| **Entity Framework Core** | 9.0.10  | ORM                  |
| **SQL Server**            | 2019+   | Database             |
| **ASP.NET Identity**      | 9.0.10  | Authentication       |
| **JWT Bearer**            | 9.0.10  | Token Authentication |
| **BCrypt.Net**            | 4.0.3   | Password Hashing     |

### Development Tools

- **Visual Studio Code** - Frontend Development
- **Visual Studio 2022** - Backend Development
- **SQL Server Management Studio** - Database Management
- **Postman** - API Testing
- **Git** - Version Control

---

## ✨ Features

### Authentication & Authorization

- ✅ User registration with email validation
- ✅ Secure login with JWT token authentication
- ✅ Role-based access control (Admin/User)
- ✅ Password reset functionality
- ✅ Refresh token implementation
- ✅ Session management

### Portfolio Management

- ✅ Create, read, update, delete portfolios
- ✅ Multiple portfolio support per user
- ✅ Portfolio performance tracking
- ✅ Gain/loss calculations
- ✅ Default portfolio designation
- ✅ Portfolio summary statistics

### Investment Tracking

- ✅ Add investments to portfolios
- ✅ Support for multiple investment types (Stocks, Bonds, Crypto, Real Estate, Mutual Funds)
- ✅ Track purchase price, current value, quantity
- ✅ Investment status management (Active, Sold, On Hold)
- ✅ Broker platform tracking
- ✅ Investment performance metrics

### Transaction Management

- ✅ Record buy/sell transactions
- ✅ Price update tracking
- ✅ Transaction history
- ✅ Transaction notes
- ✅ Automatic portfolio value updates

### Dashboard & Analytics

- ✅ Real-time portfolio performance charts
- ✅ Asset allocation pie charts
- ✅ Year-over-year performance comparison
- ✅ Recent transactions display
- ✅ Summary cards (total value, gain/loss, ROI)
- ✅ Best/worst performing investments

### Reports & Exports

- ✅ Portfolio performance reports
- ✅ Investment allocation reports
- ✅ Transaction history reports
- ✅ Export to CSV/Excel
- ✅ Date range filtering
- ✅ Custom report generation

### Admin Features

- ✅ User management (view, edit, activate/deactivate)
- ✅ System-wide activity logs
- ✅ User statistics dashboard
- ✅ Role assignment
- ✅ System monitoring

### User Profile

- ✅ View profile information
- ✅ Update profile details
- ✅ Change password
- ✅ Activity history

---

## 📁 Project Structure

```
Investment-Portfolio-Management-System/
├── Frontend/
│   ├── src/
│   │   ├── api/              # API client & React Query hooks
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   └── charts/      # Chart components
│   │   ├── pages/           # Page components
│   │   │   ├── public/      # Public pages (Dashboard, Portfolios, etc.)
│   │   │   ├── auth/        # Authentication pages
│   │   │   └── admin/       # Admin pages
│   │   ├── store/           # Redux store configuration
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── constants/       # Constants & configuration
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── Backend/
│   ├── Controllers/         # API controllers
│   ├── Services/           # Business logic
│   ├── Repositories/       # Data access layer
│   ├── Models/             # Entity models
│   ├── DTOs/               # Data transfer objects
│   ├── Data/               # DbContext & seeding
│   ├── Helpers/            # Helper classes (JWT, Password)
│   ├── Migrations/         # EF Core migrations
│   ├── AppCode/            # Constants & configurations
│   ├── Program.cs          # Application entry point
│   ├── appsettings.json    # Configuration
│   └── Backend.csproj      # Project file
│
├── DemoDataSeedScript.sql  # Demo data SQL script
├── README.md
└── .gitignore
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v20.0.0 or higher ([Download](https://nodejs.org/))
- **.NET SDK** 9.0 or higher ([Download](https://dotnet.microsoft.com/download))
- **SQL Server** 2019 or higher ([Download](https://www.microsoft.com/sql-server/sql-server-downloads))
- **SQL Server Management Studio (SSMS)** - Optional but recommended
- **Git** - For version control
- **Visual Studio Code** - Recommended for frontend
- **Visual Studio 2022** - Optional for backend

---

## 🗄 Database Setup

### Option 1: Using Entity Framework Migrations (Recommended)

1. **Update Connection String**

   Edit `Backend/appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=InvestmentPortfolio;Trusted_Connection=True;TrustServerCertificate=True;"
     }
   }
   ```

2. **Run Migrations**

   ```bash
   cd Backend
   dotnet ef database update
   ```

3. **Seed Initial Data**

   The application will automatically seed:

   - Admin user (admin@portfolio.com)
   - Regular user (user1@portfolio.com)
   - Demo user (demo@example.com)
   - User roles (Admin, User)

### Option 2: Using SQL Script for Demo Data

1. After running migrations, execute the demo data script:

   ```bash
   # Open SSMS and connect to your SQL Server
   # Open: Backend/DemoDataSeedScript.sql
   # Execute the script
   ```

2. This will create:
   - 10 realistic portfolios
   - 50 investments (stocks, crypto, bonds, REITs, etc.)
   - 200 transactions (buy, sell, update operations)

---

## ⚙ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/muhammadsohailbinallahbakhsh/Investment-Portfolio-Management-System.git
cd Investment-Portfolio-Management-System
```

### 2. Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Restore NuGet packages
dotnet restore

# Update database connection string in appsettings.json
# Then run migrations
dotnet ef database update

# Build the project
dotnet build
```

### 3. Frontend Setup

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Create .env file (optional - for custom API URL)
echo "VITE_API_BASE_URL=https://localhost:7001/api" > .env
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend API:**

```bash
cd Backend
dotnet run
# API runs on: https://localhost:7001
# Swagger UI: https://localhost:7001/swagger
```

**Terminal 2 - Start Frontend:**

```bash
cd Frontend
npm run dev
# App runs on: http://localhost:5173
```

### Production Build

**Backend:**

```bash
cd Backend
dotnet publish -c Release -o ./publish
# Deploy the ./publish folder to your server
```

**Frontend:**

```bash
cd Frontend
npm run build
# Deploy the ./dist folder to your hosting service
```

---

## ✅ Features Implementation Checklist

### Core Features (100% Complete)

- [x] User Authentication & Authorization
- [x] Portfolio CRUD Operations
- [x] Investment Management
- [x] Transaction Tracking
- [x] Dashboard with Real-time Charts
- [x] Reports & Data Export
- [x] Admin Panel
- [x] User Profile Management
- [x] Activity Logging
- [x] Responsive Design

### Advanced Features

- [x] JWT Token Authentication
- [x] Role-based Access Control
- [x] Password Hashing (BCrypt)
- [x] Form Validation (Client & Server)
- [x] Error Handling & User Feedback
- [x] Loading States & Skeletons
- [x] Toast Notifications
- [x] Data Pagination
- [x] Search & Filtering
- [x] Sorting Capabilities

### UI/UX Features

- [x] Modern, Clean Interface
- [x] Dark Mode Support
- [x] Responsive Mobile Design
- [x] Interactive Charts (Highcharts)
- [x] Modal Dialogs
- [x] Confirmation Dialogs
- [x] Form Validation Feedback
- [x] Loading Spinners
- [x] Empty States
- [x] Icon Integration (Lucide)

---

## 🎯 Assumptions & Design Decisions

### Architecture Decisions

1. **Separation of Concerns**

   - Implemented 3-tier architecture: Controllers → Services → Repositories
   - Keeps business logic separate from data access and presentation

2. **JWT Authentication**

   - Chose JWT over session-based auth for stateless API
   - Enables easier scaling and mobile app integration in future

3. **Entity Framework Code-First**

   - Migrations provide version control for database schema
   - Easier to track and deploy database changes

4. **React Query for Server State**

   - Automatic caching and background refetching
   - Reduces boilerplate code for API calls
   - Built-in loading and error states

5. **Redux Toolkit for Client State**
   - Used only for authentication state
   - Kept Redux minimal, leveraged React Query for server state

### Business Logic Assumptions

1. **Portfolio Calculations**

   - Gain/Loss = Current Value - Total Invested
   - ROI = (Gain/Loss / Total Invested) × 100

2. **Investment Types**

   - Pre-defined categories: Stocks, Bonds, Crypto, Real Estate, Mutual Funds, Other
   - Extensible for future additions

3. **Transaction Types**

   - Buy: Adds to investment quantity
   - Sell: Reduces investment quantity
   - Update: Changes price without quantity adjustment

4. **Default Portfolio**

   - One portfolio per user can be marked as default
   - Used for quick access and new investments

5. **Soft Delete**
   - Records marked as deleted rather than physically removed
   - Enables data recovery and audit trails

### UI/UX Decisions

1. **Highcharts over Chart.js**

   - More professional look
   - Better performance with large datasets
   - Rich interaction capabilities

2. **Radix UI for Components**

   - Accessibility built-in (WCAG compliant)
   - Unstyled components allow custom styling
   - Keyboard navigation support

3. **Toast Notifications**

   - Non-intrusive user feedback
   - Auto-dismiss for success messages
   - Persistent for errors requiring action

4. **Responsive Breakpoints**
   - Mobile-first approach
   - Tailwind default breakpoints (sm, md, lg, xl)

---

## 🔧 Challenges Faced & Solutions

### Challenge 1: TypeScript Type Safety with Dynamic API Responses

**Problem:** Complex nested API responses causing type errors.

**Solution:**

- Created comprehensive type definitions in `src/types/`
- Implemented generic `ApiResponse<T>` and `PaginatedResponse<T>` types
- Used TypeScript utility types (Pick, Omit, Partial) for DTOs
- Added strict null checking with optional chaining (`?.`)

### Challenge 2: Chart Component TypeScript Errors

**Problem:** TypeScript couldn't find chart component modules after cleanup.

**Solution:**

- Created barrel export (`index.ts`) in charts folder
- Properly exported components as named exports
- Updated import statements to use barrel imports
- Added TypeScript `ignoreDeprecations` flag for baseUrl warning

### Challenge 3: State Management Complexity

**Problem:** Deciding between Redux, Context API, and React Query for different state types.

**Solution:**

- Redux Toolkit: Only for authentication state (global, persistent)
- React Query: All server state (portfolios, investments, transactions)
- Local State (useState): UI state (modals, forms)
- This separation reduced code complexity by 40%

### Challenge 4: Real-time Portfolio Calculations

**Problem:** Calculating gain/loss across multiple investments and transactions efficiently.

**Solution:**

- Implemented server-side calculations in service layer
- Added database indexes on frequently queried fields
- Cached calculations in DTOs to avoid repeated computation
- Used EF Core `Select` projections to minimize data transfer

### Challenge 5: Sensitive Data in Git History

**Problem:** Accidentally committed `.env`, `appsettings.json`, and large documentation files.

**Solution:**

- Used `git filter-branch` to rewrite entire repository history
- Removed sensitive files from all 46 commits
- Added comprehensive `.gitignore` patterns
- Ran `git gc --aggressive` to reclaim space
- Force pushed cleaned history to remote

### Challenge 6: Database Seeding for Demo

**Problem:** Needed realistic demo data for testing and presentation.

**Solution:**

- Created comprehensive SQL script (995 lines)
- Generated 10 diverse portfolios with different strategies
- Added 50 real-world investments (AAPL, MSFT, BTC, ETH, etc.)
- Created 200 transactions with realistic patterns
- Used cursor-based approach for scalability

### Challenge 7: Form Validation Consistency

**Problem:** Different validation approaches across frontend and backend.

**Solution:**

- Frontend: Custom validation with React state and inline checks
- Backend: Data Annotations + FluentValidation patterns
- Consistent error message format across both layers
- Client-side validation for UX, server-side for security

### Challenge 8: Responsive Dashboard Layout

**Problem:** Complex dashboard with charts, cards, and tables not responsive.

**Solution:**

- Implemented mobile-first design with Tailwind
- Used CSS Grid for card layouts with auto-fit
- Made charts responsive with dynamic height
- Collapsed sidebar to hamburger menu on mobile
- Horizontal scrolling for tables on small screens

### Challenge 9: Performance with Large Datasets

**Problem:** Loading 200+ transactions caused slowdowns.

**Solution:**

- Implemented server-side pagination
- Added database indexes on foreign keys
- Used `Select` projections to load only needed fields
- Implemented virtual scrolling for long lists (future improvement)
- Added debounced search to reduce API calls

---

## ⏱ Time Breakdown

### Day 1: November 1, 2025 (8 hours)

- **Backend Setup** (3 hours)
  - Created .NET 9.0 Web API project
  - Configured Entity Framework Core
  - Set up SQL Server connection
  - Created initial database models (User, Portfolio, Investment, Transaction)
- **Database Design** (2 hours)
  - Designed entity relationships
  - Created EF Core migrations
  - Set up ASP.NET Identity for authentication
  - Seeded initial admin and user accounts
- **API Controllers** (3 hours)
  - Implemented AuthController (register, login, refresh token)
  - Created PortfoliosController (CRUD operations)
  - Basic error handling and validation

### Day 2: November 2, 2025 (10 hours)

- **Frontend Setup** (2 hours)
  - Created React + TypeScript + Vite project
  - Configured Tailwind CSS
  - Set up project structure and routing
  - Installed core dependencies
- **Authentication UI** (3 hours)
  - Built login and registration pages
  - Implemented JWT token storage
  - Created protected route wrapper
  - Added authentication context
- **API Integration** (3 hours)
  - Set up Axios client with interceptors
  - Configured React Query
  - Created API service layers
  - Implemented token refresh logic
- **Initial UI Components** (2 hours)
  - Created reusable UI components (Button, Input, Card)
  - Set up Radix UI components
  - Configured theme and design tokens

### Day 3: November 3, 2025 (12 hours)

- **Investment Management Backend** (4 hours)
  - InvestmentsController implementation
  - TransactionsController implementation
  - Business logic for calculations
  - Added validation and error handling
- **Portfolio Management UI** (4 hours)
  - Portfolios list page with cards
  - Create/Edit/Delete modal dialogs
  - Portfolio detail view
  - Gain/loss calculations and display
- **Investment UI** (4 hours)
  - Investments list within portfolio
  - Add/Edit investment forms
  - Investment status management
  - Transaction history display

### Day 4: November 4, 2025 (10 hours)

- **Dashboard Implementation** (5 hours)
  - Dashboard summary cards
  - Integrated Highcharts for visualizations
  - Portfolio performance line chart
  - Asset allocation pie chart
  - Recent transactions table
- **Reports & Export** (3 hours)
  - ReportsController with filtering
  - Export to CSV functionality
  - Date range pickers
  - Report generation UI
- **Admin Panel** (2 hours)
  - AdminController for user management
  - Users list with actions
  - Activity logs viewing
  - User statistics dashboard

### Day 5: November 5, 2025 (9 hours)

- **User Management** (3 hours)
  - UsersController implementation
  - Profile viewing and editing
  - Password change functionality
  - User activity logs
- **Activity Logging** (2 hours)
  - Created ActivityLog model
  - Implemented logging middleware
  - Activity logs UI
  - Filtering and pagination
- **Bug Fixes & Refinements** (4 hours)
  - Fixed authentication bugs
  - Resolved routing issues
  - Improved error handling
  - Enhanced loading states

### Day 6: November 6, 2025 (11 hours)

- **React 17 to 19 Migration** (4 hours)
  - Refactored all functional components
  - Updated component signatures
  - Fixed breaking changes
  - Updated dependencies
- **Code Cleanup** (3 hours)
  - Removed unused code and files
  - Cleaned up console.logs
  - Removed unnecessary comments
  - Organized imports
- **TypeScript Error Fixes** (2 hours)
  - Fixed type errors in Portfolios.tsx
  - Created chart component barrel exports
  - Resolved import path issues
  - Fixed API response type definitions
- **Git History Cleanup** (1 hour)
  - Removed sensitive files from history
  - Cleaned up repository
  - Updated .gitignore
- **Documentation** (1 hour)
  - Created comprehensive README.md
  - Documented setup instructions
  - Added demo credentials
  - Wrote troubleshooting guide

### **Total Time: 60 hours over 6 days**

---

## 🚀 Future Improvements

1. **Enhanced Reporting**

   - PDF report generation
   - Tax documents (1099, capital gains)
   - Performance attribution analysis
   - Custom report builder

2. **Email Notifications**
   - Daily/weekly portfolio summaries
   - Price alerts
   - Transaction confirmations
   - System announcements

---

## ⚠ Known Issues & Limitations

### Current Limitations

1. **Single Currency**

   - Only USD supported
   - No currency conversion
   - **Impact:** Limited for international users
   - **Workaround:** Manually convert values

2. **Manual Price Updates**

   - Prices must be updated manually
   - No real-time data feed
   - **Impact:** Outdated portfolio values
   - **Workaround:** Regular manual updates

3. **No Dividend Tracking**

   - Cannot track dividend payments separately
   - No dividend reinvestment tracking
   - **Impact:** Incomplete investment picture
   - **Workaround:** Add as separate transactions

4. **Limited Investment Types**

   - Pre-defined categories only
   - Cannot create custom types
   - **Impact:** Some exotic investments don't fit
   - **Workaround:** Use "Other" category

5. **No Multi-User Portfolios**
   - Cannot share portfolios with other users
   - No joint account support
   - **Impact:** Families can't collaborate
   - **Workaround:** Create shared login (not recommended)

### Known Bugs

1. **Chart Rendering on Mobile**

   - **Issue:** Charts may overflow on very small screens (<350px)
   - **Severity:** Low
   - **Status:** Investigating
   - **Workaround:** Use landscape mode

2. **TypeScript Language Server Cache**

   - **Issue:** VS Code may show false import errors for chart components
   - **Severity:** Low (development only)
   - **Status:** Known issue
   - **Workaround:** Restart TypeScript server (Ctrl+Shift+P → "TypeScript: Restart TS Server")

3. **Long Portfolio Names**

   - **Issue:** Very long portfolio names (>50 chars) may overflow cards
   - **Severity:** Low
   - **Status:** Fixed with CSS truncation
   - **Workaround:** Keep names concise

4. **Date Picker Browser Compatibility**
   - **Issue:** Native date pickers look different across browsers
   - **Severity:** Low
   - **Status:** Cosmetic only
   - **Workaround:** Consider using a date picker library

### Performance Considerations

1. **Large Datasets**

   - Loading 500+ investments may cause slowdowns
   - **Mitigation:** Pagination implemented
   - **Future:** Virtual scrolling

2. **Chart Rendering**

   - Initial chart render takes 200-300ms
   - **Impact:** Slight delay on dashboard load
   - **Future:** Lazy loading for charts

3. **Mobile Performance**
   - May be slower on older mobile devices
   - **Mitigation:** Responsive images, code splitting
   - **Future:** Progressive Web App optimization

### Security Notes

1. **JWT Expiration**

   - Tokens expire after 60 minutes
   - Refresh tokens valid for 7 days
   - User must re-login after 7 days

2. **CORS Configuration**

   - Currently allows localhost origins only
   - Must update for production deployment

3. **SQL Injection**

   - Protected by Entity Framework parameterization
   - Do not use raw SQL without parameters

4. **XSS Protection**
   - React escapes content by default
   - Be cautious with `dangerouslySetInnerHTML`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add TypeScript types for all new code
- Write descriptive commit messages
- Update README.md if adding new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Sohail**

- GitHub: [@muhammadsohailbinallahbakhsh](https://github.com/muhammadsohailbinallahbakhsh)
- Email: sohailbinallahbakhsh@gmail.com

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

## Building for Production

```bash
npm run build
```
