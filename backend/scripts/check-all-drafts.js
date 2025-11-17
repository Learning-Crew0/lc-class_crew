require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const User = require("../src/models/user.model");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    console.log("\n=== ALL DRAFT APPLICATIONS ===\n");
    
    const drafts = await ClassApplication.find({ status: "draft" })
        .select("_id user applicationNumber createdAt")
        .populate("user", "email fullName")
        .lean();
    
    drafts.forEach((draft, i) => {
        console.log(`Draft ${i + 1}:`);
        console.log(`  ID: ${draft._id}`);
        console.log(`  User: ${draft.user?.email || 'N/A'} (${draft.user?.fullName || 'N/A'})`);
        console.log(`  App Number: ${draft.applicationNumber === null ? 'NULL' : draft.applicationNumber === undefined ? 'UNDEFINED' : draft.applicationNumber}`);
        console.log(`  Created: ${draft.createdAt}\n`);
    });
    
    console.log(`Total drafts: ${drafts.length}\n`);
    
    await mongoose.disconnect();
})();

