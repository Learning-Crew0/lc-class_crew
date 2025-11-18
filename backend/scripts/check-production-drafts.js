/**
 * Check existing drafts in production database
 */

require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const User = require("../src/models/user.model");
const config = require("../src/config/env");

(async () => {
    console.log("\n🔍 Checking Production Drafts...\n");
    
    await mongoose.connect(config.mongodb.uri);
    console.log("✅ Connected to:", config.mongodb.uri.split("@")[1]?.split("/")[0] || "MongoDB");
    console.log();

    // Find all draft applications
    const drafts = await ClassApplication.find({ status: "draft" })
        .populate("user", "email fullName")
        .select("_id user courses status createdAt")
        .lean();

    if (drafts.length === 0) {
        console.log("❌ No draft applications found in production\n");
        console.log("💡 Create a new draft by:");
        console.log("   1. Login to the frontend");
        console.log("   2. Add a course to cart");
        console.log("   3. Go to checkout");
        console.log("   4. Check browser console for draft application ID\n");
    } else {
        console.log(`Found ${drafts.length} draft application(s):\n`);
        
        drafts.forEach((draft, i) => {
            console.log(`Draft ${i + 1}:`);
            console.log(`  ID: ${draft._id}`);
            console.log(`  User: ${draft.user?.email || 'Unknown'} (${draft.user?.fullName || 'N/A'})`);
            console.log(`  Courses: ${draft.courses.length}`);
            console.log(`  Created: ${draft.createdAt}`);
            console.log();
        });

        console.log("✅ Use one of these IDs for testing\n");
    }

    // Check for Ishant and Karan specifically
    console.log("━━━ Checking Ishant & Karan ━━━\n");
    
    const ishantUser = await User.findOne({ email: "ishant@gmail.com" }).select("_id");
    const karanUser = await User.findOne({ email: "karan@gmail.com" }).select("_id");

    if (ishantUser) {
        const ishantDrafts = await ClassApplication.find({ 
            user: ishantUser._id, 
            status: "draft" 
        }).select("_id");
        console.log(`Ishant's drafts: ${ishantDrafts.length}`);
        ishantDrafts.forEach(d => console.log(`  - ${d._id}`));
    } else {
        console.log("❌ Ishant not found in production");
    }

    if (karanUser) {
        const karanDrafts = await ClassApplication.find({ 
            user: karanUser._id, 
            status: "draft" 
        }).select("_id");
        console.log(`Karan's drafts: ${karanDrafts.length}`);
        karanDrafts.forEach(d => console.log(`  - ${d._id}`));
    } else {
        console.log("❌ Karan not found in production");
    }

    console.log();
    await mongoose.disconnect();
})();


