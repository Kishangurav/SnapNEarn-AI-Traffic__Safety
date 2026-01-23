const express = require('express');
const router = express.Router();

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Reports endpoint - Coming soon!',
    data: []
  });
});

// @route   POST /api/reports
// @desc    Create new report
// @access  Private
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Report created successfully!',
    data: { id: 'mock-report-id' }
  });
});

module.exports = router;
