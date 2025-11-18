/**
 * Seed search data for testing
 * Creates sample search logs to populate popular keywords
 */

require("dotenv").config();
const mongoose = require("mongoose");
const SearchLog = require("../src/models/searchLog.model");
const config = require("../src/config/env");

const sampleSearches = [
    // Korean keywords
    { keyword: "리더십", count: 45 },
    { keyword: "프로젝트 관리", count: 38 },
    { keyword: "마케팅", count: 32 },
    { keyword: "데이터 분석", count: 28 },
    { keyword: "재무 관리", count: 25 },
    { keyword: "커뮤니케이션", count: 22 },
    { keyword: "팀 빌딩", count: 20 },
    { keyword: "시간 관리", count: 18 },
    { keyword: "전략 수립", count: 15 },
    { keyword: "혁신", count: 12 },
    { keyword: "영업", count: 10 },
    { keyword: "고객 서비스", count: 8 },
    { keyword: "품질 관리", count: 7 },
    { keyword: "조직 개발", count: 5 },
    { keyword: "변화 관리", count: 3 },
];

const sources = ["modal", "navbar", "results_page", "autocomplete", "other"];

const getRandomSource = () => sources[Math.floor(Math.random() * sources.length)];
const getRandomResultsCount = () => Math.floor(Math.random() * 15) + 1; // 1-15
const getRandomDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
};

(async () => {
    console.log("\n🌱 Seeding Search Data...\n");

    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to database\n");

        // Clear existing search logs (optional - comment out to keep existing data)
        // await SearchLog.deleteMany({});
        // console.log("🗑️  Cleared existing search logs\n");

        const searchLogsToCreate = [];

        // Create search logs based on sample data
        sampleSearches.forEach((sample) => {
            for (let i = 0; i < sample.count; i++) {
                searchLogsToCreate.push({
                    keyword: sample.keyword.toLowerCase(),
                    originalKeyword: sample.keyword,
                    resultsCount: getRandomResultsCount(),
                    source: getRandomSource(),
                    createdAt: getRandomDate(30), // Random date within last 30 days
                });
            }
        });

        // Insert in batches
        const batchSize = 100;
        for (let i = 0; i < searchLogsToCreate.length; i += batchSize) {
            const batch = searchLogsToCreate.slice(i, i + batchSize);
            await SearchLog.insertMany(batch);
            console.log(
                `📝 Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} logs)`
            );
        }

        console.log(
            `\n✅ Successfully seeded ${searchLogsToCreate.length} search logs!\n`
        );

        // Show summary
        const total = await SearchLog.countDocuments();
        console.log(`📊 Total search logs in database: ${total}\n`);

        // Show top 10 popular keywords
        const popular = await SearchLog.aggregate([
            {
                $group: {
                    _id: "$keyword",
                    count: { $sum: 1 },
                    originalKeyword: { $first: "$originalKeyword" },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        console.log("🔥 Top 10 Popular Keywords:");
        popular.forEach((k, i) => {
            console.log(`   ${i + 1}. "${k.originalKeyword}" - ${k.count} searches`);
        });

        console.log("\n✅ Seeding complete!\n");

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error seeding data:", error.message);
        process.exit(1);
    }
})();

