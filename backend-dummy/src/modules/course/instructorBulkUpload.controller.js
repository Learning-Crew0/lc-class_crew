const fs = require('fs');
const Instructor = require('./instructor.model');
const Course = require('./course.model');
const { parseInstructorFile } = require('../../services/instructorFileParser.service');

/**
 * Bulk upload instructors from CSV or XLSX file
 * Complete workflow: Upload → Parse → Validate → Link Courses → Create → Cleanup
 */
exports.bulkUploadInstructors = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Instructor Bulk Upload - Request Debug:');
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
    const parsedInstructors = await parseInstructorFile(filePath);
    
    if (!parsedInstructors || parsedInstructors.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid instructor data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedInstructors.length} instructors from file`);

    // ========== (c) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking courses...');
    const { validInstructors, invalidInstructors } = await validateAndLinkCourses(parsedInstructors);

    if (validInstructors.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid instructors to import. All instructors had validation errors.',
        invalidInstructors: invalidInstructors
      });
    }

    console.log(`✓ ${validInstructors.length} valid instructors, ${invalidInstructors.length} invalid`);

    // ========== (d) INSTRUCTOR OBJECT CREATION & INSERTION ==========
    console.log('💾 Creating instructors in database...');
    const createdInstructors = [];
    const failedInstructors = [];

    for (const instructorData of validInstructors) {
      try {
        const newInstructor = await Instructor.create({
          courseId: instructorData.courseId,
          name: instructorData.name,
          bio: instructorData.bio || '',
          professionalField: instructorData.professionalField || '',
          certificate: instructorData.certificate || '',
          attendanceHistory: instructorData.attendanceHistory || []
        });
        
        createdInstructors.push({
          id: newInstructor._id,
          name: newInstructor.name,
          courseName: instructorData.courseName
        });
        console.log(`  ✓ Created instructor: ${newInstructor.name} for ${instructorData.courseName}`);
      } catch (error) {
        failedInstructors.push({
          name: instructorData.name,
          courseName: instructorData.courseName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${instructorData.name} - ${error.message}`);
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
      message: 'Instructors uploaded successfully',
      summary: {
        totalProcessed: parsedInstructors.length,
        successfullyAdded: createdInstructors.length,
        failed: failedInstructors.length + invalidInstructors.length
      },
      details: {
        createdInstructors: createdInstructors,
        failedInstructors: failedInstructors,
        invalidInstructors: invalidInstructors
      }
    });

  } catch (error) {
    console.error('❌ Instructor bulk upload failed:', error);
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
      message: 'Failed to process instructor bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Validate instructors and link them to courses
 * @param {Array} parsedInstructors - Parsed instructor data
 * @returns {Object} { validInstructors, invalidInstructors }
 */
async function validateAndLinkCourses(parsedInstructors) {
  const validInstructors = [];
  const invalidInstructors = [];

  // Fetch all courses once (optimization)
  const allCourses = await Course.find({}).lean();
  const courseMap = {};
  allCourses.forEach(course => {
    courseMap[course.title.toLowerCase()] = course._id;
  });

  for (let i = 0; i < parsedInstructors.length; i++) {
    const instructor = parsedInstructors[i];
    const rowNumber = i + 2; // +2 because index starts at 0 and first row is header
    const errors = [];

    // Get courseName from flexible headers (all case variations)
    const courseName = instructor.courseName || instructor.coursename || instructor.course || instructor.CourseName || instructor.Course || instructor.COURSENAME;
    const name = instructor.name || instructor.Name || instructor.NAME || instructor.instructorName || instructor.InstructorName || instructor.instructorname;

    // Validate: Course name is required
    if (!courseName || courseName.trim() === '') {
      errors.push('Course name is required');
    }

    // Validate: Instructor name is required
    if (!name || name.trim() === '') {
      errors.push('Instructor name is required');
    }

    // Validate: Course must exist in database
    const courseId = courseName ? courseMap[courseName.toLowerCase()] : null;
    if (courseName && !courseId) {
      errors.push(`Course "${courseName}" does not exist in database`);
    }

    // Check if instructor already exists for this course (1:1 relationship)
    if (courseId) {
      const existingInstructor = await Instructor.findOne({ courseId: courseId });
      if (existingInstructor) {
        errors.push(`Instructor already exists for course "${courseName}"`);
      }
    }

    // If there are errors, add to invalid list and skip
    if (errors.length > 0) {
      invalidInstructors.push({
        row: rowNumber,
        courseName: courseName || 'N/A',
        name: name || 'N/A',
        errors: errors
      });
      console.log(`  ✗ Row ${rowNumber}: ${errors.join(', ')}`);
      continue;
    }

    // Parse attendanceHistory (handle string, array, or other types)
    const attendanceHistoryRaw = instructor.attendanceHistory || instructor.attendancehistory || instructor.AttendanceHistory || instructor.ATTENDANCEHISTORY;
    let attendanceHistory = [];
    
    if (attendanceHistoryRaw) {
      if (Array.isArray(attendanceHistoryRaw)) {
        attendanceHistory = attendanceHistoryRaw.map(item => String(item).trim()).filter(item => item !== '');
      } else if (typeof attendanceHistoryRaw === 'string') {
        attendanceHistory = attendanceHistoryRaw.split(',').map(item => item.trim()).filter(item => item !== '');
      } else {
        const strValue = String(attendanceHistoryRaw).trim();
        if (strValue && strValue !== '' && strValue !== 'undefined' && strValue !== 'null') {
          attendanceHistory = strValue.split(',').map(item => item.trim()).filter(item => item !== '');
        }
      }
    }

    // Add to valid list (handle all case variations)
    validInstructors.push({
      courseName: courseName,
      courseId: courseId,
      name: name,
      bio: instructor.bio || instructor.Bio || instructor.BIO || '',
      professionalField: instructor.professionalField || instructor.professionalfield || instructor.ProfessionalField || instructor.PROFESSIONALFIELD || instructor.field || instructor.Field || '',
      certificate: instructor.certificate || instructor.Certificate || instructor.CERTIFICATE || '',
      attendanceHistory: attendanceHistory
    });
    console.log(`  ✓ Row ${rowNumber}: ${name} → ${courseName}`);
  }

  return { validInstructors, invalidInstructors };
}

/**
 * Get sample template for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query;

  if (format === 'csv') {
    const csvContent = `courseName,name,bio,professionalField,certificate,attendanceHistory
React Fundamentals,John Doe,10+ years of experience in React and modern web development,Frontend Development,AWS Certified Developer,"React Workshop 2023,Advanced React 2022,JavaScript Bootcamp"
UI/UX Design Basics,Jane Smith,Senior UX Designer with expertise in user research and design systems,UI/UX Design,Google UX Design Certificate,"Design Thinking Workshop,UX Bootcamp 2023,Figma Masterclass"
Digital Marketing,Mike Johnson,Marketing strategist with 15 years of digital marketing experience,Digital Marketing,HubSpot Inbound Marketing,"Marketing 101,SEO Fundamentals,Social Media Strategy 2023"
Advanced Python,Sarah Williams,Data scientist and Python expert specializing in ML and AI,Data Science & AI,IBM Data Science Professional,"Python Basics,Machine Learning Course,Data Analysis Workshop"`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="instructor_template.csv"');
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
      title: 'Instructor Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your instructor data',
        '3. Each row represents ONE instructor for ONE course',
        '4. Make sure all course names exist in your database',
        '5. Upload the file via API',
        '6. Check the response for results'
      ],
      requiredFields: {
        courseName: 'Course name - must match existing course (REQUIRED)',
        name: 'Instructor name (REQUIRED)'
      },
      optionalFields: [
        'bio (instructor biography)',
        'professionalField (field of expertise)',
        'certificate (certifications held)',
        'attendanceHistory (comma-separated list of past courses)'
      ],
      csvStructure: {
        explanation: 'Each row represents ONE INSTRUCTOR for ONE COURSE. This is a 1:1 relationship.',
        example: 'courseName: "React Fundamentals", name: "John Doe", bio: "Expert developer", attendanceHistory: "Course A,Course B"'
      },
      importantNotes: [
        'Course names must match EXACTLY with existing courses (case-insensitive)',
        'If a course doesn\'t exist, that instructor will be skipped',
        'Each course can only have ONE instructor (1:1 relationship)',
        'Duplicate instructors for the same course will be skipped',
        'attendanceHistory should be comma-separated (e.g., "Course A,Course B,Course C")',
        'One row = One instructor (simpler than curriculum!)',
        'File is automatically deleted after processing'
      ]
    }
  });
};
