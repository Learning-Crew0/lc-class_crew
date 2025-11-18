/**
 * Fix MongoDB Index: Drop old index and recreate with sparse: true
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

(async () => {
    console.log(`\n${colors.cyan}${"=".repeat(70)}${colors.reset}`);
    console.log(`${colors.cyan}🔧 FIX APPLICATION NUMBER INDEX${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

    try {
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

        const collection = mongoose.connection.collection("classapplications");

        // Check current index
        console.log(`${colors.yellow}Step 1: Checking current index...${colors.reset}`);
        const indexes = await collection.indexes();
        const appNumIndex = indexes.find(idx => idx.key.applicationNumber);

        if (!appNumIndex) {
            console.log(`${colors.red}⚠️  No applicationNumber index found${colors.reset}\n`);
            await mongoose.disconnect();
            return;
        }

        console.log(`  Current index: ${appNumIndex.name}`);
        console.log(`  Unique: ${appNumIndex.unique}`);
        console.log(`  Sparse: ${appNumIndex.sparse || false}`);

        if (appNumIndex.sparse) {
            console.log(`${colors.green}\n✅ Index is already sparse. No fix needed!${colors.reset}\n`);
            await mongoose.disconnect();
            return;
        }

        // Drop the old index
        console.log(`\n${colors.yellow}Step 2: Dropping old index...${colors.reset}`);
        await collection.dropIndex("applicationNumber_1");
        console.log(`${colors.green}✅ Old index dropped${colors.reset}\n`);

        // Create new index with sparse: true
        console.log(`${colors.yellow}Step 3: Creating new sparse index...${colors.reset}`);
        await collection.createIndex(
            { applicationNumber: 1 },
            { 
                unique: true, 
                sparse: true,
                background: true,
                name: "applicationNumber_1"
            }
        );
        console.log(`${colors.green}✅ New sparse index created${colors.reset}\n`);

        // Verify
        console.log(`${colors.yellow}Step 4: Verifying new index...${colors.reset}`);
        const newIndexes = await collection.indexes();
        const newAppNumIndex = newIndexes.find(idx => idx.key.applicationNumber);

        console.log(`  Name: ${newAppNumIndex.name}`);
        console.log(`  Unique: ${newAppNumIndex.unique}`);
        console.log(`  Sparse: ${newAppNumIndex.sparse}`);

        if (newAppNumIndex.sparse) {
            console.log(`\n${colors.green}${"▓".repeat(70)}${colors.reset}`);
            console.log(`${colors.green}✅ SUCCESS! Index is now sparse${colors.reset}`);
            console.log(`${colors.green}Multiple users can now have NULL applicationNumbers${colors.reset}`);
            console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}\n`);
        } else {
            console.log(`\n${colors.red}❌ Index creation failed${colors.reset}\n`);
        }

        await mongoose.disconnect();
        console.log(`${colors.green}✅ Disconnected from MongoDB${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
        console.error(error.stack);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
})();


