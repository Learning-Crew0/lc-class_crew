/**
 * Debug Script: Check Application Number Issues
 */

require("dotenv").config();
const mongoose = require("mongoose");
const ClassApplication = require("../src/models/classApplication.model");
const User = require("../src/models/user.model");
const config = require("../src/config/env");

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
};

const checkIssues = async () => {
    console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}🔍 CHECK APPLICATION NUMBER ISSUES${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

    try {
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        // Check 1: All applications
        console.log(`${colors.yellow}📊 All Applications:${colors.reset}`);
        const allApps = await ClassApplication.find({})
            .select("_id user status applicationNumber createdAt")
            .populate("user", "email fullName")
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Total: ${allApps.length}\n`);
        
        allApps.forEach((app, index) => {
            console.log(`${index + 1}. ${app._id}`);
            console.log(`   User: ${app.user?.email || app.user} (${app.user?.fullName || 'N/A'})`);
            console.log(`   Status: ${app.status}`);
            console.log(`   App Number: ${app.applicationNumber || 'NULL'}`);
            console.log(`   Created: ${app.createdAt}\n`);
        });

        // Check 2: Duplicate application numbers
        console.log(`${colors.yellow}🔍 Checking for duplicate application numbers...${colors.reset}`);
        const duplicates = await ClassApplication.aggregate([
            {
                $match: {
                    applicationNumber: { $ne: null, $exists: true }
                }
            },
            {
                $group: {
                    _id: "$applicationNumber",
                    count: { $sum: 1 },
                    ids: { $push: "$_id" },
                    users: { $push: "$user" }
                }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]);

        if (duplicates.length > 0) {
            console.log(`${colors.red}⚠️  Found ${duplicates.length} duplicate application number(s):${colors.reset}\n`);
            duplicates.forEach((dup, index) => {
                console.log(`${index + 1}. Application Number: ${dup._id}`);
                console.log(`   Count: ${dup.count}`);
                console.log(`   IDs: ${dup.ids.join(', ')}`);
                console.log(`   Users: ${dup.users.join(', ')}\n`);
            });
        } else {
            console.log(`${colors.green}✅ No duplicate application numbers found${colors.reset}\n`);
        }

        // Check 3: Applications by status
        console.log(`${colors.yellow}📊 Applications by Status:${colors.reset}`);
        const byStatus = await ClassApplication.aggregate([
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
        ]);

        byStatus.forEach(stat => {
            console.log(`  ${stat._id}:`);
            console.log(`    Total: ${stat.count}`);
            console.log(`    With App Number: ${stat.withAppNumber}`);
            console.log(`    Without App Number: ${stat.withoutAppNumber}\n`);
        });

        // Check 4: Applications for specific users
        const userIds = [
            "69129e85ee7874b97e63119b", // Karan
            "691aebe8962da064edc9cb18"  // Ishant
        ];

        console.log(`${colors.yellow}📊 Applications for specific users:${colors.reset}`);
        for (const userId of userIds) {
            const userApps = await ClassApplication.find({ user: userId })
                .select("_id status applicationNumber createdAt")
                .populate("user", "email fullName")
                .sort({ createdAt: -1 })
                .lean();

            if (userApps.length > 0) {
                console.log(`\n  User: ${userApps[0].user?.email} (${userApps[0].user?.fullName})`);
                console.log(`  Total Applications: ${userApps.length}`);
                userApps.forEach((app, index) => {
                    console.log(`    ${index + 1}. Status: ${app.status}, App#: ${app.applicationNumber || 'NULL'}, Created: ${app.createdAt}`);
                });
            }
        }

        console.log(`\n${colors.green}✅ Check complete!${colors.reset}\n`);

        await mongoose.disconnect();

    } catch (error) {
        console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

checkIssues();

