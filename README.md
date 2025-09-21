# CACHE - "Cache Us If You Can"

## Road Safety & Rule Enforcement Application

CACHE is a citizen-driven road safety application that empowers users to report traffic violations, particularly helmet violations, while earning rewards for contributing to safer roads.

## 🎯 Key Features

- **GPS-Verified Reporting**: Accurate location tracking for violation reports
- **Photo Evidence**: Capture and upload violation photos with automatic verification
- **Number Plate Recognition**: AI-powered license plate detection and verification
- **Police Integration**: Automatic routing to nearest police station for verification
- **Smart Rewards**: 10% commission for verified violation reports
- **Real-time Processing**: Instant challan generation for valid violations

## 🏗️ Architecture

### Mobile App (React Native + Expo)
- Cross-platform iOS/Android application
- GPS location services
- Camera integration
- Real-time notifications
- Secure user authentication

### Backend Services (Node.js + Express)
- RESTful API architecture
- MongoDB database
- Image processing and storage
- Payment processing integration
- Police station API integration

### AI/ML Services
- Google Cloud Vision API for OCR
- Number plate recognition
- Image validation and fraud detection

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- MongoDB
- Google Cloud Platform account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cache-us-if-you-can
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Mobile App
cd ../mobile
npm install
```

3. Set up environment variables
```bash
# Copy example environment files
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env
```

4. Start development servers
```bash
# Backend
cd backend
npm run dev

# Mobile App (in another terminal)
cd mobile
expo start
```

## 📱 App Flow

1. **User Registration**: Secure signup with phone verification
2. **Enable GPS**: Location permissions for accurate reporting
3. **Capture Violation**: Photo evidence of traffic violations
4. **Auto-Verification**: Number plate recognition and police station routing
5. **Challan Generation**: Automatic fine generation for verified violations
6. **Reward Distribution**: 10% commission credited to reporter's account

## 🔒 Security & Privacy

- End-to-end encryption for sensitive data
- Secure image storage with automatic deletion policies
- GDPR-compliant data handling
- Fraud detection and prevention mechanisms
- User privacy protection with anonymized reporting options


