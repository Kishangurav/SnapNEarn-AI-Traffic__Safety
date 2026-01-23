# SnapNEarn - AI Powered Traffic Violation Detection 🚨

SnapNEarn is a cutting-edge artificial intelligence application designed to improve road safety through citizen-driven reporting and automated violation detection. By leveraging advanced Computer Vision and Machine Learning, SnapNEarn can identify traffic violations like riding without a helmet in real-time.

## 🤖 AI & Machine Learning Features

- **Automated Helmet Detection**: Multi-person helmet detection using deep learning models.
- **License Plate Recognition (OCR)**: Automatic extraction of vehicle registration numbers from images and video frames.
- **Triple Riding Detection**: Intelligent person counting to identify passenger limit violations.
- **Real-time Video Analysis**: Process video streams to identify violations across multiple frames and select the best evidence.
- **Face Blurring**: Privacy-first approach that automatically blurs faces in evidence photos/videos.

## 🎯 Key Application Features

- **GPS Integration**: Automatically records the precise location and nearest police station for every report.
- **Smart Rewards System**: Earn "Petrol Units" for verified reports which can be redeemed at participating stations.
- **Emergency Alert System**: One-tap emergency button that sends your location and live data to the nearest police station.
- **WhatsApp Integration**: Automatic notifications and challan delivery via WhatsApp.

## 🏗️ Technical Architecture

### 1. AI Detection Service (Python/Flask)
- Advanced Computer Vision models for helmet and person detection.
- OCR integration for number plate extraction.
- WhatsApp automation via Twilio.

### 2. Backend API (Node.js/Express)
- Secure user authentication and report management.
- MongoDB for persistent data storage.
- Real-time communication via Socket.io.

### 3. Mobile Application (React Native/Expo)
- Cross-platform Android & iOS app.
- Native camera and GPS integration.
- Smooth animations and premium UI.

### 4. Web Dashboard (React/Vite)
- Real-time monitoring and statistics.
- Interactive police station finder and report management.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB installed and running

### Quick Start (Development)

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start Backend AI Service**:
   ```bash
   start_backend_service.bat
   ```

3. **Start Mobile App**:
   ```bash
   start-mobile-app.bat
   ```

## 🔐 Privacy & Security
SnapNEarn prioritizes user privacy. All uploaded evidence undergoes automatic face blurring before processing. Data is stored securely and used only for traffic enforcement purposes by authorized personnel.

---
Created with ❤️ by the SnapNEarn Team
