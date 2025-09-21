@echo off
echo 🚀 Starting SnapNEarn Backend Service...
echo.

cd backend

echo 🔧 Activating virtual environment...
call .venv\Scripts\activate

echo 📦 Installing dependencies...
pip install flask flask-cors opencv-python pillow numpy twilio python-dotenv requests

echo.
echo 🪖 Starting Helmet Detection Service...
python helmet_detection_service.py

pause
