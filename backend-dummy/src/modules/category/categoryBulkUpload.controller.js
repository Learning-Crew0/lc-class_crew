const fs = require('fs');
const Category = require('./category.model');
const { parseFile, validateCategories } = require('../../services/fileParser.service');

/**
 * Bulk upload categories from CSV or XLSX file
 * Process: Upload → Parse → Validate → Import → Delete file
 */
exports.bulkUploadCategories = async (req, res) => {
  let filePath = null;
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a CSV or XLSX file'
      });
    }

    filePath = req.file.path;
    const fileName = req.file.originalname;

    console.log(`📤 Processing file: ${fileName}`);

    // STEP 1: Parse file
    console.log('📋 Parsing file...');
    const parsedCategories = await parseFile(filePath);
    
    if (!parsedCategories || parsedCategories.length === 0) {
      // Delete file before returning
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(400).json({
        success: false,
        message: 'No valid category data found in file'
      });
    }

    console.log(`📊 Parsed ${parsedCategories.length} categories`);

    // STEP 2: Validate parsed data
    console.log('✅ Validating data...');
    const validation = validateCategories(parsedCategories);

    if (!validation.isValid) {
      // Delete file before returning
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        validation: {
          errorCount: validation.errorCount,
          warningCount: validation.warningCount,
          errors: validation.errors
        }
      });
    }

    // STEP 3: Import to database
    console.log('💾 Importing to database...');
    const importResult = await importCategories(validation.validCategories);

    // STEP 4: Delete uploaded file
    console.log('🗑️  Cleaning up...');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ File deleted successfully');
    }

    // STEP 5: Return success response
    res.status(200).json({
      success: true,
      message: 'Categories uploaded successfully',
      summary: {
        totalProcessed: parsedCategories.length,
        created: importResult.created,
        skipped: importResult.skipped,
        failed: importResult.failed
      },
      details: {
        createdCategories: importResult.createdList,
        skippedCategories: importResult.skippedList,
        errors: importResult.errors
      },
      validation: {
        warningCount: validation.warningCount,
        warnings: validation.errors.filter(e => e.severity === 'warning')
      }
    });

  } catch (error) {
    console.error('❌ Bulk upload failed:', error);

    // Delete file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️  File deleted after error');
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process bulk upload',
      error: error.message
    });
  }
};

/**
 * Import categories to database
 * @param {Array} categories - Validated categories to import
 * @returns {Object} Import results
 */
async function importCategories(categories) {
  const result = {
    created: 0,
    skipped: 0,
    failed: 0,
    createdList: [],
    skippedList: [],
    errors: []
  };

  for (const categoryData of categories) {
    try {
      // Check if category already exists (case-insensitive)
      const existingCategory = await Category.findOne({
        title: { $regex: new RegExp(`^${categoryData.title}$`, 'i') }
      });

      if (existingCategory) {
        result.skipped++;
        result.skippedList.push({
          title: categoryData.title,
          reason: 'Category already exists'
        });
        console.log(`  ⊘ Skipped: ${categoryData.title} (already exists)`);
        continue;
      }

      // Create new category
      const newCategory = await Category.create({
        title: categoryData.title,
        description: categoryData.description || '',
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
      });

      result.created++;
      result.createdList.push({
        id: newCategory._id,
        title: newCategory.title,
        isActive: newCategory.isActive
      });
      console.log(`  ✓ Created: ${newCategory.title}`);

    } catch (error) {
      result.failed++;
      result.errors.push({
        title: categoryData.title,
        error: error.message
      });
      console.error(`  ✗ Failed: ${categoryData.title} - ${error.message}`);
    }
  }

  return result;
}

/**
 * Get sample template data for download
 */
exports.getSampleTemplate = (req, res) => {
  const { format } = req.query; // 'csv' or 'xlsx'

  if (format === 'csv') {
    // Return CSV sample
    const csvContent = `title,description,isActive
Programming,Software development and coding courses,true
Design,UI/UX and graphic design courses,true
Marketing,Digital marketing and branding courses,true
Business,Business management and entrepreneurship,true
Data Science,Data analysis and machine learning courses,true`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="category_template.csv"');
    res.send(csvContent);
  } else if (format === 'xlsx') {
    // For XLSX, we'd use ExcelJS to generate it
    // For now, return a message
    res.json({
      success: true,
      message: 'XLSX template generation coming soon',
      tip: 'Use CSV format for now'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid format. Use ?format=csv or ?format=xlsx'
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
      title: 'Category Bulk Upload Instructions',
      steps: [
        '1. Download the sample template',
        '2. Fill in your category data',
        '3. Upload the file via API',
        '4. Check the response for results'
      ],
      fileFormat: {
        supportedFormats: ['CSV', 'XLSX'],
        maxFileSize: '5MB',
        requiredColumns: [
          { name: 'title', required: true, description: 'Category name' },
          { name: 'description', required: false, description: 'Category description' },
          { name: 'isActive', required: false, description: 'true or false (default: true)' }
        ]
      },
      examples: [
        {
          title: 'Programming',
          description: 'Software development courses',
          isActive: 'true'
        },
        {
          title: 'Design',
          description: 'UI/UX courses',
          isActive: 'true'
        }
      ],
      tips: [
        'Title column is required',
        'Duplicate titles will be skipped',
        'File is automatically deleted after processing',
        'isActive defaults to true if not specified'
      ]
    }
  });
};

