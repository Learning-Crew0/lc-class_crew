const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');

/**
 * Parse CSV or XLSX file and extract course data
 * @param {string} filePath - Path to the uploaded file
 * @returns {Promise<Array>} Array of course objects
 */
async function parseFile(filePath) {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  if (fileExtension === '.csv') {
    return parseCSV(filePath);
  } else if (fileExtension === '.xlsx') {
    return parseXLSX(filePath);
  } else {
    throw new Error('Unsupported file format');
  }
}

/**
 * Parse CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of course objects
 */
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const courses = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const course = mapToCourse(row);
        if (course) {
          courses.push(course);
        }
      })
      .on('end', () => {
        resolve(courses);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Parse XLSX file
 * @param {string} filePath - Path to XLSX file
 * @returns {Promise<Array>} Array of course objects
 */
async function parseXLSX(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.worksheets[0]; // Get first sheet
  const courses = [];
  
  // Get headers from first row
  const headers = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = cell.value ? String(cell.value).toLowerCase().trim() : '';
  });
  
  // Parse data rows (starting from row 2)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber];
      if (header) {
        rowData[header] = cell.value;
      }
    });
    
    const course = mapToCourse(rowData);
    if (course) {
      courses.push(course);
    }
  });
  
  return courses;
}

/**
 * Map row data to course object based on Course model schema
 * @param {Object} row - Row data from CSV/XLSX
 * @returns {Object|null} Course object or null if invalid
 */
function mapToCourse(row) {
  // Helper function to get value with multiple possible column names
  const getValue = (...names) => {
    for (const name of names) {
      const lowerName = name.toLowerCase();
      const value = row[lowerName] || row[name] || row[name.toUpperCase()];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim();
      }
    }
    return null;
  };

  // Helper to parse arrays (comma-separated)
  const parseArray = (value) => {
    if (!value) return [];
    return String(value).split(',').map(item => item.trim()).filter(item => item !== '');
  };

  // Helper to parse numbers
  const parseNumber = (value) => {
    if (!value) return null;
    const num = parseFloat(String(value).replace(/[,₩$€£]/g, ''));
    return isNaN(num) ? null : num;
  };

  // Helper to parse booleans
  const parseBoolean = (value) => {
    if (value === undefined || value === null) return true;
    const str = String(value).toLowerCase().trim();
    return str === 'true' || str === '1' || str === 'yes' || str === 'active';
  };

  // Extract required fields
  const title = getValue('title', 'name', 'courseName', 'course_name');
  const categoryName = getValue('category', 'categoryName', 'category_name', 'categoryTitle');

  // Title and category are required
  if (!title || !categoryName) {
    return null;
  }

  // Build course object matching Course model schema
  return {
    // Required fields
    title,
    categoryName, // We'll convert this to category ObjectId later
    
    // Optional fields from Course model
    tagColor: getValue('tagColor', 'tag_color'),
    tagText: getValue('tagText', 'tag_text'),
    tags: parseArray(getValue('tags')),
    processName: getValue('processName', 'process_name'),
    shortDescription: getValue('shortDescription', 'short_description', 'shortDesc'),
    longDescription: getValue('longDescription', 'long_description', 'longDesc', 'description'),
    target: getValue('target', 'targetAudience', 'target_audience'),
    duration: getValue('duration'),
    location: getValue('location'),
    hours: parseNumber(getValue('hours')),
    price: parseNumber(getValue('price')),
    priceText: getValue('priceText', 'price_text'),
    field: getValue('field'),
    date: getValue('date'),
    refundOptions: getValue('refundOptions', 'refund_options', 'refund'),
    learningGoals: getValue('learningGoals', 'learning_goals', 'goals'),
    mainImage: getValue('mainImage', 'main_image', 'image', 'mainImageUrl'),
    noticeImage: getValue('noticeImage', 'notice_image', 'noticeImageUrl'),
    recommendedAudience: parseArray(getValue('recommendedAudience', 'recommended_audience')),
    isActive: parseBoolean(getValue('isActive', 'is_active', 'active')),
    isFeatured: parseBoolean(getValue('isFeatured', 'is_featured', 'featured'))
  };
}

module.exports = {
  parseFile
};


