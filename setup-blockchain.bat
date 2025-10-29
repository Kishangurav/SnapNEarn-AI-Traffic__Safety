@echo off
echo ========================================
echo  SnapNEarn Blockchain Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Installing contract dependencies...
cd contracts
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install contract dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Creating .env file from template...
if not exist .env (
    copy .env.example .env
    echo [INFO] Created .env file. Please edit it with your credentials!
) else (
    echo [INFO] .env file already exists
)

echo.
echo [3/5] Compiling smart contracts...
call npx hardhat compile
if %errorlevel% neq 0 (
    echo [ERROR] Failed to compile contracts
    pause
    exit /b 1
)

echo.
echo [4/5] Installing frontend dependencies...
cd ..\web3-frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo.
echo 1. Edit contracts/.env file with your:
echo    - PRIVATE_KEY (from MetaMask)
echo    - SEPOLIA_RPC_URL (from Alchemy/Infura)
echo.
echo 2. Get Sepolia testnet ETH:
echo    https://sepoliafaucet.com/
echo.
echo 3. Deploy contract:
echo    cd contracts
echo    npm run deploy
echo.
echo 4. Update contract address in:
echo    web3-frontend/src/config/contract.js
echo.
echo 5. Start frontend:
echo    cd web3-frontend
echo    npm start
echo.
echo ========================================
echo For detailed instructions, see:
echo BLOCKCHAIN_SETUP.md
echo ========================================
echo.

cd ..
pause
