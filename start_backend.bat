@echo off
echo 🚨 Starting SnapNEarn Backend Services...
echo.

cd backend

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo.
echo 🤖 Starting Helmet Detection Service...
python helmet_detection_service.py

pause
