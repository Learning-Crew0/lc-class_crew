require("dotenv").config();
const mongoose = require("mongoose");
const TrainingSchedule = require("../src/models/trainingSchedule.model");

const verifySchedule = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB\n");
        
        const scheduleId = "691152b72f7eb75e6e6ef753";
        
        console.log(`Looking for schedule: ${scheduleId}`);
        const schedule = await TrainingSchedule.findById(scheduleId);
        
        if (schedule) {
            console.log("\n✅ SCHEDULE FOUND:");
            console.log(JSON.stringify(schedule, null, 2));
        } else {
            console.log("\n❌ SCHEDULE NOT FOUND");
            
            console.log("\nAll schedules in database:");
            const allSchedules = await TrainingSchedule.find().limit(5);
            console.log(JSON.stringify(allSchedules, null, 2));
        }
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

verifySchedule();

