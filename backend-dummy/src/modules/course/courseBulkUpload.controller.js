const fs = require('fs');
const Course = require('./course.model');
const Category = require('../category/category.model');
const { parseFile } = require('../../services/courseFileParser.service');

/**
 * Bulk upload courses from CSV or XLSX file
 * Complete workflow: Upload → Parse → Validate → Link Categories → Bulk Insert → Cleanup
 */
exports.bulkUploadCourses = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Course Bulk Upload - Request Debug:');
    console.log('  Content-Type:', req.headers['content-type']);
    console.log('  Has file:', !!req.file);
    console.log('  Has files:', !!req.files);
    console.log('  Body keys:', Object.keys(req.body));
    
    // ========== (a) FILE UPLOAD ==========
    if (!req.file) {
      console.log('❌ No file found in request');
      console.log('  Hint: Make sure you are using form-data with a field named "file"');
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
    const parsedCourses = await parseFile(filePath);
    
    if (!parsedCourses || parsedCourses.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid course data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedCourses.length} courses from file`);

    // ========== (c) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking categories...');
    const { validCourses, invalidCourses } = await validateAndLinkCategories(parsedCourses);

    if (validCourses.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid courses to import. All courses had validation errors.',
        invalidCourses: invalidCourses
      });
    }

    console.log(`✓ ${validCourses.length} valid courses, ${invalidCourses.length} invalid`);

    // ========== (d) COURSE OBJECT CREATION ==========
    console.log('🏗️  Building course objects...');
    const newCourses = validCourses.map(course => ({
      title: course.title,
      category: course.category, // ObjectId from validation step
      tagColor: course.tagColor || '',
      tagText: course.tagText || '',
      tags: course.tags || [],
      processName: course.processName || '',
      shortDescription: course.shortDescription || '',
      longDescription: course.longDescription || '',
      target: course.target || '',
      duration: course.duration || '',
      location: course.location || '',
      hours: course.hours || null,
      price: course.price || null,
      priceText: course.priceText || '',
      field: course.field || '',
      date: course.date || '',
      refundOptions: course.refundOptions || '',
      learningGoals: course.learningGoals || '',
      mainImage: course.mainImage || '',
      noticeImage: course.noticeImage || '',
      recommendedAudience: course.recommendedAudience || [],
      isActive: course.isActive !== undefined ? course.isActive : true,
      isFeatured: course.isFeatured !== undefined ? course.isFeatured : false
    }));

    // ========== (e) BULK INSERTION ==========
    console.log('💾 Performing bulk insertion...');
    const insertResult = await Course.insertMany(newCourses, { 
      ordered: false // Continue even if some fail
    });

    console.log(`✓ Successfully inserted ${insertResult.length} courses`);

    // ========== (f) CLEANUP ==========
    console.log('🗑️  Cleaning up uploaded file...');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✓ File deleted successfully');
    }

    // ========== (g) RESPONSE ==========
    res.status(200).json({
      success: true,
      message: 'Courses uploaded successfully',
      summary: {
        totalProcessed: parsedCourses.length,
        successfullyAdded: insertResult.length,
        invalidRows: invalidCourses.length
      },
      details: {
        addedCourses: insertResult.map(course => ({
          id: course._id,
          title: course.title,
          category: course.category
        })),
        invalidCourses: invalidCourses
      }
    });

  } catch (error) {
    console.error('❌ Bulk upload failed:', error);
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
      message: 'Failed to process bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Validate courses and link them to categories
 * @param {Array} parsedCourses - Parsed courses from file
 * @returns {Object} { validCourses, invalidCourses }
 */
async function validateAndLinkCategories(parsedCourses) {
  const validCourses = [];
  const invalidCourses = [];

  // Fetch all categories once (optimization)
  const allCategories = await Category.find({}).lean();
  const categoryMap = {};
  allCategories.forEach(cat => {
    categoryMap[cat.title.toLowerCase()] = cat._id;
  });

  for (let i = 0; i < parsedCourses.length; i++) {
    const course = parsedCourses[i];
    const rowNumber = i + 2; // +2 because index starts at 0 and first row is header
    const errors = [];

    // Validate required fields
    if (!course.title || course.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!course.categoryName || course.categoryName.trim() === '') {
      errors.push('Category name is required');
    }

    // Check if category exists
    const categoryId = categoryMap[course.categoryName.toLowerCase()];
    if (!categoryId) {
      errors.push(`Category "${course.categoryName}" does not exist in database`);
    }

    // If there are errors, add to invalid list and skip
    if (errors.length > 0) {
      invalidCourses.push({
        row: rowNumber,
        title: course.title || 'N/A',
        categoryName: course.categoryName || 'N/A',
        errors: errors
      });
      console.log(`  ✗ Row ${rowNumber}: ${errors.join(', ')}`);
      continue;
    }

    // Add category ObjectId to course
    course.category = categoryId;
    validCourses.push(course);
    console.log(`  ✓ Row ${rowNumber}: ${course.title} → Category: ${course.categoryName}`);
  }

  return { validCourses, invalidCourses };
}

/**
 * Get sample template for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query;

  if (format === 'csv') {
    const csvContent = `title,category,tagColor,tagText,tags,shortDescription,longDescription,target,duration,location,hours,price,priceText,field,date,refundOptions,learningGoals,mainImage,isActive,isFeatured
React Fundamentals,Programming,#FF5733,Hot,"React,JavaScript,Frontend",Learn React from scratch,Comprehensive React course covering hooks and state management,입사 3년차 미만 주니어,12시간,러닝크루 성수 CLASS,40,600000,60만원(중식 포함),Web Development,20240115,30-day money back,Build modern React apps,https://example.com/react.jpg,true,false
UI/UX Design Basics,Design,#4CAF50,New,"Design,UI,UX",Learn design fundamentals,Complete guide to modern UI/UX design principles,초급 디자이너,16시간,온라인,32,450000,45만원,Design,20240120,14-day refund,Create beautiful interfaces,https://example.com/design.jpg,true,true
Digital Marketing,Marketing,#2196F3,Popular,"Marketing,SEO,Social Media",Master digital marketing,Learn SEO and social media marketing strategies,마케팅 담당자,20시간,하이브리드,40,500000,50만원,Marketing,20240125,7-day refund,Grow your business online,https://example.com/marketing.jpg,true,false`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="course_template.csv"');
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
      title: 'Course Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your course data',
        '3. Make sure all category names exist in your database',
        '4. Upload the file via API',
        '5. Check the response for results'
      ],
      requiredFields: {
        title: 'Course title (REQUIRED)',
        category: 'Category name - must match existing category (REQUIRED)'
      },
      optionalFields: [
        'tagColor', 'tagText', 'tags', 'shortDescription', 'longDescription',
        'target', 'duration', 'location', 'hours', 'price', 'priceText',
        'field', 'date', 'refundOptions', 'learningGoals', 'mainImage',
        'noticeImage', 'recommendedAudience', 'isActive', 'isFeatured'
      ],
      importantNotes: [
        'Category names must match EXACTLY with existing categories',
        'If a category doesn\'t exist, that course will be skipped',
        'Tags and arrays should be comma-separated',
        'Boolean fields: use true/false, 1/0, yes/no',
        'Numbers: use plain numbers (no commas or currency symbols)',
        'File is automatically deleted after processing'
      ]
    }
  });
};


