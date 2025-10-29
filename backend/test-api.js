/**
 * Simple API Test Script
 * Run this after starting the server to test all endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Test data
const testReport = {
  violationType: 'no_helmet',
  description: 'Test violation report - Motorcyclist without helmet',
  location: {
    coordinates: [77.5946, 12.9716], // [longitude, latitude]
    address: 'MG Road, Bangalore, Karnataka, India',
    landmark: 'Near Trinity Metro Station'
  },
  vehicleDetails: {
    numberPlate: 'KA01TEST123',
    vehicleType: 'motorcycle',
    make: 'Honda',
    model: 'Activa',
    color: 'Red'
  },
  photos: [],
  isAnonymous: true
};

let createdReportId = null;

// Test functions
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.status === 'OK') {
      log.success('Health check passed');
      return true;
    }
  } catch (error) {
    log.error(`Health check failed: ${error.message}`);
    return false;
  }
}

async function testCreateReport() {
  try {
    const response = await axios.post(`${BASE_URL}/api/reports`, testReport);
    if (response.data.success) {
      createdReportId = response.data.data._id;
      log.success(`Report created successfully (ID: ${createdReportId})`);
      log.info(`  - Violation Type: ${response.data.data.violationType}`);
      log.info(`  - Number Plate: ${response.data.data.vehicleDetails.numberPlate}`);
      log.info(`  - Status: ${response.data.data.status}`);
      return true;
    }
  } catch (error) {
    log.error(`Create report failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(err => {
        log.error(`  - ${err.msg}`);
      });
    }
    return false;
  }
}

async function testGetAllReports() {
  try {
    const response = await axios.get(`${BASE_URL}/api/reports`);
    if (response.data.success) {
      log.success(`Fetched ${response.data.data.length} reports`);
      log.info(`  - Total: ${response.data.pagination.total}`);
      log.info(`  - Page: ${response.data.pagination.page}/${response.data.pagination.pages}`);
      return true;
    }
  } catch (error) {
    log.error(`Get all reports failed: ${error.message}`);
    return false;
  }
}

async function testGetReportById() {
  if (!createdReportId) {
    log.warn('Skipping get report by ID (no report created)');
    return false;
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/reports/${createdReportId}`);
    if (response.data.success) {
      log.success(`Fetched report by ID: ${createdReportId}`);
      log.info(`  - Location: ${response.data.data.location.address}`);
      log.info(`  - Reported At: ${new Date(response.data.data.reportedAt).toLocaleString()}`);
      return true;
    }
  } catch (error) {
    log.error(`Get report by ID failed: ${error.message}`);
    return false;
  }
}

async function testUpdateReport() {
  if (!createdReportId) {
    log.warn('Skipping update report (no report created)');
    return false;
  }

  try {
    const response = await axios.put(`${BASE_URL}/api/reports/${createdReportId}`, {
      status: 'verified',
      verificationNotes: 'Test verification - Report verified by automated test'
    });
    if (response.data.success) {
      log.success(`Report updated successfully`);
      log.info(`  - New Status: ${response.data.data.status}`);
      return true;
    }
  } catch (error) {
    log.error(`Update report failed: ${error.message}`);
    return false;
  }
}

async function testGetStatistics() {
  try {
    const response = await axios.get(`${BASE_URL}/api/reports/stats/summary`);
    if (response.data.success) {
      log.success('Statistics fetched successfully');
      log.info(`  - Total Reports: ${response.data.data.totalReports}`);
      log.info(`  - Pending: ${response.data.data.pendingReports}`);
      log.info(`  - Verified: ${response.data.data.verifiedReports}`);
      log.info(`  - Rejected: ${response.data.data.rejectedReports}`);
      return true;
    }
  } catch (error) {
    log.error(`Get statistics failed: ${error.message}`);
    return false;
  }
}

async function testGetNearbyReports() {
  try {
    const response = await axios.get(`${BASE_URL}/api/reports/nearby/77.5946/12.9716?maxDistance=10000`);
    if (response.data.success) {
      log.success(`Found ${response.data.count} nearby reports within 10km`);
      return true;
    }
  } catch (error) {
    log.error(`Get nearby reports failed: ${error.message}`);
    return false;
  }
}

async function testDeleteReport() {
  if (!createdReportId) {
    log.warn('Skipping delete report (no report created)');
    return false;
  }

  try {
    const response = await axios.delete(`${BASE_URL}/api/reports/${createdReportId}`);
    if (response.data.success) {
      log.success('Report deleted successfully');
      return true;
    }
  } catch (error) {
    log.error(`Delete report failed: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 SnapNEarn Backend API Test Suite');
  console.log('='.repeat(60) + '\n');

  log.info('Starting tests...\n');

  const tests = [
    { name: '1. Health Check', fn: testHealthCheck },
    { name: '2. Create Report', fn: testCreateReport },
    { name: '3. Get All Reports', fn: testGetAllReports },
    { name: '4. Get Report by ID', fn: testGetReportById },
    { name: '5. Update Report', fn: testUpdateReport },
    { name: '6. Get Statistics', fn: testGetStatistics },
    { name: '7. Get Nearby Reports', fn: testGetNearbyReports },
    { name: '8. Delete Report', fn: testDeleteReport }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n${colors.blue}Running: ${test.name}${colors.reset}`);
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between tests
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results');
  console.log('='.repeat(60));
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${tests.length}`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    log.success('All tests passed! 🎉');
  } else {
    log.warn(`${failed} test(s) failed. Check the errors above.`);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  log.info('Checking if server is running...');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log.error('Server is not running!');
    log.info('Please start the server first:');
    log.info('  cd backend');
    log.info('  npm run dev');
    process.exit(1);
  }

  log.success('Server is running!\n');
  
  await runTests();
})();
