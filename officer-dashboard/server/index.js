import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 3001;

// MongoDB connection
const MONGODB_URI = "mongodb+srv://darsanv27:darsan%4027@cluster0.iobtzme.mongodb.net/SnapNEarnDb?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "SnapNEarnDb";

let db;
let client;

// Connect to MongoDB with retry logic
async function connectToDatabase() {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      await client.connect();
      db = client.db(DB_NAME);
      
      // Verify connection
      await db.admin().ping();
      console.log('✅ Successfully connected to MongoDB Atlas');
      console.log(`📊 Database: ${DB_NAME}`);
      
      // Log available collections
      const collections = await db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.map(c => c.name).join(', ')}`);
      
      return;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries}/${maxRetries} failed:`, error.message);
      
      if (retries < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, retries), 10000);
        console.log(`⏳ Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('💥 Failed to connect to MongoDB after maximum retries');
        process.exit(1);
      }
    }
  }
}

// Middleware to check database connection
function checkDbConnection(req, res, next) {
  if (!db) {
    return res.status(503).json({ 
      error: 'Database connection not available',
      message: 'Please try again in a moment' 
    });
  }
  next();
}

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes

// Get all reports - EXACT data from MongoDB
app.get('/api/reports', checkDbConnection, async (req, res) => {
  try {
    console.log('📥 Fetching reports from "reports" collection...');
    
    const reports = await db.collection('reports')
      .find({})
      .sort({ createdAt: -1 })
      .limit(1000)
      .toArray();
    
    console.log(`✅ Found ${reports.length} reports in "reports" collection`);
    
    // Log first report structure for debugging
    if (reports.length > 0) {
      console.log('📋 Sample report fields:', Object.keys(reports[0]).join(', '));
      console.log('📋 First report data:', JSON.stringify(reports[0], null, 2));
    } else {
      console.log('⚠️ No reports found in database');
    }
    
    // Return EXACT data from MongoDB without modification
    res.json(reports);
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reports',
      message: error.message 
    });
  }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', checkDbConnection, async (req, res) => {
  try {
    console.log('📊 Fetching dashboard statistics...');
    
    // Run all queries in parallel for better performance
    const [totalReports, verifiedReports, pendingReports, rejectedReports, violationTypes, weeklyTrend, finesResult] = await Promise.all([
      // Get total reports count
      db.collection('reports').countDocuments(),
      
      // Get verified reports count
      db.collection('reports').countDocuments({ status: 'Verified' }),
      
      // Get pending reports count
      db.collection('reports').countDocuments({ status: 'Pending' }),
      
      // Get rejected reports count
      db.collection('reports').countDocuments({ status: 'Rejected' }),
      
      // Get violation type distribution
      db.collection('reports').aggregate([
        {
          $group: {
            _id: '$violationType',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray(),
      
      // Get weekly trend (last 7 days)
      (async () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        return db.collection('reports').aggregate([
          {
            $match: {
              $or: [
                { createdAt: { $gte: sevenDaysAgo } },
                { timestamp: { $gte: sevenDaysAgo } }
              ]
            }
          },
          {
            $group: {
              _id: { 
                $dateToString: { 
                  format: '%Y-%m-%d', 
                  date: { $ifNull: ['$createdAt', '$timestamp'] }
                } 
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]).toArray();
      })(),
      
      // Calculate total fines
      db.collection('reports').aggregate([
        {
          $match: { 
            status: 'Verified',
            fineAmount: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            totalFines: { $sum: '$fineAmount' }
          }
        }
      ]).toArray()
    ]);
    
    const totalFines = finesResult.length > 0 ? finesResult[0].totalFines || 0 : 0;
    
    console.log(`✅ Stats: ${totalReports} total, ${verifiedReports} verified, ${pendingReports} pending`);
    console.log(`💰 Total fines: ₹${totalFines}`);
    
    res.json({
      totalReports,
      verifiedReports,
      pendingReports,
      rejectedReports,
      totalFines,
      violationTypes: violationTypes.map(vt => ({
        _id: vt._id || 'Unknown',
        count: vt.count || 0
      })),
      weeklyTrend: weeklyTrend.map(wt => ({
        _id: wt._id,
        count: wt.count || 0
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard statistics',
      message: error.message
    });
  }
});

// Update report status
app.patch('/api/reports/:id/status', checkDbConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📝 Updating report ${id} to status: ${status}`);
    
    if (!['Verified', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Verified, Rejected, or Pending' });
    }
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid report ID format' });
    }
    
    const result = await db.collection('reports').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          updatedAt: new Date(),
          lastModifiedBy: 'officer' // You can enhance this with actual user info
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      console.log(`⚠️ Report ${id} not found`);
      return res.status(404).json({ error: 'Report not found' });
    }
    
    console.log(`✅ Report ${id} updated successfully`);
    res.json({ success: true, message: 'Report status updated successfully' });
  } catch (error) {
    console.error('❌ Error updating report status:', error);
    res.status(500).json({ 
      error: 'Failed to update report status',
      message: error.message
    });
  }
});

// Test endpoint to verify database connection and data
app.get('/api/test-connection', checkDbConnection, async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Get database info
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get count from reports collection
    const reportCount = await db.collection('reports').countDocuments();
    
    // Get one sample report
    const sampleReport = await db.collection('reports').findOne({});
    
    res.json({
      status: 'SUCCESS',
      database: 'SnapNEarnDb',
      collections: collectionNames,
      reportsCollection: {
        exists: collectionNames.includes('reports'),
        documentCount: reportCount,
        sampleFields: sampleReport ? Object.keys(sampleReport) : [],
        sampleData: sampleReport
      }
    });
  } catch (error) {
    console.error('❌ Test connection failed:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = db ? 'connected' : 'disconnected';
    
    if (db) {
      await db.admin().ping();
    }
    
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Database connection issue',
      database: 'error',
      error: error.message
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  process.exit(0);
});

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
