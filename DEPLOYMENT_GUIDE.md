# 🚀 SnapNEarn - Deployment & Setup Guide

## ✅ Repository Successfully Pushed to GitHub

**Repository URL**: https://github.com/DarsanV/HackaThrone_team91.git

---

## 🔒 Security Measures Implemented

### ✅ What Was Secured

1. **API Keys Protected**
   - ✅ Removed hardcoded Google Maps API key from `website/index.html`
   - ✅ Created `website/config.js` (gitignored) for API keys
   - ✅ All `.env` files properly gitignored

2. **Environment Files**
   - ✅ `backend/.env` - Protected (gitignored)
   - ✅ `contracts/.env` - Protected (gitignored)
   - ✅ `website/config.js` - Protected (gitignored)
   - ✅ All `node_modules/` - Excluded

3. **Example Files Created**
   - ✅ `backend/.env.example` - Template with placeholders
   - ✅ `contracts/.env.example` - Template with placeholders
   - ✅ `web3-frontend/.env.example` - Template with placeholders
   - ✅ `website/.env.example` - Template with placeholders
   - ✅ `website/config.js.example` - Template with placeholders

4. **Git History Cleaned**
   - ✅ Removed old commits with exposed Twilio credentials
   - ✅ Clean git history with no secrets

---

## 📦 What's Included in the Repository

### 1. **Website** (`/website`)
- Static HTML/CSS/JS landing page
- AI-powered features (helmet detection, OCR)
- Google Maps integration
- Face blur technology
- **Setup**: Copy `config.js.example` to `config.js` and add your Google Maps API key

### 2. **Web3 Frontend** (`/web3-frontend`)
- React application for blockchain interaction
- Ethereum smart contract integration
- IPFS file storage
- MetaMask wallet connection
- **Setup**: Optional `.env` for private IPFS (works without it)

### 3. **Backend** (`/backend`)
- Node.js + Express API server
- MongoDB database integration
- JWT authentication
- Image processing with Cloudinary
- Python ML services for helmet detection
- **Setup**: Copy `.env.example` to `.env` and configure all services

### 4. **Mobile App** (`/mobile`)
- React Native + Expo cross-platform app
- GPS location services
- Camera integration
- Real-time violation reporting
- **Setup**: Install dependencies and run with Expo

### 5. **Smart Contracts** (`/contracts`)
- Ethereum smart contracts (Solidity)
- Hardhat development environment
- Deployed to Sepolia testnet
- **Setup**: Copy `.env.example` to `.env` and add your private key

---

## 🛠️ Setup Instructions for New Users

When someone clones your repository, they need to follow these steps:

### Step 1: Clone the Repository

```bash
git clone https://github.com/DarsanV/HackaThrone_team91.git
cd HackaThrone_team91
```

### Step 2: Install Dependencies

```bash
# Root dependencies
npm install

# Backend
cd backend
npm install
pip install -r requirements.txt
cd ..

# Web3 Frontend
cd web3-frontend
npm install
cd ..

# Mobile App
cd mobile
npm install
cd ..

# Smart Contracts
cd contracts
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and fill in:
# - MongoDB URI
# - JWT Secret
# - Cloudinary credentials
# - Google Cloud API keys
# - Other service credentials
```

#### Website Setup
```bash
cd website
cp config.js.example config.js
# Edit config.js and add your Google Maps API key
```

#### Contracts Setup (Optional - for blockchain features)
```bash
cd contracts
cp .env.example .env
# Edit .env and add:
# - MetaMask private key
# - Sepolia RPC URL (from Alchemy/Infura)
# - Etherscan API key (optional)
```

#### Web3 Frontend Setup (Optional - for private IPFS)
```bash
cd web3-frontend
cp .env.example .env
# Edit .env and add Infura IPFS credentials (optional)
```

### Step 4: Start the Services

Open 4-5 terminal windows:

**Terminal 1 - Website:**
```bash
cd website
node server.js
# Access at: http://localhost:8080
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# API at: http://localhost:5000
```

**Terminal 3 - Web3 Frontend:**
```bash
cd web3-frontend
npm start
# Access at: http://localhost:3000
```

**Terminal 4 - Mobile App:**
```bash
cd mobile
npm start
# Scan QR code with Expo Go app
```

**Terminal 5 - Local Blockchain (Optional):**
```bash
cd contracts
npm run node
```

---

## 🔑 Required API Keys & Services

| Service | Purpose | Get From | Required For |
|---------|---------|----------|--------------|
| **Google Maps API** | Maps & location | [Google Cloud Console](https://console.cloud.google.com/) | Website, Backend |
| **Cloudinary** | Image storage | [Cloudinary](https://cloudinary.com/) | Backend |
| **MongoDB** | Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Backend |
| **Alchemy/Infura** | Ethereum RPC | [Alchemy](https://www.alchemy.com/) | Smart Contracts |
| **Google Cloud Vision** | OCR (Optional) | [Google Cloud](https://cloud.google.com/vision) | Backend |
| **Twilio** | SMS (Optional) | [Twilio](https://www.twilio.com/) | Backend |
| **Stripe** | Payments (Optional) | [Stripe](https://stripe.com/) | Backend |

---

## 🎯 For Developers Who Fork/Clone

### What You Need to Do:

1. **Create Configuration Files**
   - Copy all `.env.example` files to `.env`
   - Copy `website/config.js.example` to `website/config.js`
   - Fill in your own API keys and credentials

2. **Never Commit Secrets**
   - The `.gitignore` is already configured
   - Never modify `.gitignore` to include sensitive files
   - Always use environment variables for secrets

3. **Get Your Own API Keys**
   - Don't ask for the original API keys
   - Register for free accounts with the services listed above
   - Most services have free tiers for development

4. **Start MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in `backend/.env`

5. **Test Locally First**
   - Run all services locally before deploying
   - Check the README.md for detailed setup instructions

---

## 📋 Checklist for New Setup

- [ ] Repository cloned
- [ ] All dependencies installed (root, backend, web3-frontend, mobile, contracts)
- [ ] MongoDB installed and running
- [ ] `backend/.env` created and configured
- [ ] `website/config.js` created with Google Maps API key
- [ ] `contracts/.env` created (if using blockchain features)
- [ ] All services start without errors
- [ ] Website accessible at localhost:8080
- [ ] Backend API responding at localhost:5000
- [ ] Web3 frontend accessible at localhost:3000
- [ ] Mobile app running in Expo Go

---

## 🚨 Important Notes

### For Repository Owner (You):

1. **Keep Your Actual `.env` Files Safe**
   - Never commit them to git
   - Back them up securely offline
   - Don't share them publicly

2. **API Key Management**
   - Rotate keys if accidentally exposed
   - Use different keys for development and production
   - Monitor API usage for unusual activity

3. **Collaborators**
   - Share setup instructions, not actual keys
   - Each developer should get their own API keys
   - Use environment-specific configurations

### For Users Who Clone:

1. **This Repository Does NOT Include:**
   - Working API keys (you need your own)
   - Database credentials (you need your own)
   - Private keys (you need your own)

2. **You MUST Provide:**
   - Your own Google Maps API key
   - Your own Cloudinary account
   - Your own MongoDB instance
   - Your own blockchain credentials (if using Web3 features)

3. **The App Will NOT Work Without:**
   - Proper environment configuration
   - Valid API keys
   - Running MongoDB instance
   - Internet connection for external services

---

## 🎉 Success!

Your project is now:
- ✅ Securely pushed to GitHub
- ✅ No exposed secrets or API keys
- ✅ Properly documented
- ✅ Ready for collaboration
- ✅ Easy to set up for new developers

**Repository**: https://github.com/DarsanV/HackaThrone_team91.git

---

## 📞 Support

If you encounter issues:
1. Check the main [README.md](README.md) for detailed setup
2. Verify all environment variables are set correctly
3. Ensure all required services are running
4. Check the console for error messages

---

**Made with ❤️ by HackaThrone Team 91**
