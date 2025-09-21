@echo off
echo 📱 Starting SnapNEarn Mobile App...
echo.

cd mobile

echo 🔧 Checking Expo installation...
call npx expo --version

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🚀 Starting Expo development server...
call npx expo start --web --port 19006

pause
