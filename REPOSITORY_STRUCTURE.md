# HackaThrone Team 91 - Repository Structure

This repository contains **two independent projects** for the SnapNEarn platform:

---

## 📁 Repository Structure

```
HackaThrone_team91/
├── 📱 Main Project (Root)          # Original SnapNEarn project
│   ├── backend/                    # Python backend with AI/ML
│   ├── mobile/                     # React Native mobile app
│   ├── web3-frontend/              # Web3 frontend
│   ├── website/                    # Main website
│   ├── contracts/                  # Smart contracts
│   └── ... (other files)
│
└── 👮 officer-dashboard/           # NEW: Officer Dashboard
    ├── server/                     # Express.js backend
    ├── src/                        # React frontend
    ├── README_SETUP.md             # Setup guide
    ├── QUICK_START.md              # Quick reference
    └── ... (dashboard files)
```

---

## 🎯 Project 1: SnapNEarn Platform (Root Directory)

**Purpose:** Complete traffic violation reporting platform with blockchain integration

### Features:
- 📱 Mobile app for citizens to report violations
- 🤖 AI/ML for violation detection
- ⛓️ Blockchain for transparency
- 🌐 Web3 frontend
- 🖥️ Backend API with Python

### Tech Stack:
- **Frontend:** React, Web3.js
- **Mobile:** React Native
- **Backend:** Python, Flask
- **Blockchain:** Ethereum, Hardhat
- **AI/ML:** TensorFlow, Computer Vision

### How to Run:
See the main `README.md` in the root directory

---

## 🎯 Project 2: Officer Dashboard (officer-dashboard/)

**Purpose:** Dashboard for traffic enforcement officers to verify and manage reports

### Features:
- ✅ View all violation reports from MongoDB
- ✅ Two-step verification workflow
- ✅ Generate challan or reject reports
- ✅ Real-time status updates
- ✅ Dashboard with statistics and charts
- ✅ Filter and search reports

### Tech Stack:
- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js + MongoDB
- **UI:** shadcn/ui + Tailwind CSS
- **Database:** MongoDB Atlas

### How to Run:
```bash
cd officer-dashboard
npm install
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

See `officer-dashboard/README_SETUP.md` for detailed instructions

---

## 🔗 How They Work Together

```
┌─────────────────────────────────────────────────────┐
│                 SnapNEarn Ecosystem                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📱 Mobile App (Citizens)                          │
│      ↓                                              │
│  🔗 Blockchain + Backend                           │
│      ↓                                              │
│  📊 MongoDB Database                               │
│      ↓                                              │
│  👮 Officer Dashboard (This Project)               │
│      ↓                                              │
│  ✅ Verified Reports → Challan Generated           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Data Flow:
1. **Citizens** report violations via mobile app
2. **AI** detects and validates violations
3. **Blockchain** stores immutable records
4. **MongoDB** stores report details
5. **Officers** review reports in dashboard
6. **Officers** verify and generate challans
7. **System** updates status in database

---

## 🚀 Quick Start

### For Main Project:
```bash
# From root directory
npm install
npm start
```

### For Officer Dashboard:
```bash
# From root directory
cd officer-dashboard
npm install
npm run server    # Start backend
npm run dev       # Start frontend
```

---

## 📝 Important Notes

### Separate Projects:
- ✅ Both projects are **completely independent**
- ✅ They **do not interfere** with each other
- ✅ They can be run **simultaneously**
- ✅ They share the **same MongoDB database**

### Shared Resources:
- **MongoDB Database:** `SnapNEarnDb`
- **Collection:** `reports`
- Both projects read/write to the same database

### Port Configuration:
- **Main Backend:** Port 5000 (Python)
- **Officer Backend:** Port 3001 (Express)
- **Officer Frontend:** Port 5173 (Vite)
- **Web3 Frontend:** Port 3000 (React)

---

## 📚 Documentation

### Main Project:
- `README.md` - Main project documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `BLOCKCHAIN_SETUP.md` - Blockchain setup
- `LOCAL_SETUP_GUIDE.md` - Local development

### Officer Dashboard:
- `officer-dashboard/README_SETUP.md` - Complete setup guide
- `officer-dashboard/QUICK_START.md` - Quick reference
- `officer-dashboard/IMPROVEMENTS.md` - Technical details
- `officer-dashboard/WORKFLOW_GUIDE.md` - Verification workflow
- `officer-dashboard/TEST_CONNECTION.md` - Database testing

---

## 🛠️ Development

### Working on Main Project:
```bash
# Stay in root directory
git add .
git commit -m "Update main project"
git push
```

### Working on Officer Dashboard:
```bash
# Make changes in officer-dashboard/
git add officer-dashboard/
git commit -m "Update officer dashboard"
git push
```

### Working on Both:
```bash
# Make changes in both
git add .
git commit -m "Update both projects"
git push
```

---

## 🎓 Team Information

**Team:** HackaThrone Team 91
**Project:** SnapNEarn - Traffic Violation Reporting Platform
**Repository:** https://github.com/DarsanV/HackaThrone_team91

---

## 📞 Support

For issues or questions:
- **Main Project:** See root README.md
- **Officer Dashboard:** See officer-dashboard/README_SETUP.md

---

**Last Updated:** October 30, 2025
**Version:** 2.0 (Added Officer Dashboard)
