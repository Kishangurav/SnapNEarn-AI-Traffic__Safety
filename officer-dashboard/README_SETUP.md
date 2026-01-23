# SnapNEarn Officer Dashboard - Setup Guide

## Changes Made

### 1. Removed Components from Sidebar
- ✅ Removed **Analytics** page and navigation link
- ✅ Removed **Settings** page and navigation link
- ✅ Updated sidebar to only show **Dashboard** and **Reports**

### 2. MongoDB Integration
- ✅ Connected to MongoDB Atlas database
- ✅ All dashboard statistics now fetch from real data
- ✅ All reports are loaded from the database
- ✅ Removed all mock/default data

### 3. Backend API Server
Created an Express.js backend server that connects to MongoDB Atlas and provides the following endpoints:

- `GET /api/reports` - Fetch all reports
- `GET /api/dashboard/stats` - Fetch dashboard statistics
- `PATCH /api/reports/:id/status` - Update report status
- `GET /api/health` - Health check endpoint

## How to Run

### Prerequisites
- Node.js installed on your system
- MongoDB Atlas connection (already configured)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Backend Server
Open a terminal and run:
```bash
npm run server
```

The backend server will start on `http://localhost:3001`

### Step 3: Start the Frontend Development Server
Open a **new terminal** (keep the backend running) and run:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## MongoDB Collections Expected

The application expects the following collections in your MongoDB database:

### `reports` Collection
Each document should have:
```javascript
{
  _id: ObjectId,
  id: String,              // Report ID (e.g., "RPT-001")
  violationType: String,   // Type of violation (e.g., "No Helmet")
  aiConfidence: Number,    // AI confidence score (0-100)
  zone: String,           // Zone name (e.g., "Zone A")
  timestamp: Date,        // When the report was created
  createdAt: Date,        // Creation timestamp
  status: String,         // "Pending", "Verified", or "Rejected"
  thumbnail: String,      // Image URL
  imageUrl: String,       // Alternative image URL
  vehicleNumber: String,  // Optional
  location: String,       // Optional
  fineAmount: Number,     // Fine amount in rupees
  updatedAt: Date        // Last update timestamp
}
```

## Reliability Features

### Backend Improvements
- ✅ **Connection Retry Logic**: Automatically retries MongoDB connection up to 5 times with exponential backoff
- ✅ **Connection Pooling**: Efficient connection management with min/max pool sizes
- ✅ **Request Logging**: All API requests are logged with timestamps
- ✅ **Data Validation**: All data is validated and sanitized before sending to frontend
- ✅ **Error Handling**: Comprehensive error handling with detailed error messages
- ✅ **Health Check Endpoint**: Monitor server and database status
- ✅ **Graceful Shutdown**: Properly closes database connections on server shutdown
- ✅ **Parallel Queries**: Dashboard statistics are fetched in parallel for better performance

### Frontend Improvements
- ✅ **Request Timeout**: 30-second timeout for all API requests
- ✅ **Automatic Retries**: Failed requests are retried up to 3 times with exponential backoff
- ✅ **Loading States**: Clear loading indicators while fetching data
- ✅ **Error Messages**: User-friendly error messages with retry buttons
- ✅ **Data Validation**: All received data is validated and sanitized
- ✅ **Type Safety**: Full TypeScript type checking for all data structures

## Features

### Dashboard Page
- **Total Reports**: Count of all reports in the database
- **Verified Reports**: Count of reports with status "Verified"
- **Pending Reports**: Count of reports with status "Pending"
- **Total Fines Generated**: Sum of fineAmount for all verified reports
- **Violation Types Distribution**: Pie chart showing breakdown by violation type
- **Weekly Trend**: Line chart showing reports over the last 7 days
- **Violation Breakdown**: Bar chart of violation types
- **Error Handling**: Shows error messages with retry option if data fails to load

### Reports Page
- **View all reports** from the database (sorted by most recent first)
- **Filter by zone** and **violation type**
- **Search** by report ID or violation type
- **View detailed report** information
- **Error Handling**: Shows error messages with retry option if data fails to load
- All data is loaded from MongoDB Atlas with proper validation

## API Endpoints

### GET /api/reports
Returns all reports from the database.

### GET /api/dashboard/stats
Returns aggregated statistics:
- Total reports count
- Verified reports count
- Pending reports count
- Total fines amount
- Violation type distribution
- Weekly trend data

### PATCH /api/reports/:id/status
Update the status of a report.

**Body:**
```json
{
  "status": "Verified" | "Rejected" | "Pending"
}
```

## Troubleshooting

### Backend server won't start
- Make sure port 3001 is not in use
- Check MongoDB connection string is correct

### Frontend shows "Loading..." indefinitely
- Ensure the backend server is running on port 3001
- Check browser console for CORS errors
- Verify MongoDB has data in the `reports` collection

### No data showing on Dashboard
- Check that your MongoDB database has documents in the `reports` collection
- Verify the collection name is exactly `reports`
- Check backend server logs for any errors

## Notes

- The MongoDB connection string is embedded in `server/index.js`
- CORS is enabled for all origins in development
- The frontend expects the backend to run on `http://localhost:3001`
