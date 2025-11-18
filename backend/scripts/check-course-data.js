/**
 * Check what data is in the course
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../src/models/course.model");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    const course = await Course.findById("6916cc33ec0d797bcaef685f").lean();
    
    console.log("\n━━━ Full Course Document ━━━\n");
    console.log(JSON.stringify(course, null, 2));
    
    await mongoose.disconnect();
})();


