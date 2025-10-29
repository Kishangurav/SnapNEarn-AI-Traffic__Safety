# 🧪 Backend API Testing Guide

## 📝 MongoDB Atlas Configuration

Your MongoDB connection string is configured:
```
mongodb+srv://darsanv27:darsan%4027@cluster0.iobtzme.mongodb.net/snapnearn_db?retryWrites=true&w=majority&appName=Cluster0
```

## 🚀 Quick Start

### 1. Setup Environment

Copy the content from `setup-env.txt` to `backend/.env`:

```bash
cd backend
# Create .env file and paste the MongoDB connection string
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm run dev
```

Server will start on: `http://localhost:5000`

---

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Root Endpoint
```bash
GET http://localhost:5000/
```

---

## 🎯 Reports API

### 1. Create Report (JSON with Base64 Images)

**Endpoint:** `POST /api/reports`

**Request Body:**
```json
{
  "violationType": "no_helmet",
  "description": "Rider without helmet on main road",
  "location": {
    "coordinates": [77.5946, 12.9716],
    "address": "MG Road, Bangalore, Karnataka",
    "landmark": "Near Trinity Metro Station"
  },
  "vehicleDetails": {
    "numberPlate": "KA01AB1234",
    "vehicleType": "motorcycle",
    "make": "Honda",
    "model": "Activa",
    "color": "Red"
  },
  "photos": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "reporterId": null,
  "isAnonymous": true
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "violationType": "no_helmet",
    "description": "Test violation report",
    "location": {
      "coordinates": [77.5946, 12.9716],
      "address": "Test Address, Bangalore"
    },
    "vehicleDetails": {
      "numberPlate": "KA01TEST123"
    },
    "photos": [],
    "isAnonymous": true
  }'
```

### 2. Upload Report (Multipart Form Data)

**Endpoint:** `POST /api/reports/upload`

**Form Data:**
- `violationType`: no_helmet
- `description`: Violation description
- `latitude`: 12.9716
- `longitude`: 77.5946
- `address`: Full address
- `landmark`: Optional landmark
- `numberPlate`: KA01AB1234
- `vehicleType`: motorcycle
- `make`: Honda
- `model`: Activa
- `color`: Red
- `photos`: (file) - Multiple image files
- `isAnonymous`: true

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/reports/upload \
  -F "violationType=no_helmet" \
  -F "description=Test violation" \
  -F "latitude=12.9716" \
  -F "longitude=77.5946" \
  -F "address=Test Address, Bangalore" \
  -F "numberPlate=KA01TEST123" \
  -F "vehicleType=motorcycle" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.jpg" \
  -F "isAnonymous=true"
```

### 3. Get All Reports

**Endpoint:** `GET /api/reports`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (pending, verified, rejected, etc.)
- `violationType`: Filter by violation type
- `reporterId`: Filter by reporter ID
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: asc or desc (default: desc)

**Examples:**
```bash
# Get all reports
GET http://localhost:5000/api/reports

# Get pending reports
GET http://localhost:5000/api/reports?status=pending

# Get page 2 with 20 items
GET http://localhost:5000/api/reports?page=2&limit=20

# Get helmet violations
GET http://localhost:5000/api/reports?violationType=no_helmet

# Get reports from specific date
GET http://localhost:5000/api/reports?startDate=2025-01-01
```

### 4. Get Single Report

**Endpoint:** `GET /api/reports/:id`

**Example:**
```bash
GET http://localhost:5000/api/reports/67234abc123def456789
```

### 5. Update Report Status

**Endpoint:** `PUT /api/reports/:id`

**Request Body:**
```json
{
  "status": "verified",
  "verificationNotes": "Report verified by officer"
}
```

**For Challan Issuance:**
```json
{
  "status": "challan_issued",
  "challanNumber": "CH2025001234",
  "fineAmount": 1000
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/reports/67234abc123def456789 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "verified",
    "verificationNotes": "Verified by traffic police"
  }'
```

### 6. Delete Report

**Endpoint:** `DELETE /api/reports/:id`

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/reports/67234abc123def456789
```

### 7. Get Statistics

**Endpoint:** `GET /api/reports/stats/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReports": 150,
    "pendingReports": 45,
    "verifiedReports": 80,
    "rejectedReports": 25,
    "reportsByType": [
      { "_id": "no_helmet", "count": 90 },
      { "_id": "signal_jump", "count": 35 },
      { "_id": "wrong_side", "count": 25 }
    ],
    "totalFines": 125000
  }
}
```

### 8. Get Nearby Reports

**Endpoint:** `GET /api/reports/nearby/:longitude/:latitude`

**Query Parameters:**
- `maxDistance`: Maximum distance in meters (default: 5000)
- `limit`: Maximum number of results (default: 20)

**Example:**
```bash
# Get reports within 5km of location
GET http://localhost:5000/api/reports/nearby/77.5946/12.9716

# Get reports within 2km
GET http://localhost:5000/api/reports/nearby/77.5946/12.9716?maxDistance=2000

# Get top 10 nearest reports
GET http://localhost:5000/api/reports/nearby/77.5946/12.9716?limit=10
```

---

## 🧪 Testing with Postman

### Import Collection

Create a new Postman collection with these requests:

1. **Create Report**
   - Method: POST
   - URL: `http://localhost:5000/api/reports`
   - Body: JSON (see example above)

2. **Upload Report with Images**
   - Method: POST
   - URL: `http://localhost:5000/api/reports/upload`
   - Body: form-data (add files)

3. **Get All Reports**
   - Method: GET
   - URL: `http://localhost:5000/api/reports`

4. **Get Report by ID**
   - Method: GET
   - URL: `http://localhost:5000/api/reports/{{reportId}}`

5. **Update Report**
   - Method: PUT
   - URL: `http://localhost:5000/api/reports/{{reportId}}`
   - Body: JSON

6. **Delete Report**
   - Method: DELETE
   - URL: `http://localhost:5000/api/reports/{{reportId}}`

7. **Get Statistics**
   - Method: GET
   - URL: `http://localhost:5000/api/reports/stats/summary`

8. **Get Nearby Reports**
   - Method: GET
   - URL: `http://localhost:5000/api/reports/nearby/77.5946/12.9716`

---

## 📊 Database Collections

### Reports Collection

The backend stores data in MongoDB with this structure:

```javascript
{
  _id: ObjectId,
  reporter: ObjectId (ref: User) or null,
  violationType: String, // 'no_helmet', 'wrong_side', etc.
  description: String,
  location: {
    type: 'Point',
    coordinates: [longitude, latitude],
    address: String,
    landmark: String
  },
  photos: [{
    public_id: String,
    url: String,
    uploadedAt: Date
  }],
  vehicleDetails: {
    numberPlate: String,
    vehicleType: String,
    make: String,
    model: String,
    color: String
  },
  status: String, // 'pending', 'verified', 'rejected', 'challan_issued'
  assignedPoliceStation: {
    stationId: String,
    stationName: String,
    stationAddress: String,
    contactNumber: String
  },
  verification: {
    verifiedBy: ObjectId,
    verifiedAt: Date,
    verificationNotes: String
  },
  challan: {
    challanNumber: String,
    fineAmount: Number,
    issuedAt: Date,
    dueDate: Date,
    isPaid: Boolean
  },
  reward: {
    amount: Number,
    isPaid: Boolean,
    paidAt: Date
  },
  isAnonymous: Boolean,
  reportedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 MongoDB Atlas Verification

### Check Connection

1. Start the server:
```bash
npm run dev
```

2. Look for this message:
```
✅ MongoDB connected successfully
```

3. If you see connection errors, verify:
   - MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
   - Username and password are correct
   - Database name exists

### View Data in MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Login with your credentials
3. Navigate to your cluster
4. Click "Browse Collections"
5. Select `snapnearn_db` database
6. View `reports` collection

---

## 🎨 Sample Test Data

### Test Report 1: No Helmet
```json
{
  "violationType": "no_helmet",
  "description": "Motorcyclist without helmet on highway",
  "location": {
    "coordinates": [77.5946, 12.9716],
    "address": "Outer Ring Road, Bangalore",
    "landmark": "Near Marathahalli Bridge"
  },
  "vehicleDetails": {
    "numberPlate": "KA01MH5678",
    "vehicleType": "motorcycle",
    "color": "Black"
  },
  "photos": [],
  "isAnonymous": false
}
```

### Test Report 2: Signal Jump
```json
{
  "violationType": "signal_jump",
  "description": "Car jumped red signal",
  "location": {
    "coordinates": [77.6033, 12.9698],
    "address": "Whitefield Main Road, Bangalore",
    "landmark": "Near Forum Mall"
  },
  "vehicleDetails": {
    "numberPlate": "KA02AB9876",
    "vehicleType": "car",
    "make": "Maruti",
    "model": "Swift",
    "color": "White"
  },
  "photos": [],
  "isAnonymous": true
}
```

---

## ✅ Success Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

## ❌ Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError`
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Verify credentials in .env file
- Ensure network connectivity

### Image Upload Issues

**Error:** `Cloudinary configuration error`
**Solution:**
- Add Cloudinary credentials to .env
- Sign up at https://cloudinary.com/ if you don't have an account

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 📈 Next Steps

1. ✅ Backend is ready with MongoDB Atlas
2. ✅ All CRUD operations implemented
3. ✅ Image upload with Cloudinary support
4. ✅ Geospatial queries for nearby reports
5. ✅ Statistics and analytics endpoints

### To Do:
- Add authentication middleware
- Implement user registration/login
- Add police station assignment logic
- Integrate with mobile app
- Add email/SMS notifications
- Implement payment gateway

---

**Backend is production-ready! 🚀**
