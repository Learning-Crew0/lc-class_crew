/**
 * Script to DELETE old courses and create NEW courses with proper displayTag
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../src/models/course.model");
const Category = require("../src/models/category.model");

const coursesData = [
    // ========== NEWEST (6 courses) ==========
    {
        title: "효과적인 커뮤니케이션 스킬",
        shortDescription: "비즈니스 성공을 위한 소통의 기술",
        description: "조직 내 효과적인 의사소통을 통해 업무 효율성을 극대화합니다",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-blue-500",
        price: 350000,
        level: "beginner",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "데이터 기반 의사결정",
        shortDescription: "데이터로 읽고 전략으로 승부하라",
        description: "빅데이터 분석 도구를 활용한 실전 의사결정",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-purple-500",
        price: 600000,
        level: "intermediate",
        isActive: true,
        isFeatured: true,
    },
    {
        title: "애자일 실무 워크샵",
        shortDescription: "스크럼과 칸반으로 배우는 애자일",
        description: "실제 프로젝트에 애자일을 적용하여 팀 생산성 향상",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-orange-500",
        price: 550000,
        level: "intermediate",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "AI 시대의 업무 혁신",
        shortDescription: "생성형 AI로 업무 생산성 10배 높이기",
        description: "ChatGPT를 활용한 실전 업무 자동화",
        displayTag: "NEWEST",
        tagText: "HOT",
        tagColor: "text-red-600",
        price: 400000,
        level: "beginner",
        isActive: true,
        isFeatured: true,
    },
    {
        title: "신입사원 온보딩 프로그램",
        shortDescription: "성공적인 조직 생활의 첫걸음",
        description: "회사 문화와 업무 프로세스 체계적 학습",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-green-600",
        price: 250000,
        level: "beginner",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "디지털 트랜스포메이션 전략",
        shortDescription: "기업의 디지털 혁신을 주도하는 전략",
        description: "AI, 빅데이터를 활용한 비즈니스 혁신",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-green-500",
        price: 800000,
        level: "advanced",
        isActive: true,
        isFeatured: true,
    },

    // ========== POPULAR (3 courses) ==========
    {
        title: "프로젝트 관리 실무",
        shortDescription: "성공적인 프로젝트 관리의 모든 것",
        description: "실무에서 바로 적용하는 프로젝트 관리 기법",
        displayTag: "POPULAR",
        tagText: "인기",
        tagColor: "text-red-500",
        price: 450000,
        level: "intermediate",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "리더십 개발 프로그램",
        shortDescription: "현대 조직을 이끄는 리더의 필수 과정",
        description: "조직 관리 및 팀 빌딩 실전 교육",
        displayTag: "POPULAR",
        tagText: "인기",
        tagColor: "text-red-500",
        price: 700000,
        level: "advanced",
        isActive: true,
        isFeatured: true,
    },
    {
        title: "마케팅 전략 실무",
        shortDescription: "디지털 시대의 마케팅 완벽 가이드",
        description: "데이터 기반 마케팅 전략 수립과 실행",
        displayTag: "POPULAR",
        tagText: "베스트",
        tagColor: "text-yellow-500",
        price: 500000,
        level: "intermediate",
        isActive: true,
        isFeatured: true,
    },

    // ========== ALL (2 courses) ==========
    {
        title: "비즈니스 영어 회화",
        shortDescription: "글로벌 비즈니스를 위한 영어",
        description: "실무 영어 회화와 이메일 작성법",
        displayTag: "ALL",
        tagText: "기본",
        tagColor: "text-gray-500",
        price: 300000,
        level: "beginner",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "Excel 고급 활용",
        shortDescription: "데이터 분석을 위한 Excel 마스터",
        description: "피벗테이블, 매크로, VBA 완벽 활용",
        displayTag: "ALL",
        tagText: "실무",
        tagColor: "text-blue-600",
        price: 280000,
        level: "intermediate",
        isActive: true,
        isFeatured: false,
    },
];

async function recreateCourses() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        // Get first category
        console.log("📂 Fetching categories...");
        const categories = await Category.find().sort({ order: 1 });

        if (categories.length === 0) {
            console.log("❌ No categories found! Run reset-and-seed-categories.js first.");
            return;
        }

        const defaultCategory = categories[0];
        console.log(`✅ Using category: ${defaultCategory.title}\n`);

        // DELETE ALL EXISTING COURSES
        console.log("⚠️  WARNING: Deleting all existing courses...");
        const deleteResult = await Course.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} courses\n`);

        // CREATE NEW COURSES
        console.log("📝 Creating 11 new courses with proper displayTag...\n");

        let newestCount = 0;
        let popularCount = 0;
        let allCount = 0;

        for (const courseData of coursesData) {
            const course = await Course.create({
                ...courseData,
                category: defaultCategory._id,
            });

            console.log(
                `✅ [${course.displayTag}] ${course.title} (${course.price}원)`
            );

            if (course.displayTag === "NEWEST") newestCount++;
            if (course.displayTag === "POPULAR") popularCount++;
            if (course.displayTag === "ALL") allCount++;
        }

        console.log("\n🎉 Successfully created 11 courses!");
        console.log("\n📊 Distribution:");
        console.log(`   - NEWEST: ${newestCount} courses`);
        console.log(`   - POPULAR: ${popularCount} courses`);
        console.log(`   - ALL: ${allCount} courses`);
        console.log(`   - Total: ${newestCount + popularCount + allCount} courses`);

        console.log("\n🧪 Test Filtering:");
        console.log("   GET /api/v1/courses?displayTag=NEWEST   → Should return 6");
        console.log("   GET /api/v1/courses?displayTag=POPULAR  → Should return 3");
        console.log("   GET /api/v1/courses?displayTag=ALL      → Should return 2");
    } catch (error) {
        console.error("❌ Error:", error);
        console.error(error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

recreateCourses();

