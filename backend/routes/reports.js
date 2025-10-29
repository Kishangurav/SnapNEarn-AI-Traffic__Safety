const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Report = require('../models/Report');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, folder = 'violations') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Helper function to upload base64 image
const uploadBase64ToCloudinary = async (base64String, folder = 'violations') => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// @route   POST /api/reports
// @desc    Create new violation report
// @access  Public (for testing) / Private (in production)
router.post(
  '/',
  [
    body('violationType').isIn(['no_helmet', 'wrong_side', 'signal_jump', 'overspeeding', 'drunk_driving', 'other']),
    body('location.coordinates').isArray({ min: 2, max: 2 }),
    body('location.address').notEmpty().withMessage('Address is required'),
    body('vehicleDetails.numberPlate').notEmpty().withMessage('Number plate is required')
  ],
  async (req, res) => {
    try {
      // Validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const {
        violationType,
        description,
        location,
        vehicleDetails,
        photos, // Array of base64 images or URLs
        reporterId, // Optional: user ID if authenticated
        isAnonymous
      } = req.body;

      // Upload photos to Cloudinary
      const uploadedPhotos = [];
      if (photos && Array.isArray(photos)) {
        for (const photo of photos) {
          try {
            let uploadResult;
            
            // Check if it's a base64 string
            if (photo.startsWith('data:image')) {
              uploadResult = await uploadBase64ToCloudinary(photo);
            } else if (photo.startsWith('http')) {
              // If it's already a URL, just store it
              uploadedPhotos.push({
                public_id: 'external_' + Date.now(),
                url: photo,
                uploadedAt: new Date()
              });
              continue;
            }
            
            if (uploadResult) {
              uploadedPhotos.push({
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
                uploadedAt: new Date()
              });
            }
          } catch (uploadError) {
            console.error('Photo upload error:', uploadError);
            // Continue with other photos even if one fails
          }
        }
      }

      // Create report data
      const reportData = {
        reporter: reporterId || null, // Will be null for anonymous reports
        violationType,
        description,
        location: {
          type: 'Point',
          coordinates: location.coordinates, // [longitude, latitude]
          address: location.address,
          landmark: location.landmark
        },
        photos: uploadedPhotos,
        vehicleDetails: {
          numberPlate: vehicleDetails.numberPlate.toUpperCase(),
          vehicleType: vehicleDetails.vehicleType || 'motorcycle',
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          color: vehicleDetails.color
        },
        isAnonymous: isAnonymous || false,
        status: 'pending',
        reportedAt: new Date()
      };

      // Create report
      const report = await Report.create(reportData);

      // Update user statistics if not anonymous
      if (reporterId) {
        await User.findByIdAndUpdate(reporterId, {
          $inc: { totalReports: 1 }
        });
      }

      // Emit socket event for real-time updates
      const io = req.app.get('io');
      if (io) {
        io.emit('newReport', {
          reportId: report._id,
          violationType: report.violationType,
          location: report.location.address
        });
      }

      res.status(201).json({
        success: true,
        message: 'Violation report submitted successfully!',
        data: report
      });

    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create report',
        error: error.message
      });
    }
  }
);

// @route   POST /api/reports/upload
// @desc    Upload violation report with multipart form data
// @access  Public (for testing)
router.post('/upload', upload.array('photos', 5), async (req, res) => {
  try {
    const {
      violationType,
      description,
      latitude,
      longitude,
      address,
      landmark,
      numberPlate,
      vehicleType,
      make,
      model,
      color,
      reporterId,
      isAnonymous
    } = req.body;

    // Validate required fields
    if (!violationType || !latitude || !longitude || !address || !numberPlate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: violationType, latitude, longitude, address, numberPlate'
      });
    }

    // Upload photos to Cloudinary
    const uploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await uploadToCloudinary(file.buffer);
          uploadedPhotos.push({
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
            uploadedAt: new Date()
          });
        } catch (uploadError) {
          console.error('Photo upload error:', uploadError);
        }
      }
    }

    // Create report
    const report = await Report.create({
      reporter: reporterId || null,
      violationType,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
        landmark
      },
      photos: uploadedPhotos,
      vehicleDetails: {
        numberPlate: numberPlate.toUpperCase(),
        vehicleType: vehicleType || 'motorcycle',
        make,
        model,
        color
      },
      isAnonymous: isAnonymous === 'true',
      status: 'pending',
      reportedAt: new Date()
    });

    // Update user statistics
    if (reporterId) {
      await User.findByIdAndUpdate(reporterId, {
        $inc: { totalReports: 1 }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully!',
      data: report
    });

  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload report',
      error: error.message
    });
  }
});

// @route   GET /api/reports
// @desc    Get all reports with filters and pagination
// @access  Public (for testing)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      violationType,
      reporterId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (violationType) query.violationType = violationType;
    if (reporterId) query.reporter = reporterId;
    
    if (startDate || endDate) {
      query.reportedAt = {};
      if (startDate) query.reportedAt.$gte = new Date(startDate);
      if (endDate) query.reportedAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const reports = await Report.find(query)
      .populate('reporter', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email phone avatar')
      .populate('verification.verifiedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message
    });
  }
});

// @route   PUT /api/reports/:id
// @desc    Update report status
// @access  Private (Admin/Police)
router.put('/:id', async (req, res) => {
  try {
    const { status, verificationNotes, challanNumber, fineAmount } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    
    if (status === 'verified') {
      updateData['verification.verifiedAt'] = new Date();
      updateData['verification.verificationNotes'] = verificationNotes;
    }

    if (status === 'challan_issued' && challanNumber && fineAmount) {
      updateData['challan.challanNumber'] = challanNumber;
      updateData['challan.fineAmount'] = fineAmount;
      updateData['challan.issuedAt'] = new Date();
      updateData['challan.dueDate'] = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update user statistics if verified
    if (status === 'verified' && report.reporter) {
      await User.findByIdAndUpdate(report.reporter, {
        $inc: { verifiedReports: 1, totalEarnings: report.reward.amount }
      });
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });

  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report',
      error: error.message
    });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Delete photos from Cloudinary
    if (report.photos && report.photos.length > 0) {
      for (const photo of report.photos) {
        try {
          if (photo.public_id && !photo.public_id.startsWith('external_')) {
            await cloudinary.uploader.destroy(photo.public_id);
          }
        } catch (deleteError) {
          console.error('Photo delete error:', deleteError);
        }
      }
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
});

// @route   GET /api/reports/stats/summary
// @desc    Get reports statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const verifiedReports = await Report.countDocuments({ status: 'verified' });
    const rejectedReports = await Report.countDocuments({ status: 'rejected' });
    
    const reportsByType = await Report.aggregate([
      {
        $group: {
          _id: '$violationType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalFines = await Report.aggregate([
      {
        $match: { 'challan.fineAmount': { $exists: true } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$challan.fineAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        verifiedReports,
        rejectedReports,
        reportsByType,
        totalFines: totalFines[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// @route   GET /api/reports/nearby
// @desc    Get reports near a location
// @access  Public
router.get('/nearby/:longitude/:latitude', async (req, res) => {
  try {
    const { longitude, latitude } = req.params;
    const { maxDistance = 5000, limit = 20 } = req.query; // 5km default

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
    .limit(parseInt(limit))
    .populate('reporter', 'name');

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });

  } catch (error) {
    console.error('Get nearby reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby reports',
      error: error.message
    });
  }
});

module.exports = router;
