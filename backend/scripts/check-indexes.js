require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../src/config/env");

(async () => {
    await mongoose.connect(config.mongodb.uri);
    
    const collection = mongoose.connection.collection("classapplications");
    
    console.log("\n=== Current Indexes ===\n");
    const indexes = await collection.indexes();
    
    indexes.forEach((index, i) => {
        console.log(`Index ${i + 1}:`);
        console.log(`  Name: ${index.name}`);
        console.log(`  Keys: ${JSON.stringify(index.key)}`);
        console.log(`  Unique: ${index.unique || false}`);
        console.log(`  Sparse: ${index.sparse || false}`);
        console.log();
    });
    
    // Check specifically for applicationNumber index
    const appNumIndex = indexes.find(idx => idx.key.applicationNumber);
    if (appNumIndex) {
        console.log("=== applicationNumber Index Details ===");
        console.log(JSON.stringify(appNumIndex, null, 2));
        
        if (!appNumIndex.sparse) {
            console.log("\n❌ PROBLEM FOUND: applicationNumber index is NOT sparse!");
            console.log("   This causes unique constraint violations for multiple NULL values\n");
        } else {
            console.log("\n✅ Index is correctly configured as sparse\n");
        }
    } else {
        console.log("⚠️  No applicationNumber index found!\n");
    }
    
    await mongoose.disconnect();
})();


