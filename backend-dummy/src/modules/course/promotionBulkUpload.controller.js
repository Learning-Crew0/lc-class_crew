const fs = require('fs');
const Promotion = require('./promotion.model');
const Course = require('./course.model');
const { parsePromotionFile } = require('../../services/promotionFileParser.service');

/**
 * Bulk upload promotions from CSV or XLSX file
 * Complete workflow: Upload → Parse → Validate → Link Courses → Create → Cleanup
 */
exports.bulkUploadPromotions = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Promotion Bulk Upload - Request Debug:');
    console.log('  Content-Type:', req.headers['content-type']);
    console.log('  Has file:', !!req.file);
    console.log('  Has files:', !!req.files);
    console.log('  Body keys:', Object.keys(req.body));
    
    // ========== (a) FILE UPLOAD ==========
    if (!req.file) {
      console.log('❌ No file found in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a CSV or XLSX file',
        debug: {
          hasFile: !!req.file,
          hasFiles: !!req.files,
          bodyKeys: Object.keys(req.body),
          hint: 'In Postman: Body → form-data → Key: "file" (Type: File)'
        }
      });
    }

    filePath = req.file.path;
    const fileName = req.file.originalname;
    console.log(`📤 Processing file: ${fileName}`);
    console.log(`  File path: ${filePath}`);
    console.log(`  File size: ${(req.file.size / 1024).toFixed(2)} KB`);

    // ========== (b) FILE READING ==========
    console.log('📋 Reading and parsing file...');
    const parsedPromotions = await parsePromotionFile(filePath);
    
    if (!parsedPromotions || parsedPromotions.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid promotion data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedPromotions.length} promotions from file`);

    // ========== (c) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking courses...');
    const { validPromotions, invalidPromotions } = await validateAndLinkCourses(parsedPromotions);

    if (validPromotions.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid promotions to import. All promotions had validation errors.',
        invalidPromotions: invalidPromotions
      });
    }

    console.log(`✓ ${validPromotions.length} valid promotions, ${invalidPromotions.length} invalid`);

    // ========== (d) PROMOTION OBJECT CREATION & INSERTION ==========
    console.log('💾 Creating promotions in database...');
    const createdPromotions = [];
    const failedPromotions = [];

    for (const promotionData of validPromotions) {
      try {
        const newPromotion = await Promotion.create({
          courseId: promotionData.courseId,
          description: promotionData.description || '',
          images: promotionData.images || []
        });
        
        createdPromotions.push({
          id: newPromotion._id,
          courseName: promotionData.courseName,
          description: newPromotion.description,
          imageCount: newPromotion.images.length
        });
        console.log(`  ✓ Created promotion for: ${promotionData.courseName}`);
      } catch (error) {
        failedPromotions.push({
          courseName: promotionData.courseName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${promotionData.courseName} - ${error.message}`);
      }
    }

    // ========== (e) CLEANUP ==========
    console.log('🗑️  Cleaning up uploaded file...');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✓ File deleted successfully');
    }

    // ========== (f) RESPONSE ==========
    res.status(200).json({
      success: true,
      message: 'Promotions uploaded successfully',
      summary: {
        totalProcessed: parsedPromotions.length,
        successfullyAdded: createdPromotions.length,
        failed: failedPromotions.length + invalidPromotions.length
      },
      details: {
        createdPromotions: createdPromotions,
        failedPromotions: failedPromotions,
        invalidPromotions: invalidPromotions
      }
    });

  } catch (error) {
    console.error('❌ Promotion bulk upload failed:', error);
    console.error('  Error name:', error.name);
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);

    // Cleanup file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️  File deleted after error');
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process promotion bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Validate promotions and link them to courses
 * @param {Array} parsedPromotions - Parsed promotion data
 * @returns {Object} { validPromotions, invalidPromotions }
 */
async function validateAndLinkCourses(parsedPromotions) {
  const validPromotions = [];
  const invalidPromotions = [];

  // Fetch all courses once (optimization)
  const allCourses = await Course.find({}).lean();
  const courseMap = {};
  allCourses.forEach(course => {
    courseMap[course.title.toLowerCase()] = course._id;
  });

  for (let i = 0; i < parsedPromotions.length; i++) {
    const promotion = parsedPromotions[i];
    const rowNumber = i + 2; // +2 because index starts at 0 and first row is header
    const errors = [];

    // Get courseName from flexible headers (all case variations)
    const courseName = promotion.courseName || promotion.coursename || promotion.course || promotion.CourseName || promotion.Course || promotion.COURSENAME;
    const description = promotion.description || promotion.Description || promotion.DESCRIPTION || promotion.desc || '';

    // Validate: Course name is required
    if (!courseName || courseName.trim() === '') {
      errors.push('Course name is required');
    }

    // Validate: Course must exist in database
    const courseId = courseName ? courseMap[courseName.toLowerCase()] : null;
    if (courseName && !courseId) {
      errors.push(`Course "${courseName}" does not exist in database`);
    }

    // If there are errors, add to invalid list and skip
    if (errors.length > 0) {
      invalidPromotions.push({
        row: rowNumber,
        courseName: courseName || 'N/A',
        errors: errors
      });
      console.log(`  ✗ Row ${rowNumber}: ${errors.join(', ')}`);
      continue;
    }

    // Parse images (comma-separated URLs to array) - handle string, array, or other types
    const imagesRaw = promotion.images || promotion.Images || promotion.IMAGES || promotion.imageUrls || promotion.imageurls;
    let images = [];
    
    if (imagesRaw) {
      if (Array.isArray(imagesRaw)) {
        // Already an array
        images = imagesRaw.map(url => String(url).trim()).filter(url => url !== '');
      } else if (typeof imagesRaw === 'string') {
        // String - split by comma
        images = imagesRaw.split(',').map(url => url.trim()).filter(url => url !== '');
      } else {
        // Other type - convert to string and try to split
        const strValue = String(imagesRaw).trim();
        if (strValue && strValue !== '' && strValue !== 'undefined' && strValue !== 'null') {
          images = strValue.split(',').map(url => url.trim()).filter(url => url !== '');
        }
      }
    }
    
    console.log(`  📸 Images for ${courseName}: ${images.length} image(s)`, images);

    // Add to valid list
    validPromotions.push({
      courseName: courseName,
      courseId: courseId,
      description: description,
      images: images
    });
    console.log(`  ✓ Row ${rowNumber}: ${courseName} → ${images.length} image(s)`);
  }

  return { validPromotions, invalidPromotions };
}

/**
 * Get sample template for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query;

  if (format === 'csv') {
    const csvContent = `courseName,description,images
React Fundamentals,Limited time offer - Learn React at 50% off! Master hooks and state management.,"https://example.com/promo1.jpg,https://example.com/promo1-banner.jpg"
UI/UX Design Basics,Early bird discount for UI/UX Design course. Includes Figma templates and resources.,https://example.com/design-promo.jpg
Digital Marketing,Black Friday Sale - Save 40% on our comprehensive digital marketing course!,"https://example.com/marketing-promo1.jpg,https://example.com/marketing-promo2.jpg,https://example.com/marketing-banner.jpg"
Advanced Python,New Year special - Start your data science journey with Python. Limited seats available.,https://example.com/python-promo.jpg
Business Strategy,Summer promotion - Learn business strategy from industry experts. Get certified!,"https://example.com/business-promo.jpg,https://example.com/business-banner.jpg"`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="promotion_template.csv"');
    res.send(csvContent);
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid format. Use ?format=csv'
    });
  }
};

/**
 * Get upload instructions
 */
exports.getUploadInstructions = (req, res) => {
  res.json({
    success: true,
    instructions: {
      title: 'Promotion Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your promotion data',
        '3. Each row represents ONE promotion for ONE course',
        '4. One course can have MULTIPLE promotions (1:N relationship)',
        '5. Make sure all course names exist in your database',
        '6. Upload the file via API',
        '7. Check the response for results'
      ],
      requiredFields: {
        courseName: 'Course name - must match existing course (REQUIRED)'
      },
      optionalFields: [
        'description (promotion details and offer information)',
        'images (comma-separated image URLs for promotion banners)'
      ],
      csvStructure: {
        explanation: 'Each row represents ONE PROMOTION for ONE COURSE. A course can have MULTIPLE promotions.',
        example: 'courseName: "React Fundamentals", description: "50% off sale", images: "url1,url2,url3"'
      },
      importantNotes: [
        'Course names must match EXACTLY with existing courses (case-insensitive)',
        'If a course doesn\'t exist, that promotion will be skipped',
        'One course can have MULTIPLE promotions (1:N relationship)',
        'Unlike Instructor/Curriculum, you CAN add multiple promotions for the same course',
        'Images should be comma-separated URLs (e.g., "url1,url2,url3")',
        'Empty images field = no images for that promotion',
        'File is automatically deleted after processing'
      ],
      examples: [
        {
          courseName: 'React Fundamentals',
          description: 'Black Friday Sale - 50% off!',
          images: 'https://example.com/promo1.jpg,https://example.com/banner1.jpg'
        },
        {
          courseName: 'React Fundamentals',
          description: 'New Year Special - Get certified in 2025!',
          images: 'https://example.com/newyear-promo.jpg'
        },
        {
          courseName: 'UI/UX Design',
          description: 'Early bird discount for March batch',
          images: ''
        }
      ]
    }
  });
};

