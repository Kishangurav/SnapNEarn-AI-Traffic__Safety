# Quick Start Guide

## 🚀 Start the Application

### Step 1: Start Backend Server
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

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms
➜ Local:   http://localhost:5173/
```

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

---

## ✅ Verify Everything Works

### 1. Check Backend Health
Open in browser: `http://localhost:3001/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Check Reports Endpoint
Open in browser: `http://localhost:3001/api/reports`

**Expected:** JSON array of reports from your database

### 3. Check Dashboard Stats
Open in browser: `http://localhost:3001/api/dashboard/stats`

**Expected:** JSON object with statistics

### 4. Check Frontend
1. Dashboard should show real statistics
2. Reports page should show list of reports
3. No errors in browser console

---

## 🔍 Troubleshooting

### Backend won't start
**Error:** `Failed to connect to MongoDB`

**Solutions:**
1. Check internet connection
2. Verify MongoDB Atlas is accessible
3. Check connection string is correct
4. Wait for retry attempts (up to 5 times)

### Frontend shows "Unable to connect to server"
**Solutions:**
1. Ensure backend is running on port 3001
2. Check `http://localhost:3001/api/health` in browser
3. Check browser console for CORS errors
4. Restart backend server

### No data showing
**Solutions:**
1. Check MongoDB has data in `reports` collection
2. Check backend logs for errors
3. Open browser DevTools → Network tab
4. Look for failed API requests

### Port already in use
**Error:** `Port 3001 is already in use`

**Solutions:**
1. Stop other processes using port 3001
2. Change PORT in `server/index.js`
3. Update API_BASE_URL in `src/services/api.ts`

---

## 📊 Sample MongoDB Data

If your database is empty, here's sample data structure:

```javascript
// Insert into 'reports' collection
{
  "id": "RPT-001",
  "violationType": "No Helmet",
  "aiConfidence": 95,
  "zone": "Zone A",
  "timestamp": new Date(),
  "createdAt": new Date(),
  "status": "Pending",
  "thumbnail": "https://example.com/image.jpg",
  "vehicleNumber": "KA01AB1234",
  "location": "MG Road Junction",
  "fineAmount": 1000,
  "updatedAt": new Date()
}
```

---

## 🎯 Quick Tests

### Test 1: Dashboard Loads
1. Open `http://localhost:5173/dashboard`
2. Should see 4 summary cards with numbers
3. Should see charts with data

### Test 2: Reports Load
1. Open `http://localhost:5173/reports`
2. Should see table with reports
3. Try search and filters

### Test 3: Error Handling
1. Stop backend server
2. Refresh dashboard
3. Should see error message with retry button
4. Click retry → should show error again
5. Start backend
6. Click retry → should load data

### Test 4: Loading States
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh page
4. Should see loading spinners

---

## 📝 Console Commands

### View Backend Logs
```bash
# Backend terminal shows:
2024-01-15T10:30:00.000Z - GET /api/reports
📥 Fetching reports from database...
✅ Found 1284 reports
```

### View Frontend Logs
```bash
# Browser console shows:
📥 Fetching reports from API...
✅ Received 1284 reports from API
```

---

## 🔄 Common Workflows

### Restart Everything
```bash
# Terminal 1 (Backend)
Ctrl+C
npm run server

# Terminal 2 (Frontend)
Ctrl+C
npm run dev
```

### Clear Cache and Restart
```bash
# Stop both servers
# Then:
npm install
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

### Check for Updates
```bash
npm outdated
npm update
```

---

## 🎨 Development Tips

### Hot Reload
- Frontend: Auto-reloads on file changes
- Backend: Requires manual restart (Ctrl+C, then `npm run server`)

### Debug Mode
Add to backend:
```javascript
console.log('Debug:', JSON.stringify(data, null, 2));
```

Add to frontend:
```javascript
console.log('Debug:', data);
```

### Monitor Network
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. See all API calls in real-time

---

## 📞 Need Help?

### Check Logs
1. Backend terminal for server errors
2. Browser console for frontend errors
3. Network tab for API errors

### Common Issues
- **Blank page**: Check browser console
- **Loading forever**: Check backend is running
- **Wrong data**: Check MongoDB collection
- **CORS error**: Restart backend server

### Verify Setup
```bash
# Check Node version (should be 16+)
node --version

# Check npm version
npm --version

# Check if ports are free
netstat -ano | findstr :3001
netstat -ano | findstr :5173
```

---

## ✨ Success Indicators

✅ Backend shows "Successfully connected to MongoDB Atlas"
✅ Frontend shows real numbers on dashboard
✅ Reports table shows data from database
✅ No errors in browser console
✅ Health check returns "OK"
✅ Charts display data correctly

---

## 🎉 You're All Set!

The application is now:
- ✅ Connected to MongoDB Atlas
- ✅ Fetching real data reliably
- ✅ Handling errors gracefully
- ✅ Showing loading states
- ✅ Ready for use!
