#!/usr/bin/env node
/**
 * Production Cleanup Script
 * Run this on Render after deploying the fix
 * 
 * Usage: node scripts/production-cleanup.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
};

const cleanup = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(70)}${colors.reset}`);
    console.log(`${colors.cyan}🚀 PRODUCTION CLEANUP - APPLICATION NUMBER FIX${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

    try {
        // Connect
        console.log(`${colors.yellow}📡 Connecting to database...${colors.reset}`);
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Get collection
        const collection = mongoose.connection.collection("classapplications");

        // Step 1: Check current state
        console.log(`${colors.yellow}Step 1: Checking current state...${colors.reset}`);
        const allDrafts = await collection.find({ status: "draft" }).toArray();
        const corruptedDrafts = allDrafts.filter(d => d.applicationNumber != null);
        
        console.log(`  Total drafts: ${allDrafts.length}`);
        console.log(`  Corrupted drafts: ${corruptedDrafts.length}\n`);

        if (corruptedDrafts.length > 0) {
            console.log(`${colors.yellow}Corrupted drafts found:${colors.reset}`);
            corruptedDrafts.forEach((draft, index) => {
                console.log(`  ${index + 1}. ID: ${draft._id}, AppNum: ${draft.applicationNumber}`);
            });
            console.log();
        }

        // Step 2: Fix corrupted drafts
        if (corruptedDrafts.length > 0) {
            console.log(`${colors.yellow}Step 2: Fixing corrupted drafts...${colors.reset}`);
            const result = await collection.updateMany(
                { 
                    status: "draft",
                    applicationNumber: { $ne: null }
                },
                { $set: { applicationNumber: null } }
            );
            console.log(`${colors.green}✅ Fixed ${result.modifiedCount} draft(s)${colors.reset}\n`);
        } else {
            console.log(`${colors.green}Step 2: No corrupted drafts to fix ✅${colors.reset}\n`);
        }

        // Step 3: Verify fix
        console.log(`${colors.yellow}Step 3: Verifying fix...${colors.reset}`);
        const remaining = await collection.find({
            status: "draft",
            applicationNumber: { $ne: null }
        }).toArray();

        if (remaining.length === 0) {
            console.log(`${colors.green}✅ All drafts are now clean!${colors.reset}\n`);
        } else {
            console.log(`${colors.red}❌ Still have ${remaining.length} corrupted draft(s)${colors.reset}\n`);
            process.exit(1);
        }

        // Step 4: Check for duplicates
        console.log(`${colors.yellow}Step 4: Checking for duplicate application numbers...${colors.reset}`);
        const duplicates = await collection.aggregate([
            {
                $match: { applicationNumber: { $ne: null, $exists: true } }
            },
            {
                $group: {
                    _id: "$applicationNumber",
                    count: { $sum: 1 },
                    ids: { $push: "$_id" }
                }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]).toArray();

        if (duplicates.length === 0) {
            console.log(`${colors.green}✅ No duplicate application numbers found${colors.reset}\n`);
        } else {
            console.log(`${colors.red}⚠️  Found ${duplicates.length} duplicate(s)${colors.reset}\n`);
            duplicates.forEach((dup, index) => {
                console.log(`  ${index + 1}. ${dup._id}: ${dup.count} times`);
            });
            console.log();
        }

        // Step 5: Final statistics
        console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}`);
        console.log(`${colors.blue}📊 FINAL STATISTICS${colors.reset}`);
        console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

        const stats = await collection.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    withAppNumber: {
                        $sum: {
                            $cond: [{ $ne: ["$applicationNumber", null] }, 1, 0]
                        }
                    },
                    withoutAppNumber: {
                        $sum: {
                            $cond: [{ $eq: ["$applicationNumber", null] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        stats.forEach(stat => {
            console.log(`  ${stat._id.toUpperCase()}:`);
            console.log(`    Total: ${stat.count}`);
            console.log(`    With App Number: ${stat.withAppNumber}`);
            console.log(`    Without App Number: ${stat.withoutAppNumber}`);
            
            // Validate
            if (stat._id === "draft" && stat.withAppNumber > 0) {
                console.log(`    ${colors.red}❌ INVALID: Drafts should not have applicationNumber${colors.reset}`);
            } else if (stat._id === "draft" && stat.withAppNumber === 0) {
                console.log(`    ${colors.green}✅ VALID: All drafts have NULL applicationNumber${colors.reset}`);
            } else if (stat._id === "submitted" && stat.withAppNumber === stat.count) {
                console.log(`    ${colors.green}✅ VALID: All submitted have applicationNumber${colors.reset}`);
            }
            console.log();
        });

        console.log(`${colors.green}${"=".repeat(70)}${colors.reset}`);
        console.log(`${colors.green}✅ CLEANUP COMPLETE - PRODUCTION READY${colors.reset}`);
        console.log(`${colors.green}${"=".repeat(70)}${colors.reset}\n`);

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

// Run cleanup
console.log(`${colors.blue}🔧 Starting Production Cleanup...${colors.reset}`);
console.log(`${colors.yellow}Environment: ${process.env.NODE_ENV || 'development'}${colors.reset}`);
console.log(`${colors.yellow}Database: ${config.mongodb.uri.replace(/\/\/.*:.*@/, '//***:***@')}${colors.reset}\n`);

cleanup();

