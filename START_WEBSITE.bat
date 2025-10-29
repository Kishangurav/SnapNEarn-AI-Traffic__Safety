@echo off
echo ========================================
echo   SnapNEarn - Website Startup Script
echo ========================================
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo [ERROR] Backend .env file not found!
    echo.
    echo Please create backend\.env file first:
    echo   1. Go to backend folder
    echo   2. Copy setup-env.txt to .env
    echo   3. Verify MongoDB URI is set
    echo.
    pause
    exit /b 1
)

REM Check if website config.js exists
if not exist "website\config.js" (
    echo [WARNING] Website config.js not found!
    echo Creating from template...
    copy "website\config.js.example" "website\config.js"
    echo.
    echo Please edit website\config.js and add your Google Maps API key
    echo.
)

echo Starting SnapNEarn Application...
echo.

REM Start backend in new window
echo [1/2] Starting Backend Server (Port 5000)...
start "SnapNEarn Backend" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start website in new window
echo [2/2] Starting Website Server (Port 8080)...
start "SnapNEarn Website" cmd /k "cd website && node server.js"

REM Wait a bit
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Website:      http://localhost:8080
echo.
echo MongoDB Atlas: Connected
echo.
echo Press any key to open website in browser...
pause > nul

REM Open website in default browser
start http://localhost:8080

echo.
echo Application is running!
echo Close this window or press Ctrl+C to stop.
echo.
pause
