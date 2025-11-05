-- =====================================================
-- Demo Data Seed Script for Investment Portfolio Management System
-- =====================================================
-- This script creates:
-- - 1 Demo User
-- - 10 Portfolios with real investment data
-- - 50 Investments across those portfolios
-- - 200 Transactions for those investments
-- =====================================================

USE [IPMSDB]
GO

-- =====================================================
-- STEP 1: Get or Create Demo User
-- =====================================================
-- Note: The user should already exist from your seeder
-- We'll use the existing demo user: demo@example.com
-- If not exists, you need to create it through your application first

DECLARE @DemoUserId NVARCHAR(450)
SELECT @DemoUserId = Id FROM AspNetUsers WHERE Email = 'user1@portfolio.com'

IF @DemoUserId IS NULL
BEGIN
    PRINT 'ERROR: Demo user not found. Please create demo@example.com user first through the application.'
    RETURN
END

PRINT 'Using Demo User ID: ' + @DemoUserId

-- =====================================================
-- STEP 2: Clean up existing demo data (optional)
-- =====================================================
-- Uncomment if you want to clean existing data first
/*
DELETE FROM Transactions WHERE InvestmentId IN (
    SELECT Id FROM Investments WHERE UserId = @DemoUserId
)
DELETE FROM Investments WHERE UserId = @DemoUserId
DELETE FROM Portfolios WHERE UserId = @DemoUserId
*/

-- =====================================================
-- STEP 3: Create 10 Portfolios
-- =====================================================
PRINT 'Creating 10 Portfolios...'

DECLARE @Portfolio1 INT, @Portfolio2 INT, @Portfolio3 INT, @Portfolio4 INT, @Portfolio5 INT
DECLARE @Portfolio6 INT, @Portfolio7 INT, @Portfolio8 INT, @Portfolio9 INT, @Portfolio10 INT

-- Portfolio 1: Growth Stocks
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Growth Stocks Portfolio', 'High-growth technology and emerging market stocks', 1, 0, DATEADD(MONTH, -12, GETDATE()))
SET @Portfolio1 = SCOPE_IDENTITY()

-- Portfolio 2: Dividend Income
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Dividend Income Portfolio', 'Stable dividend-paying stocks for passive income', 0, 0, DATEADD(MONTH, -11, GETDATE()))
SET @Portfolio2 = SCOPE_IDENTITY()

-- Portfolio 3: Cryptocurrency
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Cryptocurrency Holdings', 'Digital assets and blockchain investments', 0, 0, DATEADD(MONTH, -10, GETDATE()))
SET @Portfolio3 = SCOPE_IDENTITY()

-- Portfolio 4: Real Estate
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Real Estate Investments', 'REITs and property investments', 0, 0, DATEADD(MONTH, -9, GETDATE()))
SET @Portfolio4 = SCOPE_IDENTITY()

-- Portfolio 5: Bonds & Fixed Income
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Bonds & Fixed Income', 'Conservative fixed-income securities', 0, 0, DATEADD(MONTH, -8, GETDATE()))
SET @Portfolio5 = SCOPE_IDENTITY()

-- Portfolio 6: Index Funds
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Index Funds Portfolio', 'Low-cost market index tracking funds', 0, 0, DATEADD(MONTH, -7, GETDATE()))
SET @Portfolio6 = SCOPE_IDENTITY()

-- Portfolio 7: Tech Sector
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Technology Sector', 'Focused technology sector investments', 0, 0, DATEADD(MONTH, -6, GETDATE()))
SET @Portfolio7 = SCOPE_IDENTITY()

-- Portfolio 8: International Markets
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'International Markets', 'Global diversification portfolio', 0, 0, DATEADD(MONTH, -5, GETDATE()))
SET @Portfolio8 = SCOPE_IDENTITY()

-- Portfolio 9: Retirement Fund
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Retirement Fund', 'Long-term retirement planning investments', 0, 0, DATEADD(MONTH, -4, GETDATE()))
SET @Portfolio9 = SCOPE_IDENTITY()

-- Portfolio 10: Short-term Trading
INSERT INTO Portfolios (UserId, Name, Description, IsDefault, IsDeleted, CreatedAt)
VALUES (@DemoUserId, 'Short-term Trading', 'Active trading and swing trading positions', 0, 0, DATEADD(MONTH, -3, GETDATE()))
SET @Portfolio10 = SCOPE_IDENTITY()

PRINT 'Portfolios created successfully'

-- =====================================================
-- STEP 4: Create 50 Investments (5 per portfolio)
-- =====================================================
PRINT 'Creating 50 Investments...'

-- Helper variables for investments
DECLARE @Inv1 INT, @Inv2 INT, @Inv3 INT, @Inv4 INT, @Inv5 INT

-- ==================== Portfolio 1: Growth Stocks ====================
-- Investment 1: Apple Inc.
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio1, @DemoUserId, 'Apple Inc. (AAPL)', 0, 15000.00, 18500.00, 100, 150.00, DATEADD(MONTH, -10, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -10, GETDATE()))
SET @Inv1 = SCOPE_IDENTITY()

-- Investment 2: Microsoft Corp.
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio1, @DemoUserId, 'Microsoft Corporation (MSFT)', 0, 20000.00, 24000.00, 60, 333.33, DATEADD(MONTH, -9, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -9, GETDATE()))
SET @Inv2 = SCOPE_IDENTITY()

-- Investment 3: Amazon
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio1, @DemoUserId, 'Amazon.com Inc. (AMZN)', 0, 18000.00, 21000.00, 120, 150.00, DATEADD(MONTH, -8, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -8, GETDATE()))
SET @Inv3 = SCOPE_IDENTITY()

-- Investment 4: Tesla
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio1, @DemoUserId, 'Tesla Inc. (TSLA)', 0, 25000.00, 32000.00, 100, 250.00, DATEADD(MONTH, -7, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -7, GETDATE()))
SET @Inv4 = SCOPE_IDENTITY()

-- Investment 5: NVIDIA
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio1, @DemoUserId, 'NVIDIA Corporation (NVDA)', 0, 30000.00, 42000.00, 80, 375.00, DATEADD(MONTH, -6, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -6, GETDATE()))
SET @Inv5 = SCOPE_IDENTITY()

-- ==================== Portfolio 2: Dividend Income ====================
-- Investment 6: Johnson & Johnson
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio2, @DemoUserId, 'Johnson & Johnson (JNJ)', 0, 12000.00, 13200.00, 75, 160.00, DATEADD(MONTH, -11, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -11, GETDATE()))

-- Investment 7: Coca-Cola
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio2, @DemoUserId, 'The Coca-Cola Company (KO)', 0, 8000.00, 8800.00, 140, 57.14, DATEADD(MONTH, -10, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -10, GETDATE()))

-- Investment 8: Procter & Gamble
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio2, @DemoUserId, 'Procter & Gamble Co. (PG)', 0, 10000.00, 11000.00, 70, 142.86, DATEADD(MONTH, -9, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -9, GETDATE()))

-- Investment 9: AT&T
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio2, @DemoUserId, 'AT&T Inc. (T)', 0, 6000.00, 6300.00, 300, 20.00, DATEADD(MONTH, -8, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -8, GETDATE()))

-- Investment 10: Verizon
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio2, @DemoUserId, 'Verizon Communications (VZ)', 0, 7000.00, 7350.00, 175, 40.00, DATEADD(MONTH, -7, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -7, GETDATE()))

-- ==================== Portfolio 3: Cryptocurrency ====================
-- Investment 11: Bitcoin
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio3, @DemoUserId, 'Bitcoin (BTC)', 3, 50000.00, 68000.00, 1.5, 33333.33, DATEADD(MONTH, -10, GETDATE()), 'Coinbase', 0, 0, DATEADD(MONTH, -10, GETDATE()))

-- Investment 12: Ethereum
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio3, @DemoUserId, 'Ethereum (ETH)', 3, 30000.00, 42000.00, 15, 2000.00, DATEADD(MONTH, -9, GETDATE()), 'Coinbase', 0, 0, DATEADD(MONTH, -9, GETDATE()))

-- Investment 13: Cardano
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio3, @DemoUserId, 'Cardano (ADA)', 3, 5000.00, 6500.00, 10000, 0.50, DATEADD(MONTH, -8, GETDATE()), 'Coinbase', 0, 0, DATEADD(MONTH, -8, GETDATE()))

-- Investment 14: Solana
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio3, @DemoUserId, 'Solana (SOL)', 3, 8000.00, 11000.00, 200, 40.00, DATEADD(MONTH, -7, GETDATE()), 'Coinbase', 0, 0, DATEADD(MONTH, -7, GETDATE()))

-- Investment 15: Polygon
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio3, @DemoUserId, 'Polygon (MATIC)', 3, 3000.00, 4200.00, 5000, 0.60, DATEADD(MONTH, -6, GETDATE()), 'Coinbase', 0, 0, DATEADD(MONTH, -6, GETDATE()))

-- ==================== Portfolio 4: Real Estate ====================
-- Investment 16: Vanguard Real Estate ETF
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio4, @DemoUserId, 'Vanguard Real Estate ETF (VNQ)', 2, 15000.00, 16500.00, 150, 100.00, DATEADD(MONTH, -9, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -9, GETDATE()))

-- Investment 17: American Tower Corp
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio4, @DemoUserId, 'American Tower Corporation (AMT)', 2, 20000.00, 22000.00, 100, 200.00, DATEADD(MONTH, -8, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -8, GETDATE()))

-- Investment 18: Prologis Inc
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio4, @DemoUserId, 'Prologis Inc. (PLD)', 2, 12000.00, 13800.00, 90, 133.33, DATEADD(MONTH, -7, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -7, GETDATE()))

-- Investment 19: Simon Property Group
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio4, @DemoUserId, 'Simon Property Group (SPG)', 2, 18000.00, 19800.00, 150, 120.00, DATEADD(MONTH, -6, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -6, GETDATE()))

-- Investment 20: Realty Income Corp
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio4, @DemoUserId, 'Realty Income Corporation (O)', 2, 14000.00, 15400.00, 220, 63.64, DATEADD(MONTH, -5, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -5, GETDATE()))

-- ==================== Portfolio 5: Bonds & Fixed Income ====================
-- Investment 21: US Treasury Bonds
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio5, @DemoUserId, 'US Treasury 10-Year Bond', 1, 50000.00, 51000.00, 50, 1000.00, DATEADD(MONTH, -8, GETDATE()), 'TreasuryDirect', 0, 0, DATEADD(MONTH, -8, GETDATE()))

-- Investment 22: Corporate Bonds Fund
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio5, @DemoUserId, 'iShares Corporate Bond ETF (LQD)', 1, 25000.00, 26000.00, 250, 100.00, DATEADD(MONTH, -7, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -7, GETDATE()))

-- Investment 23: Municipal Bonds
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio5, @DemoUserId, 'Vanguard Tax-Exempt Bond ETF (VTEB)', 1, 30000.00, 30900.00, 600, 50.00, DATEADD(MONTH, -6, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -6, GETDATE()))

-- Investment 24: High-Yield Bonds
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio5, @DemoUserId, 'SPDR High Yield Bond ETF (JNK)', 1, 15000.00, 15750.00, 150, 100.00, DATEADD(MONTH, -5, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -5, GETDATE()))

-- Investment 25: International Bonds
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio5, @DemoUserId, 'Vanguard Total International Bond ETF (BNDX)', 1, 20000.00, 20600.00, 400, 50.00, DATEADD(MONTH, -4, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -4, GETDATE()))

-- ==================== Portfolio 6: Index Funds ====================
-- Investment 26: S&P 500 Index
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio6, @DemoUserId, 'Vanguard S&P 500 ETF (VOO)', 4, 40000.00, 48000.00, 100, 400.00, DATEADD(MONTH, -7, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -7, GETDATE()))

-- Investment 27: Total Stock Market
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio6, @DemoUserId, 'Vanguard Total Stock Market ETF (VTI)', 4, 35000.00, 41000.00, 150, 233.33, DATEADD(MONTH, -6, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -6, GETDATE()))

-- Investment 28: International Index
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio6, @DemoUserId, 'Vanguard Total International Stock ETF (VXUS)', 4, 25000.00, 28000.00, 400, 62.50, DATEADD(MONTH, -5, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -5, GETDATE()))

-- Investment 29: Small-Cap Index
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio6, @DemoUserId, 'iShares Russell 2000 ETF (IWM)', 4, 18000.00, 21000.00, 100, 180.00, DATEADD(MONTH, -4, GETDATE()), 'Fidelity', 0, 0, DATEADD(MONTH, -4, GETDATE()))

-- Investment 30: Emerging Markets Index
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio6, @DemoUserId, 'Vanguard Emerging Markets ETF (VWO)', 4, 15000.00, 17250.00, 350, 42.86, DATEADD(MONTH, -3, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -3, GETDATE()))

-- ==================== Portfolio 7: Tech Sector ====================
-- Investment 31: Google
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio7, @DemoUserId, 'Alphabet Inc. Class A (GOOGL)', 0, 22000.00, 27500.00, 200, 110.00, DATEADD(MONTH, -6, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -6, GETDATE()))

-- Investment 32: Meta
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio7, @DemoUserId, 'Meta Platforms Inc. (META)', 0, 16000.00, 20000.00, 50, 320.00, DATEADD(MONTH, -5, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -5, GETDATE()))

-- Investment 33: Adobe
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio7, @DemoUserId, 'Adobe Inc. (ADBE)', 0, 12000.00, 14400.00, 30, 400.00, DATEADD(MONTH, -4, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -4, GETDATE()))

-- Investment 34: Salesforce
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio7, @DemoUserId, 'Salesforce Inc. (CRM)', 0, 14000.00, 16800.00, 60, 233.33, DATEADD(MONTH, -3, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -3, GETDATE()))

-- Investment 35: Intel
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio7, @DemoUserId, 'Intel Corporation (INTC)', 0, 8000.00, 8800.00, 200, 40.00, DATEADD(MONTH, -2, GETDATE()), 'Robinhood', 0, 0, DATEADD(MONTH, -2, GETDATE()))

-- ==================== Portfolio 8: International Markets ====================
-- Investment 36: Alibaba
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio8, @DemoUserId, 'Alibaba Group (BABA)', 0, 10000.00, 11000.00, 120, 83.33, DATEADD(MONTH, -5, GETDATE()), 'E-Trade', 0, 0, DATEADD(MONTH, -5, GETDATE()))

-- Investment 37: Toyota
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio8, @DemoUserId, 'Toyota Motor Corporation (TM)', 0, 12000.00, 13200.00, 80, 150.00, DATEADD(MONTH, -4, GETDATE()), 'E-Trade', 0, 0, DATEADD(MONTH, -4, GETDATE()))

-- Investment 38: Samsung
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio8, @DemoUserId, 'Samsung Electronics (SSNLF)', 0, 8000.00, 9200.00, 100, 80.00, DATEADD(MONTH, -3, GETDATE()), 'E-Trade', 0, 0, DATEADD(MONTH, -3, GETDATE()))

-- Investment 39: Nestle
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio8, @DemoUserId, 'Nestle S.A. (NSRGY)', 0, 15000.00, 16500.00, 130, 115.38, DATEADD(MONTH, -2, GETDATE()), 'E-Trade', 0, 0, DATEADD(MONTH, -2, GETDATE()))

-- Investment 40: ASML
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio8, @DemoUserId, 'ASML Holding N.V. (ASML)', 0, 18000.00, 21600.00, 30, 600.00, DATEADD(MONTH, -1, GETDATE()), 'E-Trade', 0, 0, DATEADD(MONTH, -1, GETDATE()))

-- ==================== Portfolio 9: Retirement Fund ====================
-- Investment 41: Target Retirement 2050
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio9, @DemoUserId, 'Vanguard Target Retirement 2050 (VFIFX)', 4, 45000.00, 52000.00, 1200, 37.50, DATEADD(MONTH, -4, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -4, GETDATE()))

-- Investment 42: Balanced Index Fund
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio9, @DemoUserId, 'Vanguard Balanced Index (VBIAX)', 4, 35000.00, 39200.00, 900, 38.89, DATEADD(MONTH, -3, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -3, GETDATE()))

-- Investment 43: Dividend Growth Fund
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio9, @DemoUserId, 'Vanguard Dividend Growth (VDIGX)', 4, 28000.00, 31500.00, 850, 32.94, DATEADD(MONTH, -2, GETDATE()), 'Vanguard', 0, 0, DATEADD(MONTH, -2, GETDATE()))

-- Investment 44: International Growth
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio9, @DemoUserId, 'Vanguard International Growth (VWIGX)', 4, 22000.00, 24200.00, 600, 36.67, DATEADD(DAY, -45, GETDATE()), 'Vanguard', 0, 0, DATEADD(DAY, -45, GETDATE()))

-- Investment 45: TIPS (Inflation-Protected)
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio9, @DemoUserId, 'Vanguard Inflation-Protected Securities (VIPSX)', 1, 30000.00, 31200.00, 2400, 12.50, DATEADD(DAY, -30, GETDATE()), 'Vanguard', 0, 0, DATEADD(DAY, -30, GETDATE()))

-- ==================== Portfolio 10: Short-term Trading ====================
-- Investment 46: SPY (S&P 500 ETF)
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio10, @DemoUserId, 'SPDR S&P 500 ETF Trust (SPY)', 0, 20000.00, 22400.00, 45, 444.44, DATEADD(DAY, -60, GETDATE()), 'TD Ameritrade', 0, 0, DATEADD(DAY, -60, GETDATE()))

-- Investment 47: QQQ (Nasdaq ETF)
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio10, @DemoUserId, 'Invesco QQQ Trust (QQQ)', 0, 15000.00, 17250.00, 40, 375.00, DATEADD(DAY, -45, GETDATE()), 'TD Ameritrade', 0, 0, DATEADD(DAY, -45, GETDATE()))

-- Investment 48: AMD
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio10, @DemoUserId, 'Advanced Micro Devices (AMD)', 0, 10000.00, 12000.00, 100, 100.00, DATEADD(DAY, -30, GETDATE()), 'TD Ameritrade', 0, 0, DATEADD(DAY, -30, GETDATE()))

-- Investment 49: GameStop (High Risk)
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio10, @DemoUserId, 'GameStop Corp. (GME)', 0, 5000.00, 4000.00, 250, 20.00, DATEADD(DAY, -15, GETDATE()), 'TD Ameritrade', 0, 0, DATEADD(DAY, -15, GETDATE()))

-- Investment 50: Palantir
INSERT INTO Investments (PortfolioId, UserId, Name, Type, InitialAmount, CurrentValue, Quantity, AveragePricePerUnit, PurchaseDate, BrokerPlatform, Status, IsDeleted, CreatedAt)
VALUES (@Portfolio10, @DemoUserId, 'Palantir Technologies (PLTR)', 0, 8000.00, 9600.00, 500, 16.00, DATEADD(DAY, -7, GETDATE()), 'TD Ameritrade', 0, 0, DATEADD(DAY, -7, GETDATE()))

PRINT 'All 50 investments created successfully'

-- =====================================================
-- STEP 5: Create 200 Transactions (4 per investment)
-- =====================================================
PRINT 'Creating 200 Transactions...'

-- We'll create a cursor to loop through all investments and add transactions
DECLARE @InvId INT, @InvName NVARCHAR(MAX), @InvQuantity DECIMAL(18,8), @InvPrice DECIMAL(18,8), @InvDate DATETIME
DECLARE @Counter INT = 1

DECLARE inv_cursor CURSOR FOR
SELECT Id, Name, Quantity, AveragePricePerUnit, PurchaseDate
FROM Investments
WHERE UserId = @DemoUserId

OPEN inv_cursor
FETCH NEXT FROM inv_cursor INTO @InvId, @InvName, @InvQuantity, @InvPrice, @InvDate

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Transaction 1: Initial Buy
    INSERT INTO Transactions (InvestmentId, Type, Quantity, PricePerUnit, Amount, TransactionDate, Notes, IsDeleted, CreatedAt)
    VALUES (@InvId, 0, @InvQuantity * 0.6, @InvPrice * 0.95, (@InvQuantity * 0.6) * (@InvPrice * 0.95), @InvDate, 'Initial purchase', 0, @InvDate)

    -- Transaction 2: Additional Buy
    INSERT INTO Transactions (InvestmentId, Type, Quantity, PricePerUnit, Amount, TransactionDate, Notes, IsDeleted, CreatedAt)
    VALUES (@InvId, 0, @InvQuantity * 0.4, @InvPrice * 1.05, (@InvQuantity * 0.4) * (@InvPrice * 1.05), DATEADD(DAY, 15, @InvDate), 'Averaging up position', 0, DATEADD(DAY, 15, @InvDate))

    -- Transaction 3: Price Update
    INSERT INTO Transactions (InvestmentId, Type, Quantity, PricePerUnit, Amount, TransactionDate, Notes, IsDeleted, CreatedAt)
    VALUES (@InvId, 2, 0, @InvPrice * 1.15, 0, DATEADD(DAY, 30, @InvDate), 'Price update - market appreciation', 0, DATEADD(DAY, 30, @InvDate))

    -- Transaction 4: Partial Sell or Another Update (alternate)
    IF @Counter % 3 = 0
    BEGIN
        -- Sell transaction
        INSERT INTO Transactions (InvestmentId, Type, Quantity, PricePerUnit, Amount, TransactionDate, Notes, IsDeleted, CreatedAt)
        VALUES (@InvId, 1, @InvQuantity * 0.2, @InvPrice * 1.2, (@InvQuantity * 0.2) * (@InvPrice * 1.2), DATEADD(DAY, 45, @InvDate), 'Taking profits', 0, DATEADD(DAY, 45, @InvDate))
    END
    ELSE
    BEGIN
        -- Update transaction
        INSERT INTO Transactions (InvestmentId, Type, Quantity, PricePerUnit, Amount, TransactionDate, Notes, IsDeleted, CreatedAt)
        VALUES (@InvId, 2, 0, @InvPrice * 1.25, 0, DATEADD(DAY, 45, @InvDate), 'Market value update', 0, DATEADD(DAY, 45, @InvDate))
    END

    SET @Counter = @Counter + 1
    FETCH NEXT FROM inv_cursor INTO @InvId, @InvName, @InvQuantity, @InvPrice, @InvDate
END

CLOSE inv_cursor
DEALLOCATE inv_cursor

PRINT '200 transactions created successfully'

-- =====================================================
-- STEP 6: Verification Queries
-- =====================================================
PRINT ''
PRINT '===== VERIFICATION ====='

-- Use variables for verification counts
DECLARE @PortfolioCount INT, @InvestmentCount INT, @TransactionCount INT, @TotalValue DECIMAL(18,2)

SELECT @PortfolioCount = COUNT(*) FROM Portfolios WHERE UserId = @DemoUserId
SELECT @InvestmentCount = COUNT(*) FROM Investments WHERE UserId = @DemoUserId
SELECT @TransactionCount = COUNT(*) FROM Transactions WHERE InvestmentId IN (SELECT Id FROM Investments WHERE UserId = @DemoUserId)
SELECT @TotalValue = SUM(CurrentValue) FROM Investments WHERE UserId = @DemoUserId

PRINT 'Total Portfolios: ' + CAST(@PortfolioCount AS VARCHAR)
PRINT 'Total Investments: ' + CAST(@InvestmentCount AS VARCHAR)
PRINT 'Total Transactions: ' + CAST(@TransactionCount AS VARCHAR)
PRINT ''
PRINT 'Total Investment Value: $' + CAST(@TotalValue AS VARCHAR)
PRINT ''
PRINT '===== SEED COMPLETE ====='

-- Display sample data
PRINT ''
PRINT 'Sample Portfolio Data:'
SELECT TOP 3 Name, Description, CreatedAt FROM Portfolios WHERE UserId = @DemoUserId ORDER BY CreatedAt

PRINT ''
PRINT 'Sample Investment Data:'
SELECT TOP 5 Name, Type, InitialAmount, CurrentValue, Status FROM Investments WHERE UserId = @DemoUserId ORDER BY CreatedAt

PRINT ''
PRINT 'Sample Transaction Data:'
SELECT TOP 5 t.Type, t.Quantity, t.PricePerUnit, t.Amount, t.TransactionDate, i.Name as InvestmentName
FROM Transactions t
INNER JOIN Investments i ON t.InvestmentId = i.Id
WHERE i.UserId = @DemoUserId
ORDER BY t.TransactionDate DESC

GO
