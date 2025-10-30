  const fs = require('fs');
const Review = require('./review.model');
const Course = require('./course.model');
const { parseReviewFile } = require('../../services/reviewFileParser.service');

/**
 * Bulk upload reviews from CSV or XLSX file
 * Complete workflow: Upload → Parse → Validate → Link Courses → Create → Cleanup
 */
exports.bulkUploadReviews = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Review Bulk Upload - Request Debug:');
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
    const parsedReviews = await parseReviewFile(filePath);
    
    if (!parsedReviews || parsedReviews.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid review data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedReviews.length} reviews from file`);

    // ========== (c) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking courses...');
    const { validReviews, invalidReviews } = await validateAndLinkCourses(parsedReviews);

    if (validReviews.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid reviews to import. All reviews had validation errors.',
        invalidReviews: invalidReviews
      });
    }

    console.log(`✓ ${validReviews.length} valid reviews, ${invalidReviews.length} invalid`);

    // ========== (d) REVIEW OBJECT CREATION & INSERTION ==========
    console.log('💾 Creating reviews in database...');
    const createdReviews = [];
    const failedReviews = [];

    for (const reviewData of validReviews) {
      try {
        const newReview = await Review.create({
          courseId: reviewData.courseId,
          reviewerName: reviewData.reviewerName,
          avatar: reviewData.avatar || '',
          text: reviewData.text
        });
        
        createdReviews.push({
          id: newReview._id,
          courseName: reviewData.courseName,
          reviewerName: newReview.reviewerName,
          text: newReview.text.substring(0, 50) + '...'
        });
        console.log(`  ✓ Created review by ${reviewData.reviewerName} for ${reviewData.courseName}`);
      } catch (error) {
        failedReviews.push({
          courseName: reviewData.courseName,
          reviewerName: reviewData.reviewerName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${reviewData.reviewerName} - ${error.message}`);
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
      message: 'Reviews uploaded successfully',
      summary: {
        totalProcessed: parsedReviews.length,
        successfullyAdded: createdReviews.length,
        failed: failedReviews.length + invalidReviews.length
      },
      details: {
        createdReviews: createdReviews,
        failedReviews: failedReviews,
        invalidReviews: invalidReviews
      }
    });

  } catch (error) {
    console.error('❌ Review bulk upload failed:', error);
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
      message: 'Failed to process review bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Validate reviews and link them to courses
 * @param {Array} parsedReviews - Parsed review data
 * @returns {Object} { validReviews, invalidReviews }
 */
async function validateAndLinkCourses(parsedReviews) {
  const validReviews = [];
  const invalidReviews = [];

  // Fetch all courses once (optimization)
  const allCourses = await Course.find({}).lean();
  const courseMap = {};
  allCourses.forEach(course => {
    courseMap[course.title.toLowerCase()] = course._id;
  });

  for (let i = 0; i < parsedReviews.length; i++) {
    const review = parsedReviews[i];
    const rowNumber = i + 2; // +2 because index starts at 0 and first row is header
    const errors = [];

    // Get fields from flexible headers (all case variations)
    const courseName = review.courseName || review.coursename || review.course || review.CourseName || review.Course || review.COURSENAME;
    const reviewerName = review.reviewerName || review.reviewername || review.name || review.reviewer || review.ReviewerName || review.Name || review.REVIEWERNAME;
    const text = review.text || review.Text || review.TEXT || review.review || review.comment || review.Review || review.Comment;
    const avatar = review.avatar || review.Avatar || review.AVATAR || review.avatarUrl || review.avatarurl || review.AvatarUrl || '';

    // Validate: Course name is required
    if (!courseName || courseName.trim() === '') {
      errors.push('Course name is required');
    }

    // Validate: Reviewer name is required
    if (!reviewerName || reviewerName.trim() === '') {
      errors.push('Reviewer name is required');
    }

    // Validate: Review text is required
    if (!text || text.trim() === '') {
      errors.push('Review text is required');
    }

    // Validate: Course must exist in database
    const courseId = courseName ? courseMap[courseName.toLowerCase()] : null;
    if (courseName && !courseId) {
      errors.push(`Course "${courseName}" does not exist in database`);
    }

    // If there are errors, add to invalid list and skip
    if (errors.length > 0) {
      invalidReviews.push({
        row: rowNumber,
        courseName: courseName || 'N/A',
        reviewerName: reviewerName || 'N/A',
        errors: errors
      });
      console.log(`  ✗ Row ${rowNumber}: ${errors.join(', ')}`);
      continue;
    }

    // Add to valid list
    validReviews.push({
      courseName: courseName,
      courseId: courseId,
      reviewerName: reviewerName,
      text: text,
      avatar: avatar
    });
    console.log(`  ✓ Row ${rowNumber}: ${reviewerName} → ${courseName}`);
  }

  return { validReviews, invalidReviews };
}

/**
 * Get sample template for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query;

  if (format === 'csv') {
    const csvContent = `courseName,reviewerName,text,avatar
React Fundamentals,John Smith,"This course completely transformed my career! The instructor's teaching style is exceptional and the projects are very practical. Highly recommended for anyone wanting to master React.",https://example.com/avatars/john.jpg
React Fundamentals,Sarah Johnson,"Best React course I've taken! Clear explanations, great examples, and excellent support from the instructor. The hands-on approach really helped me understand complex concepts.",https://example.com/avatars/sarah.jpg
React Fundamentals,Michael Chen,"Fantastic course with real-world projects. I was able to build a full React application by the end. The curriculum is well-structured and easy to follow.",https://example.com/avatars/michael.jpg
UI/UX Design Basics,Emily Davis,"As a developer transitioning to design, this course was perfect. Learned Figma, design principles, and got practical experience with real projects.",https://example.com/avatars/emily.jpg
UI/UX Design Basics,David Wilson,"Excellent introduction to UI/UX design. The instructor covers everything from wireframing to prototyping. Great value for money!",https://example.com/avatars/david.jpg
Digital Marketing,Lisa Anderson,"Comprehensive digital marketing course! Covered SEO, social media, analytics - everything you need to succeed in digital marketing today.",https://example.com/avatars/lisa.jpg
Advanced Python,Robert Taylor,"Deep dive into Python! The data science and machine learning modules were outstanding. Instructor explains complex topics in simple terms.",https://example.com/avatars/robert.jpg
Business Strategy,Jennifer Brown,"Great business strategy course with practical case studies. Learned frameworks used by top consulting firms. Very insightful!",https://example.com/avatars/jennifer.jpg`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="review_template.csv"');
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
      title: 'Review Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your review data',
        '3. Each row represents ONE review from ONE reviewer',
        '4. One course can have MULTIPLE reviews (1:N relationship)',
        '5. Make sure all course names exist in your database',
        '6. Upload the file via API',
        '7. Check the response for results'
      ],
      requiredFields: {
        courseName: 'Course name - must match existing course (REQUIRED)',
        reviewerName: 'Name of the person writing the review (REQUIRED)',
        text: 'Review content/comment (REQUIRED)'
      },
      optionalFields: [
        'avatar (reviewer\'s avatar/profile picture URL)'
      ],
      csvStructure: {
        explanation: 'Each row represents ONE REVIEW for ONE COURSE. A course can have MULTIPLE reviews from different people.',
        example: 'courseName: "React Fundamentals", reviewerName: "John Doe", text: "Great course!", avatar: "url"'
      },
      importantNotes: [
        'Course names must match EXACTLY with existing courses (case-insensitive)',
        'If a course doesn\'t exist, that review will be skipped',
        'One course can have MULTIPLE reviews (1:N relationship)',
        'reviewerName and text are REQUIRED fields',
        'avatar is optional - leave empty if no avatar URL',
        'Reviews help build social proof and credibility for courses',
        'File is automatically deleted after processing'
      ],
      examples: [
        {
          courseName: 'React Fundamentals',
          reviewerName: 'John Smith',
          text: 'Excellent course! Learned React from scratch and built 3 projects.',
          avatar: 'https://example.com/avatar1.jpg'
        },
        {
          courseName: 'React Fundamentals',
          reviewerName: 'Sarah Johnson',
          text: 'Best React course I have taken. Instructor is very knowledgeable.',
          avatar: 'https://example.com/avatar2.jpg'
        },
        {
          courseName: 'UI/UX Design',
          reviewerName: 'Emily Davis',
          text: 'Great introduction to UI/UX design. Highly recommended!',
          avatar: ''
        }
      ]
    }
  });
};

