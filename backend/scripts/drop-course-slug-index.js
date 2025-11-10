/**
 * Drop the old slug index from the courses collection
 * Run this script once to fix the "slug already exists" error
 */

require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../src/config/logger");

const dropSlugIndex = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/classcrew";
        
        logger.info("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        
        logger.info("Connected to MongoDB");
        
        const db = mongoose.connection.db;
        const coursesCollection = db.collection("courses");
        
        // List all indexes
        logger.info("Current indexes on courses collection:");
        const indexes = await coursesCollection.indexes();
        console.log(JSON.stringify(indexes, null, 2));
        
        // Check if slug index exists
        const slugIndexExists = indexes.some(
            index => index.key && index.key.slug !== undefined
        );
        
        if (slugIndexExists) {
            logger.info("Dropping slug index...");
            
            // Try both possible index names
            try {
                await coursesCollection.dropIndex("slug_1");
                logger.info("✅ Successfully dropped slug_1 index");
            } catch (err) {
                if (err.code !== 27) { // 27 = IndexNotFound
                    logger.warn(`Could not drop slug_1: ${err.message}`);
                }
            }
            
            try {
                await coursesCollection.dropIndex({ slug: 1 });
                logger.info("✅ Successfully dropped slug index");
            } catch (err) {
                if (err.code !== 27) {
                    logger.warn(`Could not drop slug index: ${err.message}`);
                }
            }
        } else {
            logger.info("❌ No slug index found - nothing to drop");
        }
        
        // List indexes after dropping
        logger.info("\nIndexes after dropping:");
        const indexesAfter = await coursesCollection.indexes();
        console.log(JSON.stringify(indexesAfter, null, 2));
        
        logger.info("\n✅ Script completed successfully");
        
    } catch (error) {
        logger.error("Error dropping slug index:", error);
        throw error;
    } finally {
        await mongoose.disconnect();
        logger.info("Disconnected from MongoDB");
    }
};

// Run the script
dropSlugIndex()
    .then(() => {
        console.log("\n✅ Done! You can now create courses without slug errors.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Failed:", error);
        process.exit(1);
    });

