const { parseFile } = require('./fileParser.service');

/**
 * Parses a training schedule data file (CSV or XLSX) and returns an array of JSON objects.
 * This service wraps the generic file parser for training schedule-specific use.
 * @param {string} filePath - The path to the training schedule data file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of parsed training schedule data.
 */
async function parseTrainingScheduleFile(filePath) {
  console.log('📄 TrainingScheduleFileParser: Parsing file:', filePath);
  
  try {
    // Pass rawData=true to get raw row data (not category-mapped data)
    const rows = await parseFile(filePath, true);
    
    console.log(`📊 TrainingScheduleFileParser: Parsed ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('📋 TrainingScheduleFileParser: First row sample:', rows[0]);
      console.log('📋 TrainingScheduleFileParser: Column names:', Object.keys(rows[0]));
    } else {
      console.log('⚠️  TrainingScheduleFileParser: No rows found in file');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ TrainingScheduleFileParser: Error parsing file:', error);
    throw error;
  }
}

module.exports = {
  parseTrainingScheduleFile,
};

