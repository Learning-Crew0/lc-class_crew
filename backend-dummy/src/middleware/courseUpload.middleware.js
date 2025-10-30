const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/courses/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'courses-' + uniqueSuffix + ext);
  }
});

// File filter - allow CSV and XLSX only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  const allowedExtensions = ['.csv', '.xlsx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for courses
  }
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  console.log('🔍 Upload Error Debug Info:');
  console.log('  Error Type:', err ? err.constructor.name : 'No error');
  console.log('  Error Message:', err ? err.message : 'None');
  console.log('  Error Code:', err ? err.code : 'None');
  console.log('  Request Body Keys:', req.body ? Object.keys(req.body) : 'No body');
  console.log('  Request File:', req.file ? 'File present' : 'No file');
  console.log('  Request Files:', req.files ? 'Files present' : 'No files');
  
  if (err instanceof multer.MulterError) {
    console.log('  Multer Error Code:', err.code);
    console.log('  Multer Field:', err.field);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the limit of 10MB',
        error: err.message
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name in form-data',
        error: `Expected field name: "file", but received: "${err.field || 'unknown'}"`,
        hint: 'In Postman, make sure the form-data key is named exactly "file" (without quotes)'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
      code: err.code,
      field: err.field,
      hint: 'Check that you are using form-data with a field named "file"'
    });
  } else if (err) {
    console.log('  Non-Multer Error:', err.stack);
    return res.status(400).json({
      success: false,
      message: err.message,
      error: err.toString()
    });
  }
  next();
};

module.exports = {
  upload,
  handleUploadError,
  uploadDir
};


