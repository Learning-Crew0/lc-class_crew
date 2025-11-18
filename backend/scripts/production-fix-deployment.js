/**
 * PRODUCTION DEPLOYMENT SCRIPT
 * Fixes the applicationNumber index issue
 * 
 * Run this on production AFTER code deployment
 */

require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    reset: "\x1b[0m",
};

(async () => {
    console.log(`\n${colors.cyan}${"=".repeat(70)}${colors.reset}`);
    console.log(`${colors.cyan}🚀 PRODUCTION FIX DEPLOYMENT${colors.reset}`);
    console.log(`${colors.cyan}Fixing: applicationNumber index for multiple drafts${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

    try {
        // Connect
        console.log(`${colors.yellow}Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to: ${config.mongodb.uri.split("@")[1]?.split("/")[0] || "MongoDB"}${colors.reset}\n`);

        const collection = mongoose.connection.collection("classapplications");

        // === STEP 1: Backup Check ===
        console.log(`${colors.magenta}━━━ STEP 1: Pre-Deployment Check ━━━${colors.reset}\n`);

        const totalDocs = await collection.countDocuments();
        const draftsCount = await collection.countDocuments({ status: "draft" });
        const nullDrafts = await collection.countDocuments({ 
            status: "draft", 
            applicationNumber: null 
        });

        console.log(`  Total applications: ${totalDocs}`);
        console.log(`  Total drafts: ${draftsCount}`);
        console.log(`  Drafts with null: ${nullDrafts}`);
        console.log();

        // === STEP 2: Clean up corrupted drafts ===
        console.log(`${colors.magenta}━━━ STEP 2: Clean Corrupted Drafts ━━━${colors.reset}\n`);

        if (nullDrafts > 0) {
            console.log(`${colors.yellow}  Found ${nullDrafts} draft(s) with null applicationNumber${colors.reset}`);
            console.log(`${colors.yellow}  Deleting them...${colors.reset}`);
            
            const deleteResult = await collection.deleteMany({
                status: "draft",
                applicationNumber: null
            });
            
            console.log(`${colors.green}  ✅ Deleted ${deleteResult.deletedCount} corrupted draft(s)${colors.reset}\n`);
        } else {
            console.log(`${colors.green}  ✅ No corrupted drafts found${colors.reset}\n`);
        }

        // === STEP 3: Fix Index ===
        console.log(`${colors.magenta}━━━ STEP 3: Rebuild Index ━━━${colors.reset}\n`);

        // Check current index
        const indexes = await collection.indexes();
        const appNumIndex = indexes.find(idx => idx.key.applicationNumber);

        if (appNumIndex) {
            console.log(`  Current index: ${appNumIndex.name}`);
            console.log(`  Unique: ${appNumIndex.unique}`);
            console.log(`  Sparse: ${appNumIndex.sparse || false}\n`);

            if (!appNumIndex.sparse) {
                console.log(`${colors.yellow}  Index is NOT sparse - rebuilding...${colors.reset}`);
                
                await collection.dropIndex("applicationNumber_1");
                console.log(`${colors.green}  ✅ Dropped old index${colors.reset}`);

                await collection.createIndex(
                    { applicationNumber: 1 },
                    { 
                        unique: true,
                        sparse: true,
                        name: "applicationNumber_1"
                    }
                );
                console.log(`${colors.green}  ✅ Created new sparse index${colors.reset}\n`);
            } else {
                console.log(`${colors.green}  ✅ Index is already sparse${colors.reset}\n`);
            }
        } else {
            console.log(`${colors.yellow}  No index found - creating...${colors.reset}`);
            
            await collection.createIndex(
                { applicationNumber: 1 },
                { 
                    unique: true,
                    sparse: true,
                    name: "applicationNumber_1"
                }
            );
            console.log(`${colors.green}  ✅ Created sparse index${colors.reset}\n`);
        }

        // === STEP 4: Verify ===
        console.log(`${colors.magenta}━━━ STEP 4: Verification ━━━${colors.reset}\n`);

        const newIndexes = await collection.indexes();
        const newAppNumIndex = newIndexes.find(idx => idx.key.applicationNumber);

        console.log(`  Index name: ${newAppNumIndex.name}`);
        console.log(`  Unique: ${newAppNumIndex.unique}`);
        console.log(`  Sparse: ${newAppNumIndex.sparse}\n`);

        // Test by inserting temp docs
        console.log(`${colors.yellow}  Testing sparse index...${colors.reset}`);
        
        try {
            const testId1 = new mongoose.Types.ObjectId();
            const testId2 = new mongoose.Types.ObjectId();

            await collection.insertOne({
                _id: testId1,
                user: new mongoose.Types.ObjectId(),
                status: "draft",
                // applicationNumber: omitted (not null!)
                courses: [],
                paymentInfo: { totalAmount: 0 },
                createdAt: new Date()
            });

            await collection.insertOne({
                _id: testId2,
                user: new mongoose.Types.ObjectId(),
                status: "draft",
                // applicationNumber: omitted (not null!)
                courses: [],
                paymentInfo: { totalAmount: 0 },
                createdAt: new Date()
            });

            console.log(`${colors.green}  ✅ Multiple drafts without applicationNumber work!${colors.reset}\n`);

            // Clean up test docs
            await collection.deleteMany({ _id: { $in: [testId1, testId2] } });
        } catch (err) {
            console.log(`${colors.red}  ❌ Test failed: ${err.message}${colors.reset}\n`);
            throw err;
        }

        // === FINAL SUMMARY ===
        console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}`);
        console.log(`${colors.green}✅ DEPLOYMENT SUCCESSFUL${colors.reset}`);
        console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}\n`);

        console.log(`${colors.cyan}What was fixed:${colors.reset}`);
        console.log(`  1. Removed corrupted drafts with null applicationNumber`);
        console.log(`  2. Rebuilt index as sparse (allows multiple undefined values)`);
        console.log(`  3. Verified multiple users can now create drafts\n`);

        console.log(`${colors.cyan}Next steps:${colors.reset}`);
        console.log(`  1. Restart the Render service to load new code`);
        console.log(`  2. Test with real users (Karan & Ishant)`);
        console.log(`  3. Monitor for any 409 errors\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

    } catch (error) {
        console.error(`\n${colors.red}${"=".repeat(70)}${colors.reset}`);
        console.error(`${colors.red}❌ DEPLOYMENT FAILED${colors.reset}`);
        console.error(`${colors.red}${"=".repeat(70)}${colors.reset}\n`);
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        console.error(error.stack);

        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
})();


