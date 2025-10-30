const { parseFile } = require('./fileParser.service');

/**
 * Parses a curriculum data file (CSV or XLSX) and returns an array of JSON objects.
 * This service wraps the generic file parser for curriculum-specific use.
 * @param {string} filePath - The path to the curriculum data file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of parsed curriculum data.
 */
async function parseCurriculumFile(filePath) {
  console.log('📄 CurriculumFileParser: Parsing file:', filePath);
  
  try {
    // Pass rawData=true to get raw row data (not category-mapped data)
    const rows = await parseFile(filePath, true);
    
    console.log(`📊 CurriculumFileParser: Parsed ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('📋 CurriculumFileParser: First row sample:', rows[0]);
      console.log('📋 CurriculumFileParser: Column names:', Object.keys(rows[0]));
    } else {
      console.log('⚠️  CurriculumFileParser: No rows found in file');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ CurriculumFileParser: Error parsing file:', error);
    throw error;
  }
}

module.exports = {
  parseCurriculumFile,
};

