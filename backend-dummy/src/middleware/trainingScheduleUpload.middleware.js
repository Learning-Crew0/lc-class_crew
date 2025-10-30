const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'training-schedule-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Error handler middleware
const handleUploadError = (err, req, res, next) => {
  console.log('🔍 TrainingScheduleUpload Middleware - Error Debug:');
  console.log('  Error name:', err?.name);
  console.log('  Error message:', err?.message);
  console.log('  Error code:', err?.code);
  
  if (err instanceof multer.MulterError) {
    console.log('  Multer error type:', err.code);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log('  Hint: Expected field name is "file"');
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "file" as the field name',
        hint: 'In Postman: Body → form-data → Key: "file" (Type: File)'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Unknown error during file upload'
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleUploadError
};

