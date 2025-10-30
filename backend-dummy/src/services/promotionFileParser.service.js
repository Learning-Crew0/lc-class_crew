const { parseFile } = require('./fileParser.service');

/**
 * Parses a promotion data file (CSV or XLSX) and returns an array of JSON objects.
 * This service wraps the generic file parser for promotion-specific use.
 * @param {string} filePath - The path to the promotion data file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of parsed promotion data.
 */
async function parsePromotionFile(filePath) {
  console.log('📄 PromotionFileParser: Parsing file:', filePath);
  
  try {
    // Pass rawData=true to get raw row data (not category-mapped data)
    const rows = await parseFile(filePath, true);
    
    console.log(`📊 PromotionFileParser: Parsed ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('📋 PromotionFileParser: First row sample:', rows[0]);
      console.log('📋 PromotionFileParser: Column names:', Object.keys(rows[0]));
    } else {
      console.log('⚠️  PromotionFileParser: No rows found in file');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ PromotionFileParser: Error parsing file:', error);
    throw error;
  }
}

module.exports = {
  parsePromotionFile,
};

