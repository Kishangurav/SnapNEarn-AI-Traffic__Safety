@echo off
echo 🚀 Starting SnapNEarn Frontend...
echo.

cd mobile

echo 📦 Installing dependencies...
call npm install

echo.
echo 🌐 Starting Expo web server...
call npx expo start --web --port 3000

pause
