const fs = require('fs');
const Course = require('./course.model');
const { parseTrainingScheduleFile } = require('../../services/trainingScheduleFileParser.service');

/**
 * Bulk upload training schedules from CSV or XLSX file
 * Complete workflow: Upload → Parse → Group → Validate → Link Courses → Update → Cleanup
 */
exports.bulkUploadTrainingSchedules = async (req, res) => {
  let filePath = null;
  
  try {
    console.log('🔍 Training Schedule Bulk Upload - Request Debug:');
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
    const parsedRows = await parseTrainingScheduleFile(filePath);
    
    if (!parsedRows || parsedRows.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid training schedule data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedRows.length} rows from file`);

    // ========== (c) DATA GROUPING ==========
    // Group rows by courseName to build schedules array
    console.log('🔄 Grouping rows by course...');
    const groupedData = groupRowsByCourse(parsedRows);
    console.log(`📚 Found ${Object.keys(groupedData).length} unique courses`);

    // ========== (d) DATA VALIDATION & LINKING ==========
    console.log('✅ Validating data and linking courses...');
    const { validSchedules, invalidSchedules } = await validateAndLinkCourses(groupedData);

    if (validSchedules.length === 0) {
      // Cleanup and return
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'No valid training schedules to import. All schedules had validation errors.',
        invalidSchedules: invalidSchedules
      });
    }

    console.log(`✓ ${validSchedules.length} valid schedules, ${invalidSchedules.length} invalid`);

    // ========== (e) UPDATE COURSES WITH TRAINING SCHEDULES ==========
    console.log('💾 Updating courses with training schedules...');
    const updatedCourses = [];
    const failedCourses = [];

    for (const scheduleData of validSchedules) {
      try {
        const course = await Course.findById(scheduleData.courseId);
        
        if (!course) {
          failedCourses.push({
            courseName: scheduleData.courseName,
            error: 'Course not found'
          });
          continue;
        }

        // Add new schedules to existing trainingSchedules array
        course.trainingSchedules.push(...scheduleData.schedules);
        await course.save();
        
        updatedCourses.push({
          courseId: course._id,
          courseName: scheduleData.courseName,
          schedulesAdded: scheduleData.schedules.length,
          totalSchedules: course.trainingSchedules.length
        });
        console.log(`  ✓ Updated course: ${scheduleData.courseName} (added ${scheduleData.schedules.length} schedules)`);
      } catch (error) {
        failedCourses.push({
          courseName: scheduleData.courseName,
          error: error.message
        });
        console.error(`  ✗ Failed: ${scheduleData.courseName} - ${error.message}`);
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
      message: 'Training schedules uploaded successfully',
      summary: {
        totalRows: parsedRows.length,
        uniqueCourses: Object.keys(groupedData).length,
        successfullyUpdated: updatedCourses.length,
        failed: failedCourses.length + invalidSchedules.length
      },
      details: {
        updatedCourses: updatedCourses,
        failedCourses: failedCourses,
        invalidSchedules: invalidSchedules
      }
    });

  } catch (error) {
    console.error('❌ Training schedule bulk upload failed:', error);
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
      message: 'Failed to process training schedule bulk upload',
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Group parsed rows by course name
 * @param {Array} rows - Parsed rows from file
 * @returns {Object} - Grouped data by course name
 */
function groupRowsByCourse(rows) {
  const grouped = {};

  for (const row of rows) {
    // Handle case-insensitive column names
    const courseName = 
      row.courseName || row.coursename || row.CourseName || row.COURSENAME ||
      row.course_name || row.Course_Name || row['Course Name'] || '';

    if (!courseName) {
      console.warn('⚠️  Skipping row without courseName:', row);
      continue;
    }

    const courseKey = courseName.toLowerCase().trim();

    if (!grouped[courseKey]) {
      grouped[courseKey] = {
        courseName: courseName.trim(),
        schedules: []
      };
    }

    // Extract schedule data with case-insensitive handling
    const scheduleName = 
      row.scheduleName || row.schedulename || row.ScheduleName || row.SCHEDULENAME ||
      row.schedule_name || row.Schedule_Name || row['Schedule Name'] || '';
    
    const startDate = 
      row.startDate || row.startdate || row.StartDate || row.STARTDATE ||
      row.start_date || row.Start_Date || row['Start Date'] || '';
    
    const endDate = 
      row.endDate || row.enddate || row.EndDate || row.ENDDATE ||
      row.end_date || row.End_Date || row['End Date'] || '';
    
    const status = 
      row.status || row.Status || row.STATUS || 'upcoming';
    
    const availableSeats = 
      row.availableSeats || row.availableseats || row.AvailableSeats || row.AVAILABLESEATS ||
      row.available_seats || row.Available_Seats || row['Available Seats'] || '';
    
    const enrolledCount = 
      row.enrolledCount || row.enrolledcount || row.EnrolledCount || row.ENROLLEDCOUNT ||
      row.enrolled_count || row.Enrolled_Count || row['Enrolled Count'] || 0;
    
    const isActive = 
      row.isActive || row.isactive || row.IsActive || row.ISACTIVE ||
      row.is_active || row.Is_Active || row['Is Active'] || true;

    grouped[courseKey].schedules.push({
      scheduleName: scheduleName.trim(),
      startDate: startDate,
      endDate: endDate,
      status: status,
      availableSeats: availableSeats,
      enrolledCount: enrolledCount,
      isActive: isActive
    });
  }

  return grouped;
}

/**
 * Validate schedules and link to courses in the database
 * @param {Object} groupedData - Grouped schedule data by course
 * @returns {Object} - Valid and invalid schedules
 */
async function validateAndLinkCourses(groupedData) {
  const validSchedules = [];
  const invalidSchedules = [];

  // Fetch all courses once
  const allCourses = await Course.find({}).select('_id title').lean();
  const courseMap = {};
  allCourses.forEach(c => {
    courseMap[c.title.toLowerCase().trim()] = c._id;
  });

  for (const [courseKey, data] of Object.entries(groupedData)) {
    const errors = [];

    // Validate course name
    if (!data.courseName) {
      errors.push('Course name is required');
    }

    // Check if course exists in database
    const courseId = courseMap[courseKey];
    if (!courseId) {
      errors.push(`Course "${data.courseName}" does not exist in database`);
    }

    // Validate schedules
    const validatedSchedules = [];
    for (let i = 0; i < data.schedules.length; i++) {
      const schedule = data.schedules[i];
      const scheduleErrors = [];

      if (!schedule.scheduleName) {
        scheduleErrors.push(`Schedule ${i + 1}: Schedule name is required`);
      }

      // Validate status
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
      if (schedule.status && !validStatuses.includes(schedule.status.toLowerCase())) {
        scheduleErrors.push(`Schedule ${i + 1}: Status must be one of: ${validStatuses.join(', ')}`);
      }

      // Parse dates
      let parsedStartDate = null;
      let parsedEndDate = null;

      if (schedule.startDate) {
        parsedStartDate = new Date(schedule.startDate);
        if (isNaN(parsedStartDate.getTime())) {
          scheduleErrors.push(`Schedule ${i + 1}: Invalid start date format`);
          parsedStartDate = null;
        }
      }

      if (schedule.endDate) {
        parsedEndDate = new Date(schedule.endDate);
        if (isNaN(parsedEndDate.getTime())) {
          scheduleErrors.push(`Schedule ${i + 1}: Invalid end date format`);
          parsedEndDate = null;
        }
      }

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
        scheduleErrors.push(`Schedule ${i + 1}: Start date must be before end date`);
      }

      // Parse numbers
      let parsedAvailableSeats = null;
      if (schedule.availableSeats !== '' && schedule.availableSeats !== null && schedule.availableSeats !== undefined) {
        parsedAvailableSeats = parseInt(schedule.availableSeats);
        if (isNaN(parsedAvailableSeats) || parsedAvailableSeats < 0) {
          scheduleErrors.push(`Schedule ${i + 1}: Available seats must be a non-negative number`);
          parsedAvailableSeats = null;
        }
      }

      let parsedEnrolledCount = 0;
      if (schedule.enrolledCount !== '' && schedule.enrolledCount !== null && schedule.enrolledCount !== undefined) {
        parsedEnrolledCount = parseInt(schedule.enrolledCount);
        if (isNaN(parsedEnrolledCount) || parsedEnrolledCount < 0) {
          scheduleErrors.push(`Schedule ${i + 1}: Enrolled count must be a non-negative number`);
          parsedEnrolledCount = 0;
        }
      }

      // Parse boolean
      let parsedIsActive = true;
      if (typeof schedule.isActive === 'string') {
        parsedIsActive = schedule.isActive.toLowerCase() === 'true' || schedule.isActive === '1';
      } else if (typeof schedule.isActive === 'boolean') {
        parsedIsActive = schedule.isActive;
      }

      if (scheduleErrors.length > 0) {
        errors.push(...scheduleErrors);
      } else {
        validatedSchedules.push({
          scheduleName: schedule.scheduleName,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          status: schedule.status ? schedule.status.toLowerCase() : 'upcoming',
          availableSeats: parsedAvailableSeats,
          enrolledCount: parsedEnrolledCount,
          isActive: parsedIsActive
        });
      }
    }

    if (errors.length > 0 || validatedSchedules.length === 0) {
      invalidSchedules.push({
        courseName: data.courseName,
        errors: errors
      });
    } else {
      validSchedules.push({
        courseId: courseId,
        courseName: data.courseName,
        schedules: validatedSchedules
      });
    }
  }

  return { validSchedules, invalidSchedules };
}

/**
 * Get sample template for bulk upload
 */
exports.getSampleTemplate = (req, res) => {
  const format = req.query.format || 'csv';
  
  const sampleData = [
    {
      courseName: 'DevOps Fundamentals',
      scheduleName: 'Morning Batch - January 2025',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      status: 'upcoming',
      availableSeats: 30,
      enrolledCount: 0,
      isActive: true
    },
    {
      courseName: 'DevOps Fundamentals',
      scheduleName: 'Evening Batch - January 2025',
      startDate: '2025-01-20',
      endDate: '2025-02-20',
      status: 'upcoming',
      availableSeats: 25,
      enrolledCount: 5,
      isActive: true
    },
    {
      courseName: 'Cloud Computing Basics',
      scheduleName: 'Weekend Batch - February 2025',
      startDate: '2025-02-01',
      endDate: '2025-03-01',
      status: 'upcoming',
      availableSeats: 20,
      enrolledCount: 0,
      isActive: true
    }
  ];

  if (format.toLowerCase() === 'json') {
    return res.json({
      success: true,
      template: sampleData
    });
  }

  // CSV format
  const csvHeaders = 'courseName,scheduleName,startDate,endDate,status,availableSeats,enrolledCount,isActive';
  const csvRows = sampleData.map(row => 
    `${row.courseName},${row.scheduleName},${row.startDate},${row.endDate},${row.status},${row.availableSeats},${row.enrolledCount},${row.isActive}`
  );
  const csv = [csvHeaders, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="training_schedule_template.csv"');
  res.send(csv);
};

/**
 * Get upload instructions
 */
exports.getUploadInstructions = (req, res) => {
  res.json({
    success: true,
    instructions: {
      title: 'Training Schedule Bulk Upload Instructions',
      fileFormats: ['CSV', 'XLSX', 'XLS'],
      maxFileSize: '10MB',
      requiredColumns: [
        {
          name: 'courseName',
          type: 'String',
          required: true,
          description: 'Name of the course (must exist in database)'
        },
        {
          name: 'scheduleName',
          type: 'String',
          required: true,
          description: 'Name of the training schedule (e.g., "Morning Batch - January 2025")'
        },
        {
          name: 'startDate',
          type: 'Date',
          required: false,
          format: 'YYYY-MM-DD',
          description: 'Start date of the training'
        },
        {
          name: 'endDate',
          type: 'Date',
          required: false,
          format: 'YYYY-MM-DD',
          description: 'End date of the training'
        },
        {
          name: 'status',
          type: 'String',
          required: false,
          default: 'upcoming',
          options: ['upcoming', 'ongoing', 'completed', 'cancelled'],
          description: 'Status of the training schedule'
        },
        {
          name: 'availableSeats',
          type: 'Number',
          required: false,
          description: 'Number of available seats'
        },
        {
          name: 'enrolledCount',
          type: 'Number',
          required: false,
          default: 0,
          description: 'Number of enrolled students'
        },
        {
          name: 'isActive',
          type: 'Boolean',
          required: false,
          default: true,
          description: 'Whether the schedule is active'
        }
      ],
      notes: [
        'Course must already exist in the database',
        'Multiple schedules can be added to the same course',
        'Dates should be in YYYY-MM-DD format',
        'Status values are case-insensitive',
        'Column names are case-insensitive',
        'New schedules will be added to existing course schedules (not replaced)'
      ],
      example: {
        courseName: 'DevOps Fundamentals',
        scheduleName: 'Morning Batch - January 2025',
        startDate: '2025-01-15',
        endDate: '2025-02-15',
        status: 'upcoming',
        availableSeats: 30,
        enrolledCount: 0,
        isActive: true
      }
    }
  });
};

module.exports = exports;

