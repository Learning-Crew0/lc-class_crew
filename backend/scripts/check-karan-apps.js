require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    const karanId = "69129e85ee7874b97e63119b";
    const ishantId = "691aebe8962da064edc9cb18";
    
    console.log("\n=== Karan's Applications ===");
    const karanApps = await ClassApplication.find({ user: karanId })
        .select("_id status applicationNumber createdAt")
        .lean();
    console.log(JSON.stringify(karanApps, null, 2));
    
    console.log("\n=== Ishant's Applications ===");
    const ishantApps = await ClassApplication.find({ user: ishantId })
        .select("_id status applicationNumber createdAt")
        .lean();
    console.log(JSON.stringify(ishantApps, null, 2));
    
    console.log("\n=== All Applications with applicationNumber ===");
    const allWithNum = await ClassApplication.find({
        applicationNumber: { $ne: null, $exists: true }
    }).select("_id user status applicationNumber").lean();
    console.log(JSON.stringify(allWithNum, null, 2));
    
    await mongoose.disconnect();
})();


