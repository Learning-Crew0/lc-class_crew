const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Test database connected");
    } catch (error) {
        console.error("Error connecting to test database:", error);
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
        }
        console.log("Test database closed");
    } catch (error) {
        console.error("Error closing test database:", error);
    }
};

const clearDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

module.exports = {
    connectDB,
    closeDB,
    clearDB,
};
