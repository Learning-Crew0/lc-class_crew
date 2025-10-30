const fs = require('fs');
const Notice = require('./notice.model');
const Course = require('./course.model');
const { parseNoticeFile } = require('../../services/noticeFileParser.service');

/**
 * Bulk upload notices from CSV or XLSX file
 * Complete workflow: Upload → Parse → Validate → Link Courses → Create → Cleanup
 */
exports.bulkUploadNotices = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Notice Bulk Upload - Request Debug:');
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
    const parsedNotices = await parseNoticeFile(filePath);
    
    if (!parsedNotices || parsedNotices.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid notice data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedNotices.length} notices from file`);

    // ========== (c) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking courses...');
    const { validNotices, invalidNotices } = await validateAndLinkCourses(parsedNotices);

    if (validNotices.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid notices to import. All notices had validation errors.',
        invalidNotices: invalidNotices
      });
    }

    console.log(`✓ ${validNotices.length} valid notices, ${invalidNotices.length} invalid`);

    // ========== (d) NOTICE OBJECT CREATION & INSERTION ==========
    console.log('💾 Creating notices in database...');
    const createdNotices = [];
    const failedNotices = [];

    for (const noticeData of validNotices) {
      try {
        const newNotice = await Notice.create({
          courseId: noticeData.courseId,
          noticeImage: noticeData.noticeImage || '',
          noticeDesc: noticeData.noticeDesc || ''
        });
        
        createdNotices.push({
          id: newNotice._id,
          courseName: noticeData.courseName,
          noticeDesc: newNotice.noticeDesc.substring(0, 50) + '...'
        });
        console.log(`  ✓ Created notice for: ${noticeData.courseName}`);
      } catch (error) {
        failedNotices.push({
          courseName: noticeData.courseName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${noticeData.courseName} - ${error.message}`);
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
      message: 'Notices uploaded successfully',
      summary: {
        totalProcessed: parsedNotices.length,
        successfullyAdded: createdNotices.length,
        failed: failedNotices.length + invalidNotices.length
      },
      details: {
        createdNotices: createdNotices,
        failedNotices: failedNotices,
        invalidNotices: invalidNotices
      }
    });

  } catch (error) {
    console.error('❌ Notice bulk upload failed:', error);
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
      message: 'Failed to process notice bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Validate notices and link them to courses
 * @param {Array} parsedNotices - Parsed notice data
 * @returns {Object} { validNotices, invalidNotices }
 */
async function validateAndLinkCourses(parsedNotices) {
  const validNotices = [];
  const invalidNotices = [];

  // Fetch all courses once (optimization)
  const allCourses = await Course.find({}).lean();
  const courseMap = {};
  allCourses.forEach(course => {
    courseMap[course.title.toLowerCase()] = course._id;
  });

  for (let i = 0; i < parsedNotices.length; i++) {
    const notice = parsedNotices[i];
    const rowNumber = i + 2; // +2 because index starts at 0 and first row is header
    const errors = [];

    // Get courseName from flexible headers (all case variations)
    const courseName = notice.courseName || notice.coursename || notice.course || notice.CourseName || notice.Course || notice.COURSENAME;
    const noticeDesc = notice.noticeDesc || notice.noticedesc || notice.description || notice.desc || notice.Description || notice.NOTICEDESC || '';
    const noticeImage = notice.noticeImage || notice.noticeimage || notice.image || notice.imageUrl || notice.Image || notice.NOTICEIMAGE || '';

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
      invalidNotices.push({
        row: rowNumber,
        courseName: courseName || 'N/A',
        errors: errors
      });
      console.log(`  ✗ Row ${rowNumber}: ${errors.join(', ')}`);
      continue;
    }

    // Add to valid list
    validNotices.push({
      courseName: courseName,
      courseId: courseId,
      noticeDesc: noticeDesc,
      noticeImage: noticeImage
    });
    console.log(`  ✓ Row ${rowNumber}: ${courseName}`);
  }

  return { validNotices, invalidNotices };
}

/**
 * Get sample template for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query;

  if (format === 'csv') {
    const csvContent = `courseName,noticeDesc,noticeImage
React Fundamentals,Important: Class schedule changed to Monday and Wednesday evenings starting next week.,https://example.com/notice-schedule.jpg
React Fundamentals,New assignment posted! Complete the React Hooks exercise by Friday. Check the course portal for details.,https://example.com/notice-assignment.jpg
UI/UX Design Basics,Guest lecture on Design Systems this Thursday at 6 PM. Don't miss this exclusive session!,https://example.com/notice-guest-lecture.jpg
Digital Marketing,Updated reading materials available in the resources section. Please review before next class.,https://example.com/notice-materials.jpg
Advanced Python,Final project submission deadline extended to next Monday. Make sure to submit via GitHub.,https://example.com/notice-deadline.jpg
Business Strategy,Mid-term exam scheduled for next week. Study guide and practice questions now available.,https://example.com/notice-exam.jpg`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="notice_template.csv"');
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
      title: 'Notice Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your notice data',
        '3. Each row represents ONE notice for ONE course',
        '4. One course can have MULTIPLE notices (1:N relationship)',
        '5. Make sure all course names exist in your database',
        '6. Upload the file via API',
        '7. Check the response for results'
      ],
      requiredFields: {
        courseName: 'Course name - must match existing course (REQUIRED)'
      },
      optionalFields: [
        'noticeDesc (notice description/message)',
        'noticeImage (image URL for the notice)'
      ],
      csvStructure: {
        explanation: 'Each row represents ONE NOTICE for ONE COURSE. A course can have MULTIPLE notices.',
        example: 'courseName: "React Fundamentals", noticeDesc: "Class schedule changed", noticeImage: "url"'
      },
      importantNotes: [
        'Course names must match EXACTLY with existing courses (case-insensitive)',
        'If a course doesn\'t exist, that notice will be skipped',
        'One course can have MULTIPLE notices (1:N relationship)',
        'Notices are great for announcements, updates, schedule changes, etc.',
        'noticeImage is optional - leave empty if no image',
        'File is automatically deleted after processing'
      ],
      examples: [
        {
          courseName: 'React Fundamentals',
          noticeDesc: 'Class schedule changed to Monday evenings',
          noticeImage: 'https://example.com/notice1.jpg'
        },
        {
          courseName: 'React Fundamentals',
          noticeDesc: 'New assignment posted - due Friday',
          noticeImage: 'https://example.com/notice2.jpg'
        },
        {
          courseName: 'UI/UX Design',
          noticeDesc: 'Guest lecture this Thursday at 6 PM',
          noticeImage: ''
        }
      ]
    }
  });
};

