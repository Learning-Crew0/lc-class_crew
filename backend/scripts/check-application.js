require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");

const checkApp = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const appId = "691156f1dabb5afb20c2a415";
        console.log(`Looking for application: ${appId}\n`);
        
        const app = await ClassApplication.findById(appId);
        
        if (app) {
            console.log("✅ FOUND:");
            console.log(JSON.stringify(app, null, 2));
        } else {
            console.log("❌ NOT FOUND");
            
            console.log("\nAll applications:");
            const all = await ClassApplication.find().limit(3);
            all.forEach(a => {
                console.log(`  - ${a._id} (user: ${a.user}, status: ${a.status})`);
            });
        }
        
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

checkApp();

