@echo off
title SnapNEarn AI System Launcher
cls
echo.
echo  ██████╗███╗   ██╗ █████╗ ██████╗ ███╗   ██╗███████╗ █████╗ ██████╗ ███╗   ██╗
echo ██╔════╝████╗  ██║██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔══██╗██╔══██╗████╗  ██║
echo ╚█████╗ ██╔██╗ ██║███████║██████╔╝██╔██╗ ██║█████╗  ███████║██████╔╝██╔██╗ ██║
echo  ╚═══██╗██║╚██╗██║██╔══██║██╔═══╝ ██║╚██╗██║██╔══╝  ██╔══██║██╔══██╗██║╚██╗██║
echo ██████╔╝██║ ╚████║██║  ██║██║     ██║ ╚████║███████╗██║  ██║██║  ██║██║ ╚████║
echo ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
echo.
echo 🚨 AI POWERED TRAFFIC VIOLATION DETECTION SYSTEM 🚨
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

:MENU
echo 1. Start AI Detection Service (Python)
echo 2. Start Backend API (Node.js)
echo 3. Start Mobile App (Expo Web)
echo 4. Start Full AI System (All Services)
echo 5. Exit
echo.
set /p choice="Enter choice [1-5]: "

if "%choice%"=="1" goto START_AI
if "%choice%"=="2" goto START_BACKEND
if "%choice%"=="3" goto START_MOBILE
if "%choice%"=="4" goto START_ALL
if "%choice%"=="5" exit
goto MENU

:START_AI
echo.
echo 🤖 Starting AI Detection Service...
start cmd /k "cd backend && python helmet_detection_service.py"
goto MENU

:START_BACKEND
echo.
echo 🚀 Starting Backend API...
start cmd /k "cd backend && npm run dev"
goto MENU

:START_MOBILE
echo.
echo 📱 Starting Mobile App...
start cmd /k "cd mobile && npx expo start --web"
goto MENU

:START_ALL
echo.
echo 🌟 Starting Full SnapNEarn AI System...
start cmd /k "title AI SERVICE && cd backend && python helmet_detection_service.py"
timeout /t 3
start cmd /k "title BACKEND API && cd backend && npm run dev"
timeout /t 3
start cmd /k "title MOBILE APP && cd mobile && npx expo start --web"
echo.
echo ✅ All services launched in separate windows!
echo.
pause
goto MENU
