const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');

/**
 * Parse CSV or XLSX file and extract data (GENERIC - returns raw row data)
 * @param {string} filePath - Path to the uploaded file
 * @param {boolean} rawData - If true, returns raw data without mapping (default: true)
 * @returns {Promise<Array>} Array of row objects
 */
async function parseFile(filePath, rawData = true) {
  const fileExtension = path.extname(filePath).toLowerCase();
  
  if (fileExtension === '.csv') {
    return parseCSV(filePath, rawData);
  } else if (fileExtension === '.xlsx') {
    return parseXLSX(filePath, rawData);
  } else {
    throw new Error('Unsupported file format');
  }
}

/**
 * Parse CSV file
 * @param {string} filePath - Path to CSV file
 * @param {boolean} rawData - If true, returns raw data without mapping
 * @returns {Promise<Array>} Array of row objects
 */
function parseCSV(filePath, rawData = true) {
  return new Promise((resolve, reject) => {
    const rows = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (rawData) {
          // Return raw row data (for curriculum, instructors, etc.)
          rows.push(row);
        } else {
          // Map to category schema (backward compatibility)
          const category = mapToCategory(row);
          if (category) {
            rows.push(category);
          }
        }
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Parse XLSX file
 * @param {string} filePath - Path to XLSX file
 * @param {boolean} rawData - If true, returns raw data without mapping
 * @returns {Promise<Array>} Array of row objects
 */
async function parseXLSX(filePath, rawData = true) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.worksheets[0]; // Get first sheet
  const rows = [];
  
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
    
    if (rawData) {
      // Return raw row data (for curriculum, instructors, etc.)
      // Only include rows that have at least one non-empty value
      const hasData = Object.values(rowData).some(val => val !== null && val !== undefined && String(val).trim() !== '');
      if (hasData) {
        rows.push(rowData);
      }
    } else {
      // Map to category schema (backward compatibility)
      const category = mapToCategory(rowData);
      if (category) {
        rows.push(category);
      }
    }
  });
  
  return rows;
}

/**
 * Map row data to category schema
 * Expected columns: title, description, isActive
 * @param {Object} row - Row data from CSV/XLSX
 * @returns {Object|null} Category object or null if invalid
 */
function mapToCategory(row) {
  // Handle different possible column names
  const title = row.title || row.Title || row.name || row.Name || row.TITLE || row.NAME;
  const description = row.description || row.Description || row.desc || row.Desc || row.DESCRIPTION;
  const isActive = row.isActive || row.IsActive || row.is_active || row.active || row.Active || row.ISACTIVE;
  
  // Title is required
  if (!title || String(title).trim() === '') {
    return null;
  }
  
  // Parse isActive (handle various formats)
  let parsedIsActive = true; // default
  if (isActive !== undefined && isActive !== null) {
    const activeStr = String(isActive).toLowerCase().trim();
    if (activeStr === 'false' || activeStr === '0' || activeStr === 'no' || activeStr === 'inactive') {
      parsedIsActive = false;
    }
  }
  
  return {
    title: String(title).trim(),
    description: description ? String(description).trim() : '',
    isActive: parsedIsActive
  };
}

/**
 * Validate parsed categories
 * @param {Array} categories - Array of category objects
 * @returns {Object} Validation results
 */
function validateCategories(categories) {
  const errors = [];
  const validCategories = [];
  const duplicates = new Set();
  const titlesSeen = new Set();
  
  categories.forEach((category, index) => {
    const rowNumber = index + 2; // +2 because index starts at 0 and first row is header
    
    // Check for required title
    if (!category.title || category.title === '') {
      errors.push({
        row: rowNumber,
        field: 'title',
        message: 'Title is required',
        severity: 'error'
      });
      return;
    }
    
    // Check for duplicate titles in the file
    const titleLower = category.title.toLowerCase();
    if (titlesSeen.has(titleLower)) {
      duplicates.add(category.title);
      errors.push({
        row: rowNumber,
        field: 'title',
        message: `Duplicate title: "${category.title}"`,
        severity: 'warning'
      });
    }
    titlesSeen.add(titleLower);
    
    validCategories.push(category);
  });
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errorCount: errors.filter(e => e.severity === 'error').length,
    warningCount: errors.filter(e => e.severity === 'warning').length,
    errors,
    validCategories,
    duplicates: Array.from(duplicates)
  };
}

module.exports = {
  parseFile,
  validateCategories
};


