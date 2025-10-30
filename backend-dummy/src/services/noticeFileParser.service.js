const { parseFile } = require('./fileParser.service');

/**
 * Parses a notice data file (CSV or XLSX) and returns an array of JSON objects.
 * This service wraps the generic file parser for notice-specific use.
 * @param {string} filePath - The path to the notice data file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of parsed notice data.
 */
async function parseNoticeFile(filePath) {
  console.log('📄 NoticeFileParser: Parsing file:', filePath);
  
  try {
    // Pass rawData=true to get raw row data (not category-mapped data)
    const rows = await parseFile(filePath, true);
    
    console.log(`📊 NoticeFileParser: Parsed ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('📋 NoticeFileParser: First row sample:', rows[0]);
      console.log('📋 NoticeFileParser: Column names:', Object.keys(rows[0]));
    } else {
      console.log('⚠️  NoticeFileParser: No rows found in file');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ NoticeFileParser: Error parsing file:', error);
    throw error;
  }
}

module.exports = {
  parseNoticeFile,
};

