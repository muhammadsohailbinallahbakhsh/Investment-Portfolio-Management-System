# Investment Portfolio Management System

A full-stack application for managing investment portfolios built with React and .NET Web API.

## Project Structure
```
Investment Portfolio Management System/
├── Frontend/          # React frontend application
├── Backend/           # .NET Web API backend
└── Backend.sln        # Solution file
```

## Prerequisites

- Node.js (v16 or higher)
- .NET SDK 6.0 or higher
- SQL Server

## Getting Started

### Install All Dependencies

From the root directory:
```bash
# Frontend
cd Frontend
npm install

# Backend
cd Backend
dotnet restore
dotnet ef database update
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd Backend
dotnet run
# Runs on https://localhost:7001
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
# Runs on http://localhost:5173
```

## Building for Production
```bash
npm run build
```


