# Test MongoDB Connection & Data Display

## Step 1: Start the Backend Server

```bash
npm run server
```

**Expected Output:**
```
✅ Successfully connected to MongoDB Atlas
📊 Database: SnapNEarnDb
📁 Collections found: reports
Server is running on http://localhost:3001
```

---

## Step 2: Test Database Connection

Open in browser: **http://localhost:3001/api/test-connection**

This will show you:
- ✅ Database name
- ✅ All collections in your database
- ✅ Number of documents in "reports" collection
- ✅ Field names in your reports
- ✅ Sample report data

**Example Response:**
```json
{
  "status": "SUCCESS",
  "database": "SnapNEarnDb",
  "collections": ["reports"],
  "reportsCollection": {
    "exists": true,
    "documentCount": 150,
    "sampleFields": ["_id", "violationType", "zone", "status", ...],
    "sampleData": { ... your actual report data ... }
  }
}
```

---

## Step 3: View All Reports

Open in browser: **http://localhost:3001/api/reports**

This will show you the **EXACT data** from your MongoDB "reports" collection.

---

## Step 4: Check Backend Logs

In your backend terminal, you'll see:

```
📥 Fetching reports from "reports" collection...
✅ Found 150 reports in "reports" collection
📋 Sample report fields: _id, violationType, zone, status, timestamp, ...
📋 First report data: { ... complete report object ... }
```

This shows:
- ✅ How many reports were found
- ✅ What fields exist in your reports
- ✅ The actual data structure

---

## Step 5: Start Frontend

```bash
npm run dev
```

Then open: **http://localhost:5173**

---

## Step 6: Check Frontend Console

Open Browser DevTools (F12) → Console tab

You'll see:
```
📥 Fetching reports from API...
✅ Received 150 reports from API
📋 Sample report from MongoDB: { ... your report data ... }
```

---

## Troubleshooting

### No reports showing?

1. **Check backend logs** - Does it say "Found 0 reports"?
   - Your "reports" collection might be empty
   - Add some test data to MongoDB Atlas

2. **Check test endpoint** - Visit http://localhost:3001/api/test-connection
   - Does it show documentCount: 0?
   - Does the collection exist?

3. **Check MongoDB Atlas**
   - Log in to MongoDB Atlas
   - Go to your cluster → Browse Collections
   - Verify "SnapNEarnDb" database exists
   - Verify "reports" collection has documents

### Connection failed?

1. **Check internet connection**
2. **Verify MongoDB Atlas credentials**
3. **Check if IP is whitelisted** in MongoDB Atlas
4. **Wait for retry attempts** (up to 5 times)

### Wrong data showing?

1. **Check backend logs** for the sample report structure
2. **Check frontend console** for the mapped data
3. The frontend will automatically map different field names:
   - `reportId`, `id`, or `_id` → `id`
   - `violationType`, `violation`, or `type` → `violationType`
   - `imageUrl`, `thumbnail`, or `image` → `thumbnail`
   - etc.

---

## What the Code Does

### Backend (server/index.js)
```javascript
// Fetches from "reports" collection
db.collection('reports').find({}).toArray()

// Returns EXACT data from MongoDB
res.json(reports)
```

### Frontend (src/services/api.ts)
```javascript
// Receives data from backend
const reports = await response.json()

// Maps to display format (handles different field names)
// Shows in Reports page table
```

---

## Expected Behavior

✅ Backend connects to MongoDB Atlas
✅ Backend fetches from "reports" collection
✅ Backend logs show exact data structure
✅ Frontend receives the data
✅ Frontend displays in Reports table
✅ Dashboard shows statistics

---

## Quick Verification Commands

```bash
# Test backend health
curl http://localhost:3001/api/health

# Test database connection
curl http://localhost:3001/api/test-connection

# Get all reports
curl http://localhost:3001/api/reports

# Get dashboard stats
curl http://localhost:3001/api/dashboard/stats
```

---

## MongoDB Atlas Quick Check

1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click on your cluster
4. Click "Browse Collections"
5. Find "SnapNEarnDb" database
6. Find "reports" collection
7. Verify you have documents there

---

## Success Indicators

✅ Backend shows: "Found X reports in 'reports' collection"
✅ Test endpoint shows: documentCount > 0
✅ /api/reports returns array of data
✅ Frontend console shows: "Received X reports from API"
✅ Reports page displays table with data
✅ Dashboard shows real statistics

If all these are ✅, your data is displaying correctly!
