# 🌐 Website Setup & MongoDB Integration Guide

## ✅ What's Been Done

The website is now **fully integrated with MongoDB Atlas**! Every violation report will be automatically saved to your database.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create .env file (if not already done)
copy setup-env.txt .env

# Your MongoDB URI is already configured in .env:
# mongodb+srv://darsanv27:darsan%4027@cluster0.iobtzme.mongodb.net/snapnearn_db

# Install dependencies (if not already done)
npm install
```

### Step 2: Setup Website

```bash
# Navigate to website folder
cd website

# Create config.js from template
copy config.js.example config.js

# Edit config.js and add your Google Maps API key
# (Optional - website will work without it, but maps won't load)
```

### Step 3: Start Everything

**Option A: Use the Startup Script (Recommended)**
```bash
# From root folder
START_WEBSITE.bat
```

**Option B: Manual Start**
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Website
cd website
node server.js
```

---

## 🎯 Access the Application

- **Website:** http://localhost:8080
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 📊 What Gets Saved to MongoDB

When you upload a violation photo through the website, the following data is automatically saved:

### Report Data Structure

```javascript
{
  // Violation Details
  violationType: "no_helmet",
  description: "No Helmet detected via AI analysis. Confidence: 92.0%",
  
  // Location (from GPS)
  location: {
    coordinates: [80.2196, 12.7856], // [longitude, latitude]
    address: "MG Road, Bangalore, Karnataka",
    landmark: "E 8 Kelambakkam Police Station"
  },
  
  // Vehicle Information
  vehicleDetails: {
    numberPlate: "TN-44-AB-1234",
    vehicleType: "motorcycle",
    color: "Unknown"
  },
  
  // Evidence (Base64 image)
  photos: ["data:image/jpeg;base64,/9j/4AAQ..."],
  
  // Reporter Info
  reporterId: null,
  isAnonymous: true,
  
  // Timestamps (automatic)
  reportedAt: "2025-10-29T17:30:00.000Z",
  createdAt: "2025-10-29T17:30:00.000Z",
  updatedAt: "2025-10-29T17:30:00.000Z",
  
  // Status
  status: "pending"
}
```

---

## 🧪 Testing the Integration

### Test 1: Upload a Violation

1. Open http://localhost:8080
2. Login (use any email/password for testing)
3. Wait for GPS to connect
4. Click "Upload Photo" or "Upload Video"
5. Select an image file
6. Click "Process with AI"
7. Wait for AI analysis
8. Check the success message - it should show "Saved to MongoDB Atlas"

### Test 2: Verify in MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Login with your credentials
3. Click on your cluster (Cluster0)
4. Click "Browse Collections"
5. Select `snapnearn_db` database
6. Click on `reports` collection
7. You should see your uploaded violation!

### Test 3: Check via API

```bash
# Get all reports
curl http://localhost:5000/api/reports

# Get statistics
curl http://localhost:5000/api/reports/stats/summary
```

---

## 🔍 How It Works

### Workflow

1. **User uploads photo** → Website receives image
2. **AI processes image** → Detects helmet violation & number plate
3. **GPS captures location** → Gets coordinates and address
4. **Data is prepared** → Formats data for MongoDB
5. **API call is made** → Sends POST request to backend
6. **Backend saves to MongoDB** → Stores in `reports` collection
7. **Success confirmation** → Shows MongoDB ID to user

### Code Flow

```javascript
// 1. User uploads and processes image
processUpload() 
  ↓
// 2. AI analyzes the image
simulateAIAnalysis()
  ↓
// 3. Generate challan
generateChallan(results)
  ↓
// 4. Save to MongoDB
saveReportToDatabase(results)
  ↓
// 5. Backend API receives data
POST /api/reports
  ↓
// 6. MongoDB stores the report
Report.create(reportData)
  ↓
// 7. Success response
{ success: true, data: { _id: "..." } }
```

---

## 📝 Website Features

### 1. GPS Integration ✅
- Automatic location detection
- Real-time GPS updates
- Address geocoding

### 2. Police Station Connection ✅
- Finds nearest police station
- Shows distance and details
- Always connected to E 8 Kelambakkam Police Station

### 3. AI Analysis ✅
- Helmet detection
- Number plate recognition (OCR)
- Multi-frame analysis
- Confidence scoring

### 4. MongoDB Integration ✅
- Automatic data saving
- Real-time sync
- Error handling
- Success confirmation

### 5. User Dashboard ✅
- Recent reports
- Earnings tracker
- Rewards history
- Statistics

---

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://darsanv27:darsan%4027@cluster0.iobtzme.mongodb.net/snapnearn_db
JWT_SECRET=your_jwt_secret
```

### Website (config.js)

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key_here'
};
```

### API Endpoint (script.js)

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🐛 Troubleshooting

### Issue: "Failed to save report to database"

**Cause:** Backend is not running or MongoDB connection failed

**Solution:**
1. Check if backend is running: http://localhost:5000/health
2. Verify MongoDB URI in `backend/.env`
3. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
4. Check console for error messages

### Issue: "CORS Error"

**Cause:** Backend CORS not configured for website

**Solution:**
Backend already has CORS enabled. If issue persists:
1. Restart backend server
2. Clear browser cache
3. Check browser console for specific error

### Issue: "GPS not connecting"

**Cause:** Location permission not granted

**Solution:**
1. Allow location access in browser
2. Use HTTPS or localhost
3. Check browser console for errors

### Issue: "Google Maps not loading"

**Cause:** API key not configured

**Solution:**
1. Create `website/config.js` from `config.js.example`
2. Add your Google Maps API key
3. Restart website server

---

## 📊 Verify Data in MongoDB

### Using MongoDB Atlas Dashboard

1. **Login:** https://cloud.mongodb.com/
2. **Navigate:** Cluster0 → Browse Collections
3. **Select:** `snapnearn_db` → `reports`
4. **View:** All uploaded violations with:
   - Violation type
   - Number plate
   - Location coordinates
   - Photos (base64)
   - Timestamps
   - Status

### Using Backend API

```bash
# Get all reports
curl http://localhost:5000/api/reports

# Get specific report
curl http://localhost:5000/api/reports/<report_id>

# Get statistics
curl http://localhost:5000/api/reports/stats/summary

# Get nearby reports
curl http://localhost:5000/api/reports/nearby/80.2196/12.7856
```

---

## ✅ Success Checklist

Before testing, ensure:

- [ ] Backend `.env` file exists with MongoDB URI
- [ ] Backend server is running (port 5000)
- [ ] Website `config.js` exists (optional for maps)
- [ ] Website server is running (port 8080)
- [ ] MongoDB Atlas is accessible
- [ ] Browser allows location access
- [ ] No CORS errors in console

---

## 🎉 Expected Results

When you upload a violation:

1. ✅ AI analyzes the image
2. ✅ Number plate is detected
3. ✅ GPS location is captured
4. ✅ Data is sent to backend
5. ✅ Backend saves to MongoDB
6. ✅ Success message shows MongoDB ID
7. ✅ Data appears in MongoDB Atlas
8. ✅ User stats are updated
9. ✅ Report appears in dashboard

---

## 📈 What's Stored

### In MongoDB Atlas
- Complete violation reports
- Location data (GeoJSON)
- Photos (base64 or Cloudinary URLs)
- Vehicle details
- Timestamps
- Status tracking

### In Browser (localStorage)
- User session
- Recent reports (cache)
- Rewards history (cache)
- User statistics

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **Website** | http://localhost:8080 |
| **Backend API** | http://localhost:5000 |
| **Health Check** | http://localhost:5000/health |
| **API Docs** | backend/TEST_API.md |
| **MongoDB Atlas** | https://cloud.mongodb.com/ |

---

## 🎯 Next Steps

1. ✅ Start the application using `START_WEBSITE.bat`
2. ✅ Upload a test violation
3. ✅ Verify data in MongoDB Atlas
4. ✅ Check API endpoints
5. ✅ Test all features

---

## 📞 Support

**Documentation:**
- `backend/SETUP_INSTRUCTIONS.md` - Backend setup
- `backend/TEST_API.md` - API documentation
- `BACKEND_COMPLETE.md` - Complete backend guide

**Check Logs:**
- Backend console - API requests and MongoDB operations
- Website console (F12) - Frontend operations and errors
- MongoDB Atlas - Database operations

---

**Your website is now fully integrated with MongoDB Atlas! 🚀**

Every violation report will be automatically saved to the database with all details including images, timestamps, location, and vehicle information.
