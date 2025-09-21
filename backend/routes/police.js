const express = require('express');
const router = express.Router();

// @route   GET /api/police/stations
// @desc    Get nearby police stations
// @access  Private
router.get('/stations', (req, res) => {
  res.json({
    success: true,
    message: 'Police stations endpoint - Coming soon!',
    data: [
      {
        id: 'station-1',
        name: 'MG Road Police Station',
        address: 'MG Road, Bangalore',
        phone: '+91-80-12345678'
      }
    ]
  });
});

module.exports = router;
