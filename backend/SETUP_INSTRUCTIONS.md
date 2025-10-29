# 🚀 Backend Setup Instructions

## ✅ Your MongoDB Atlas is Ready!

**Connection String:** 
```
mongodb+srv://darsanv27:darsan%4027@cluster0.iobtzme.mongodb.net/snapnearn_db?retryWrites=true&w=majority&appName=Cluster0
```

---

## 📋 Step-by-Step Setup

### Step 1: Create .env File

1. Navigate to the backend folder:
```bash
cd backend
```

2. Create a `.env` file:
```bash
# Windows
copy setup-env.txt .env

# Linux/Mac
cp setup-env.txt .env
```

3. **IMPORTANT:** Open `.env` and verify the MongoDB URI is set correctly:
```env
MONGODB_URI=mongodb+srv://darsanv27:darsan%4027@cluster0.iobtzme.mongodb.net/snapnearn_db?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- multer
- cloudinary
- express-validator
- cors
- helmet
- dotenv
- socket.io
- bcryptjs
- jsonwebtoken
- And more...

### Step 3: Start the Server

```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 CACHE Server running on port 5000
🌍 Environment: development
📱 Ready to make roads safer!
```

### Step 4: Test the API

Open a new terminal and run:
```bash
node test-api.js
```

This will run automated tests on all endpoints.

---

## 🧪 Manual Testing

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "CACHE API is running",
  "timestamp": "2025-10-29T...",
  "environment": "development"
}
```

### Test 2: Create a Report

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d "{
    \"violationType\": \"no_helmet\",
    \"description\": \"Test violation\",
    \"location\": {
      \"coordinates\": [77.5946, 12.9716],
      \"address\": \"MG Road, Bangalore\"
    },
    \"vehicleDetails\": {
      \"numberPlate\": \"KA01TEST123\"
    },
    \"photos\": [],
    \"isAnonymous\": true
  }"
```

### Test 3: Get All Reports

```bash
curl http://localhost:5000/api/reports
```

### Test 4: Get Statistics

```bash
curl http://localhost:5000/api/reports/stats/summary
```

---

## 📊 MongoDB Atlas Verification

### Check Your Data

1. Go to https://cloud.mongodb.com/
2. Login with your credentials
3. Click on your cluster (Cluster0)
4. Click "Browse Collections"
5. You should see:
   - Database: `snapnearn_db`
   - Collections: `reports`, `users`

### View Reports Collection

After creating reports via API, you'll see documents like:

```javascript
{
  "_id": ObjectId("..."),
  "violationType": "no_helmet",
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "address": "MG Road, Bangalore"
  },
  "vehicleDetails": {
    "numberPlate": "KA01TEST123",
    "vehicleType": "motorcycle"
  },
  "photos": [],
  "status": "pending",
  "isAnonymous": true,
  "reportedAt": ISODate("2025-10-29T..."),
  "createdAt": ISODate("2025-10-29T..."),
  "updatedAt": ISODate("2025-10-29T...")
}
```

---

## 🎯 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Root endpoint |
| POST | `/api/reports` | Create report (JSON) |
| POST | `/api/reports/upload` | Upload report (multipart) |
| GET | `/api/reports` | Get all reports (with filters) |
| GET | `/api/reports/:id` | Get single report |
| PUT | `/api/reports/:id` | Update report status |
| DELETE | `/api/reports/:id` | Delete report |
| GET | `/api/reports/stats/summary` | Get statistics |
| GET | `/api/reports/nearby/:lng/:lat` | Get nearby reports |

---

## 🔧 Configuration Options

### Optional Services (Add to .env if needed)

#### Cloudinary (for image storage)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Sign up at: https://cloudinary.com/

#### Google Maps API (for location services)
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
Get from: https://console.cloud.google.com/

#### Twilio (for SMS notifications)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
```
Sign up at: https://www.twilio.com/

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: Could not connect to any servers`

**Solutions:**
1. Check MongoDB Atlas IP Whitelist:
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allow all - for testing)

2. Verify credentials in .env file
3. Check internet connection

### Issue: Port 5000 Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# OR change port in .env
PORT=5001
```

### Issue: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

---

## 📈 What's Stored in MongoDB

### Reports Collection Schema

```javascript
{
  // Reporter Info
  reporter: ObjectId (ref: User) or null,
  
  // Violation Details
  violationType: String, // 'no_helmet', 'wrong_side', 'signal_jump', etc.
  description: String,
  
  // Location (GeoJSON)
  location: {
    type: 'Point',
    coordinates: [longitude, latitude],
    address: String,
    landmark: String
  },
  
  // Evidence
  photos: [{
    public_id: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Vehicle Info
  vehicleDetails: {
    numberPlate: String,
    vehicleType: String,
    make: String,
    model: String,
    color: String
  },
  
  // Status
  status: String, // 'pending', 'verified', 'rejected', 'challan_issued'
  
  // Police Assignment
  assignedPoliceStation: {
    stationId: String,
    stationName: String,
    stationAddress: String
  },
  
  // Verification
  verification: {
    verifiedBy: ObjectId,
    verifiedAt: Date,
    verificationNotes: String
  },
  
  // Challan
  challan: {
    challanNumber: String,
    fineAmount: Number,
    issuedAt: Date,
    dueDate: Date,
    isPaid: Boolean
  },
  
  // Reward
  reward: {
    amount: Number,
    isPaid: Boolean,
    paidAt: Date
  },
  
  // Metadata
  isAnonymous: Boolean,
  reportedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Success Checklist

- [ ] `.env` file created with MongoDB URI
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health check endpoint works
- [ ] Can create reports via API
- [ ] Can view reports in MongoDB Atlas
- [ ] All API endpoints tested

---

## 🎉 You're All Set!

Your backend is now:
- ✅ Connected to MongoDB Atlas
- ✅ Storing violation reports
- ✅ Handling image uploads
- ✅ Tracking timestamps
- ✅ Managing geospatial data
- ✅ Ready for production!

### Next Steps:
1. Test all endpoints with Postman
2. Integrate with mobile app
3. Add authentication
4. Deploy to production

---

## 📞 Need Help?

Check the documentation:
- `TEST_API.md` - Complete API documentation
- `test-api.js` - Automated test script
- Main `README.md` - Project overview

---

**Happy Coding! 🚀**
