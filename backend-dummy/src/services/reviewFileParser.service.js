const { parseFile } = require('./fileParser.service');

/**
 * Parses a review data file (CSV or XLSX) and returns an array of JSON objects.
 * This service wraps the generic file parser for review-specific use.
 * @param {string} filePath - The path to the review data file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of parsed review data.
 */
async function parseReviewFile(filePath) {
  console.log('📄 ReviewFileParser: Parsing file:', filePath);
  
  try {
    // Pass rawData=true to get raw row data (not category-mapped data)
    const rows = await parseFile(filePath, true);
    
    console.log(`📊 ReviewFileParser: Parsed ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('📋 ReviewFileParser: First row sample:', rows[0]);
      console.log('📋 ReviewFileParser: Column names:', Object.keys(rows[0]));
    } else {
      console.log('⚠️  ReviewFileParser: No rows found in file');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ ReviewFileParser: Error parsing file:', error);
    throw error;
  }
}

module.exports = {
  parseReviewFile,
};

