const { parseFile } = require('./fileParser.service');

/**
 * Parses an instructor data file (CSV or XLSX) and returns an array of JSON objects.
 * This service wraps the generic file parser for instructor-specific use.
 * @param {string} filePath - The path to the instructor data file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of parsed instructor data.
 */
async function parseInstructorFile(filePath) {
  console.log('📄 InstructorFileParser: Parsing file:', filePath);
  
  try {
    // Pass rawData=true to get raw row data (not category-mapped data)
    const rows = await parseFile(filePath, true);
    
    console.log(`📊 InstructorFileParser: Parsed ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('📋 InstructorFileParser: First row sample:', rows[0]);
      console.log('📋 InstructorFileParser: Column names:', Object.keys(rows[0]));
    } else {
      console.log('⚠️  InstructorFileParser: No rows found in file');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ InstructorFileParser: Error parsing file:', error);
    throw error;
  }
}

module.exports = {
  parseInstructorFile,
};



