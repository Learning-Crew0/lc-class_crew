/**
 * Cleanup Script: Fix Draft Applications with Application Numbers
 * 
 * This script finds all draft applications that incorrectly have an applicationNumber
 * and removes it. The applicationNumber should only exist for submitted applications.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const config = require("../src/config/env");

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
};

const fixDraftApplications = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🔧 FIX DRAFT APPLICATIONS${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        // Connect to database
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Find all draft applications with applicationNumber
        console.log(`${colors.yellow}🔍 Searching for corrupted draft applications...${colors.reset}`);
        
        const corruptedDrafts = await ClassApplication.find({
            status: "draft",
            applicationNumber: { $ne: null, $exists: true }
        }).select("_id user applicationNumber status createdAt");

        console.log(`${colors.blue}Found ${corruptedDrafts.length} corrupted draft(s)${colors.reset}\n`);

        if (corruptedDrafts.length === 0) {
            console.log(`${colors.green}✅ No corrupted drafts found. Database is clean!${colors.reset}\n`);
            await mongoose.disconnect();
            return;
        }

        // Display corrupted drafts
        console.log(`${colors.yellow}Corrupted Drafts:${colors.reset}`);
        corruptedDrafts.forEach((draft, index) => {
            console.log(`  ${index + 1}. ID: ${draft._id}`);
            console.log(`     User: ${draft.user}`);
            console.log(`     Application Number: ${draft.applicationNumber}`);
            console.log(`     Created: ${draft.createdAt}\n`);
        });

        // Fix corrupted drafts
        console.log(`${colors.yellow}🔧 Fixing corrupted drafts...${colors.reset}`);

        const updateResult = await ClassApplication.updateMany(
            {
                status: "draft",
                applicationNumber: { $ne: null, $exists: true }
            },
            {
                $set: { applicationNumber: null }
            }
        );

        console.log(`${colors.green}✅ Fixed ${updateResult.modifiedCount} draft(s)${colors.reset}\n`);

        // Verify fix
        console.log(`${colors.yellow}🔍 Verifying fix...${colors.reset}`);
        
        const remainingCorrupted = await ClassApplication.countDocuments({
            status: "draft",
            applicationNumber: { $ne: null, $exists: true }
        });

        if (remainingCorrupted === 0) {
            console.log(`${colors.green}✅ All drafts fixed successfully!${colors.reset}\n`);
        } else {
            console.log(`${colors.red}⚠️  ${remainingCorrupted} draft(s) still corrupted${colors.reset}\n`);
        }

        // Show statistics
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
        console.log(`${colors.blue}📊 STATISTICS${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

        const stats = await ClassApplication.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    withAppNumber: {
                        $sum: {
                            $cond: [
                                { $ne: ["$applicationNumber", null] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        stats.forEach(stat => {
            console.log(`  ${stat._id.toUpperCase()}:`);
            console.log(`    Total: ${stat.count}`);
            console.log(`    With Application Number: ${stat.withAppNumber}\n`);
        });

        console.log(`${colors.green}✅ Cleanup complete!${colors.reset}\n`);

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
        console.error(error.stack);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

// Run the cleanup
console.log(`${colors.blue}📝 Starting Draft Applications Cleanup${colors.reset}`);
console.log(`${colors.yellow}⚠️  This script will fix corrupted draft applications${colors.reset}\n`);

fixDraftApplications();


