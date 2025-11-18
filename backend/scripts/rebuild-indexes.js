require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

const colors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
};

(async () => {
    console.log(`\n${colors.cyan}${"=".repeat(70)}${colors.reset}`);
    console.log(`${colors.cyan}🔧 REBUILD ALL INDEXES${colors.reset}`);
    console.log(`${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

    try {
        await mongoose.connect(config.mongodb.uri);
        console.log(`${colors.green}✅ Connected${colors.reset}\n`);

        const collection = mongoose.connection.collection("classapplications");

        // Step 1: Drop ALL indexes except _id
        console.log(`${colors.yellow}Step 1: Dropping all indexes...${colors.reset}`);
        await collection.dropIndexes();
        console.log(`${colors.green}✅ All indexes dropped${colors.reset}\n`);

        // Step 2: Recreate essential indexes
        console.log(`${colors.yellow}Step 2: Creating new indexes...${colors.reset}`);

        // applicationNumber - SPARSE and UNIQUE
        await collection.createIndex(
            { applicationNumber: 1 },
            { 
                unique: true,
                sparse: true,
                name: "applicationNumber_1"
            }
        );
        console.log(`${colors.green}✅ applicationNumber index (sparse + unique)${colors.reset}`);

        // user index
        await collection.createIndex({ user: 1 }, { name: "user_1" });
        console.log(`${colors.green}✅ user index${colors.reset}`);

        // status index
        await collection.createIndex({ status: 1 }, { name: "status_1" });
        console.log(`${colors.green}✅ status index${colors.reset}`);

        // createdAt index (descending)
        await collection.createIndex({ createdAt: -1 }, { name: "createdAt_-1" });
        console.log(`${colors.green}✅ createdAt index${colors.reset}\n`);

        // Step 3: Verify
        console.log(`${colors.yellow}Step 3: Verifying indexes...${colors.reset}`);
        const indexes = await collection.indexes();
        const appNumIndex = indexes.find(idx => idx.key.applicationNumber);

        console.log(`  Name: ${appNumIndex.name}`);
        console.log(`  Unique: ${appNumIndex.unique}`);
        console.log(`  Sparse: ${appNumIndex.sparse}\n`);

        // Step 4: Test with direct inserts
        console.log(`${colors.yellow}Step 4: Testing sparse index...${colors.reset}`);
        
        try {
            await collection.insertOne({
                user: new mongoose.Types.ObjectId(),
                status: "draft",
                applicationNumber: null,
                courses: [],
                paymentInfo: { totalAmount: 0 },
                createdAt: new Date()
            });
            console.log(`${colors.green}✅ First NULL insert succeeded${colors.reset}`);

            await collection.insertOne({
                user: new mongoose.Types.ObjectId(),
                status: "draft",
                applicationNumber: null,
                courses: [],
                paymentInfo: { totalAmount: 0 },
                createdAt: new Date()
            });
            console.log(`${colors.green}✅ Second NULL insert succeeded${colors.reset}\n`);

            console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}`);
            console.log(`${colors.green}✅ SUCCESS! Sparse index is working correctly${colors.reset}`);
            console.log(`${colors.green}${"▓".repeat(70)}${colors.reset}\n`);

            // Cleanup test documents
            await collection.deleteMany({ paymentInfo: { totalAmount: 0 } });
        } catch (err) {
            console.log(`${colors.red}❌ Test failed: ${err.message}${colors.reset}\n`);
        }

        await mongoose.disconnect();

    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
})();


