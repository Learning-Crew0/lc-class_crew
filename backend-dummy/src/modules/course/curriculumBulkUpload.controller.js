const fs = require('fs');
const Curriculum = require('./curriculum.model');
const Course = require('./course.model');
const { parseCurriculumFile } = require('../../services/curriculumFileParser.service');

/**
 * Bulk upload curriculums from CSV or XLSX file
 * Complete workflow: Upload → Parse → Group → Validate → Link Courses → Create → Cleanup
 */
exports.bulkUploadCurriculums = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Curriculum Bulk Upload - Request Debug:');
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
    const parsedRows = await parseCurriculumFile(filePath);
    
    if (!parsedRows || parsedRows.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid curriculum data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedRows.length} rows from file`);

    // ========== (c) DATA GROUPING ==========
    // Group rows by courseName to build modules array
    console.log('🔄 Grouping rows by course...');
    const groupedData = groupRowsByCourse(parsedRows);
    console.log(`📚 Found ${Object.keys(groupedData).length} unique courses`);

    // ========== (d) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking courses...');
    const { validCurriculums, invalidCurriculums } = await validateAndLinkCourses(groupedData);

    if (validCurriculums.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid curriculums to import. All curriculums had validation errors.',
        invalidCurriculums: invalidCurriculums
      });
    }

    console.log(`✓ ${validCurriculums.length} valid curriculums, ${invalidCurriculums.length} invalid`);

    // ========== (e) CURRICULUM OBJECT CREATION & INSERTION ==========
    console.log('💾 Creating curriculums in database...');
    const createdCurriculums = [];
    const failedCurriculums = [];

    for (const curriculumData of validCurriculums) {
      try {
        const newCurriculum = await Curriculum.create({
          courseId: curriculumData.courseId,
          keywords: curriculumData.keywords || [],
          modules: curriculumData.modules || []
        });
        
        createdCurriculums.push({
          id: newCurriculum._id,
          courseName: curriculumData.courseName,
          moduleCount: newCurriculum.modules.length
        });
        console.log(`  ✓ Created curriculum for: ${curriculumData.courseName}`);
      } catch (error) {
        failedCurriculums.push({
          courseName: curriculumData.courseName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${curriculumData.courseName} - ${error.message}`);
      }
    }

    // ========== (f) CLEANUP ==========
    console.log('🗑️  Cleaning up uploaded file...');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✓ File deleted successfully');
    }

    // ========== (g) RESPONSE ==========
    res.status(200).json({
      success: true,
      message: 'Curriculums uploaded successfully',
      summary: {
        totalRows: parsedRows.length,
        uniqueCourses: Object.keys(groupedData).length,
        successfullyAdded: createdCurriculums.length,
        failed: failedCurriculums.length + invalidCurriculums.length
      },
      details: {
        createdCurriculums: createdCurriculums,
        failedCurriculums: failedCurriculums,
        invalidCurriculums: invalidCurriculums
      }
    });

  } catch (error) {
    console.error('❌ Curriculum bulk upload failed:', error);
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
      message: 'Failed to process curriculum bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Group parsed rows by course name
 * @param {Array} rows - Parsed rows from CSV/XLSX
 * @returns {Object} - Grouped data by courseName
 */
function groupRowsByCourse(rows) {
  const grouped = {};

  for (const row of rows) {
    // Handle all case variations of courseName
    const courseName = row.courseName || row.coursename || row.course || row.CourseName || row.Course || row.COURSENAME;
    
    if (!courseName) {
      console.log('⚠️  Skipping row - no courseName found:', row);
      continue;
    }

    if (!grouped[courseName]) {
      grouped[courseName] = {
        courseName: courseName,
        keywords: row.keywords || row.Keywords || row.KEYWORDS || '',
        modules: []
      };
    }

    // Add module to the course (handle all case variations)
    const moduleName = row.moduleName || row.modulename || row.module || row.ModuleName || row.Module || row.MODULENAME || '';
    const moduleContent = row.moduleContent || row.modulecontent || row.content || row.ModuleContent || row.Content || row.MODULECONTENT || '';

    if (moduleName) {
      grouped[courseName].modules.push({
        name: moduleName,
        content: moduleContent
      });
    } else {
      console.log('⚠️  Skipping module - no moduleName found in row:', row);
    }
  }

  console.log('🔍 Grouped data:', JSON.stringify(grouped, null, 2));
  return grouped;
}

/**
 * Validate curriculums and link them to courses
 * @param {Object} groupedData - Grouped curriculum data
 * @returns {Object} { validCurriculums, invalidCurriculums }
 */
async function validateAndLinkCourses(groupedData) {
  const validCurriculums = [];
  const invalidCurriculums = [];

  // Fetch all courses once (optimization)
  const allCourses = await Course.find({}).lean();
  const courseMap = {};
  allCourses.forEach(course => {
    courseMap[course.title.toLowerCase()] = course._id;
  });

  for (const courseName in groupedData) {
    const curriculumData = groupedData[courseName];
    const errors = [];

    // Validate: Course name is required
    if (!courseName || courseName.trim() === '') {
      errors.push('Course name is required');
    }

    // Validate: Course must exist in database
    const courseId = courseMap[courseName.toLowerCase()];
    if (!courseId) {
      errors.push(`Course "${courseName}" does not exist in database`);
    }

    // Validate: Must have at least one module with name
    if (!curriculumData.modules || curriculumData.modules.length === 0) {
      errors.push('At least one module is required');
    } else {
      const validModules = curriculumData.modules.filter(m => m.name && m.name.trim() !== '');
      if (validModules.length === 0) {
        errors.push('At least one module must have a name');
      }
    }

    // Check if curriculum already exists for this course
    if (courseId) {
      const existingCurriculum = await Curriculum.findOne({ courseId: courseId });
      if (existingCurriculum) {
        errors.push(`Curriculum already exists for course "${courseName}"`);
      }
    }

    // If there are errors, add to invalid list and skip
    if (errors.length > 0) {
      invalidCurriculums.push({
        courseName: courseName,
        errors: errors
      });
      console.log(`  ✗ ${courseName}: ${errors.join(', ')}`);
      continue;
    }

    // Parse keywords (comma-separated string to array)
    const keywords = curriculumData.keywords
      ? curriculumData.keywords.split(',').map(k => k.trim()).filter(k => k !== '')
      : [];

    // Add to valid list
    validCurriculums.push({
      courseName: courseName,
      courseId: courseId,
      keywords: keywords,
      modules: curriculumData.modules
    });
    console.log(`  ✓ ${courseName} → ${curriculumData.modules.length} modules`);
  }

  return { validCurriculums, invalidCurriculums };
}

/**
 * Get sample template for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query;

  if (format === 'csv') {
    const csvContent = `courseName,keywords,moduleName,moduleContent
React Fundamentals,"hooks,state,props",Introduction to React,Learn the basics of React components and JSX syntax
React Fundamentals,"hooks,state,props",React Hooks Deep Dive,Master useState and useEffect hooks
React Fundamentals,"hooks,state,props",State Management,Learn Redux and Context API
UI/UX Design Basics,"design,ui,ux,figma",Design Principles,Fundamental design concepts and theory
UI/UX Design Basics,"design,ui,ux,figma",Figma Basics,Learn Figma interface and essential tools
UI/UX Design Basics,"design,ui,ux,figma",Prototyping,Create interactive prototypes
Digital Marketing,"marketing,seo,social",SEO Fundamentals,Learn search engine optimization basics
Digital Marketing,"marketing,seo,social",Social Media Strategy,Develop effective social media campaigns`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="curriculum_template.csv"');
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
      title: 'Curriculum Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your curriculum data',
        '3. Use MULTIPLE ROWS for courses with multiple modules',
        '4. Make sure all course names exist in your database',
        '5. Upload the file via API',
        '6. Check the response for results'
      ],
      requiredFields: {
        courseName: 'Course name - must match existing course (REQUIRED)',
        moduleName: 'Module name (REQUIRED for each module)'
      },
      optionalFields: [
        'keywords (comma-separated)',
        'moduleContent (description of the module)'
      ],
      csvStructure: {
        explanation: 'Each row represents ONE MODULE. Multiple rows with the same courseName will be grouped together.',
        example: [
          'courseName: "React Fundamentals", keywords: "hooks,state", moduleName: "Intro", moduleContent: "..."',
          'courseName: "React Fundamentals", keywords: "hooks,state", moduleName: "Hooks", moduleContent: "..."',
          'courseName: "React Fundamentals", keywords: "hooks,state", moduleName: "State", moduleContent: "..."'
        ],
        result: 'These 3 rows create 1 curriculum with 3 modules'
      },
      importantNotes: [
        'Course names must match EXACTLY with existing courses (case-insensitive)',
        'If a course doesn\'t exist, that curriculum will be skipped',
        'Each course can only have ONE curriculum (duplicates will be skipped)',
        'Keywords should be comma-separated (e.g., "react,hooks,javascript")',
        'Multiple rows with same courseName = multiple modules in one curriculum',
        'At least one module with a name is required',
        'File is automatically deleted after processing'
      ]
    }
  });
};

