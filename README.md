# SnapNEarn - Smart Traffic Violation Detection System 🚦

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)](https://expo.dev/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-purple)](https://ethereum.org/)

A comprehensive citizen-driven road safety platform that combines AI, blockchain, and mobile technology to report traffic violations, particularly helmet violations, while earning rewards for contributing to safer roads.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
  - [Website Setup](#1-website-setup)
  - [Web3 Frontend Setup](#2-web3-frontend-setup)
  - [Backend Setup](#3-backend-setup)
  - [Mobile App Setup](#4-mobile-app-setup)
  - [Smart Contracts Setup](#5-smart-contracts-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Technology Stack](#-technology-stack)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 📍 **GPS-Verified Reporting** - Accurate location tracking for violation reports
- 📸 **Photo/Video Evidence** - Capture and upload violation media with automatic verification
- 🤖 **AI-Powered Detection** - Helmet detection and number plate recognition using ML
- 🏢 **Police Integration** - Automatic routing to nearest police station for verification
- 💰 **Blockchain Rewards** - Decentralized reward system with smart contracts
- 📋 **Auto Challan Generation** - Instant fine generation for verified violations
- 🔐 **Secure Authentication** - JWT-based authentication with encrypted data
- 📱 **Cross-Platform Mobile App** - React Native app for iOS and Android

### Advanced Features
- 🎭 **Face Blur Technology** - Privacy protection for individuals in photos
- 🔢 **OCR Number Plate Recognition** - Tesseract.js powered license plate detection
- 🗺️ **Real-time Maps Integration** - Google Maps for location services
- ⛓️ **Web3 Integration** - Ethereum blockchain for transparent reward distribution
- 📊 **Analytics Dashboard** - Track violations, rewards, and statistics

## 📁 Project Structure

```
snearnnnn/
├── website/              # Landing page and demo website
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── server.js
│   └── config.js        # API keys configuration (create from config.js template)
├── web3-frontend/       # React frontend for blockchain integration
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/             # Node.js + Express API server
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── server.js
│   └── .env            # Backend environment variables (create from .env.example)
├── mobile/              # React Native + Expo mobile app
│   ├── src/
│   ├── App.js
│   └── package.json
├── contracts/           # Ethereum smart contracts (Hardhat)
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.js
└── README.md
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** (for backend) - [Download](https://www.mongodb.com/try/download/community)
- **Python 3.8+** (for ML services) - [Download](https://www.python.org/downloads/)
- **Expo CLI** (for mobile app) - Install via: `npm install -g expo-cli`
- **MetaMask** (for Web3 features) - [Browser Extension](https://metamask.io/)

### Optional but Recommended
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing
- **VS Code** - Code editor

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/DarsanV/HackaThrone_team91.git
cd HackaThrone_team91

# Install all dependencies (this may take a few minutes)
npm install
cd backend && npm install && cd ..
cd web3-frontend && npm install && cd ..
cd mobile && npm install && cd ..
cd contracts && npm install && cd ..

# Set up environment variables (see Environment Variables section)
# Copy all .env.example files to .env and fill in your values

# Start the entire stack (requires multiple terminals)
```

## 📚 Detailed Setup

### 1. Website Setup

The website is a static HTML/CSS/JS application with AI features.

```bash
cd website
```

#### Configure API Keys

1. Copy the config template:
```bash
cp config.js.example config.js  # Or manually create config.js
```

2. Edit `config.js` and add your Google Maps API key:
```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_ACTUAL_GOOGLE_MAPS_API_KEY'
};
```

3. Get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Maps JavaScript API" and "Places API"
   - Create credentials (API Key)
   - Copy the API key to `config.js`

#### Run the Website

```bash
node server.js
```

Access at: `http://localhost:8080`

### 2. Web3 Frontend Setup

React application for blockchain interaction.

```bash
cd web3-frontend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment (Optional)

For private IPFS uploads, create `.env`:

```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_IPFS_PROJECT_ID=your_infura_ipfs_project_id
REACT_APP_IPFS_PROJECT_SECRET=your_infura_ipfs_secret
```

**Note:** The app works without these credentials using public IPFS gateway.

#### Run the Web3 Frontend

```bash
npm start
```

Access at: `http://localhost:3000`

### 3. Backend Setup

Node.js + Express API server with MongoDB.

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
pip install -r requirements.txt  # For Python ML services
```

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cache_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Cloud Vision API (for OCR)
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_KEY_FILE=path_to_service_account_key.json

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other services (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
STRIPE_SECRET_KEY=your_stripe_key
```

#### Start MongoDB

Make sure MongoDB is running:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### Run the Backend

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

API will be available at: `http://localhost:5000`

### 4. Mobile App Setup

React Native + Expo cross-platform mobile application.

```bash
cd mobile
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment

The mobile app uses Expo's environment variables. Edit `app.config.js` if needed.

#### Run the Mobile App

```bash
# Start Expo development server
npm start

# Or use specific platform
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For web browser
```

#### Install Expo Go App

1. Download **Expo Go** from:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code from the terminal with your phone

### 5. Smart Contracts Setup

Ethereum smart contracts using Hardhat.

```bash
cd contracts
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# MetaMask Private Key (NEVER share this!)
PRIVATE_KEY=your_metamask_private_key_here

# Sepolia RPC URL (get from Alchemy or Infura)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY

# Etherscan API Key (optional, for verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Get Sepolia Test ETH

1. Get Sepolia ETH from faucets:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

#### Compile and Deploy

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy

# Or deploy to local Hardhat network
npm run node          # Terminal 1: Start local blockchain
npm run deploy:local  # Terminal 2: Deploy contracts
```

## 🔐 Environment Variables

### Required API Keys and Services

| Service | Purpose | Get It From | Required For |
|---------|---------|-------------|-------------|
| Google Maps API | Location services, maps | [Google Cloud Console](https://console.cloud.google.com/) | Website, Backend |
| Cloudinary | Image storage | [Cloudinary](https://cloudinary.com/) | Backend |
| MongoDB | Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or Local | Backend |
| Alchemy/Infura | Ethereum RPC | [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) | Smart Contracts |
| Google Cloud Vision | OCR/Number plate | [Google Cloud](https://cloud.google.com/vision) | Backend (Optional) |
| Twilio | SMS notifications | [Twilio](https://www.twilio.com/) | Backend (Optional) |
| Stripe | Payment processing | [Stripe](https://stripe.com/) | Backend (Optional) |

### Environment Files Checklist

- [ ] `website/config.js` - Created from template
- [ ] `backend/.env` - Copied from `.env.example`
- [ ] `contracts/.env` - Copied from `.env.example`
- [ ] `web3-frontend/.env` - Optional, for private IPFS

## 🏃 Running the Project

### Full Stack Development

You'll need **4-5 terminal windows**:

```bash
# Terminal 1: Website
cd website
node server.js

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Web3 Frontend
cd web3-frontend
npm start

# Terminal 4: Mobile App
cd mobile
npm start

# Terminal 5 (Optional): Local Blockchain
cd contracts
npm run node
```

### Access Points

- **Website**: http://localhost:8080
- **Web3 Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mobile App**: Scan QR code with Expo Go
- **API Docs**: http://localhost:5000/api-docs (if configured)

## 🛠️ Technology Stack

### Frontend
- **Website**: HTML5, CSS3, JavaScript (Vanilla)
- **Web3 Frontend**: React 18, Ethers.js, Web3Modal
- **Mobile**: React Native, Expo SDK 54

### Backend
- **Server**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **File Upload**: Multer, Cloudinary

### Blockchain
- **Smart Contracts**: Solidity 0.8.x
- **Framework**: Hardhat
- **Network**: Ethereum Sepolia Testnet
- **Libraries**: OpenZeppelin Contracts

### AI/ML
- **Helmet Detection**: TensorFlow.js, Custom ML Model
- **OCR**: Tesseract.js, Google Cloud Vision API
- **Face Detection**: BlazeFace (TensorFlow.js)

### DevOps & Tools
- **Version Control**: Git, GitHub
- **Package Manager**: npm
- **API Testing**: Postman
- **Code Quality**: ESLint, Prettier

## 🔒 Security

### Best Practices Implemented

✅ **Environment Variables**: All sensitive data in `.env` files (gitignored)
✅ **API Key Protection**: Config files excluded from version control
✅ **JWT Authentication**: Secure token-based auth
✅ **Password Hashing**: bcrypt for password encryption
✅ **CORS Protection**: Configured CORS policies
✅ **Rate Limiting**: API rate limiting implemented
✅ **Input Validation**: Express-validator for input sanitization
✅ **Helmet.js**: Security headers for Express

### Important Security Notes

⚠️ **NEVER commit**:
- `.env` files
- `config.js` with real API keys
- Private keys or wallet seeds
- Database credentials

⚠️ **Before deploying to production**:
- Change all default secrets
- Use strong JWT secrets
- Enable HTTPS
- Set up proper CORS origins
- Use environment-specific configs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**HackaThrone Team 91**

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Expo team for amazing React Native framework
- TensorFlow.js for ML capabilities
- All open-source contributors

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Search existing [GitHub Issues](https://github.com/DarsanV/HackaThrone_team91/issues)
3. Create a new issue with detailed information

## 🗺️ Roadmap

- [ ] Add real-time notifications
- [ ] Implement advanced analytics dashboard
- [ ] Add multi-language support
- [ ] Deploy to mainnet
- [ ] Add more AI detection models
- [ ] Implement social features

---

**Made with ❤️ for safer roads**

⭐ Star this repo if you find it helpful!
