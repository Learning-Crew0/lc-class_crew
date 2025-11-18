/**
 * Script to create sample courses with displayTag
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../src/models/courseNew.model");
const Category = require("../src/models/category.model");

const sampleCoursesTemplate = [
    {
        title: "효과적인 커뮤니케이션 스킬",
        shortDescription: "비즈니스 성공을 위한 소통의 기술",
        longDescription:
            "조직 내 효과적인 의사소통을 통해 업무 효율성을 극대화하는 방법을 학습합니다.",
        description:
            "설득력 있는 프레젠테이션과 협상 기술을 실전 연습을 통해 습득합니다.",
        categorySlug: "business-skills",
        position: "staff",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-blue-500",
        tags: ["커뮤니케이션", "프레젠테이션", "협상"],
        price: 350000,
        priceText: "350,000원",
        date: "2025-12-15",
        duration: "1일",
        location: "온라인",
        hours: 8,
        target: "전 직원",
        recommendedAudience: ["사원", "대리", "과장"],
        learningGoals: ["효과적인 의사전달", "경청 스킬", "피드백 기법"],
        whatYouWillLearn: [
            "상황별 커뮤니케이션 전략",
            "비언어적 소통 기술",
            "갈등 상황 대처법",
        ],
        requirements: ["특별한 선수 조건 없음"],
        level: "beginner",
        language: "none",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "데이터 기반 의사결정",
        shortDescription: "데이터로 읽고 전략으로 승부하라",
        longDescription:
            "빅데이터 분석 도구를 활용한 실전 의사결정 프로세스를 학습합니다.",
        description:
            "Excel, SQL, Python을 활용한 데이터 분석 및 시각화 기법을 배웁니다.",
        categorySlug: "dx",
        position: "manager",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-purple-500",
        tags: ["데이터분석", "빅데이터", "의사결정"],
        price: 600000,
        priceText: "600,000원",
        date: "2025-12-20",
        duration: "2일",
        location: "성수 러닝센터",
        hours: 16,
        target: "관리자 및 데이터 담당자",
        recommendedAudience: ["관리자", "기획자", "분석가"],
        learningGoals: ["데이터 분석 기초", "시각화 기법", "인사이트 도출"],
        whatYouWillLearn: [
            "Excel 고급 함수 활용",
            "SQL 쿼리 작성",
            "Python 기초 데이터 분석",
        ],
        requirements: ["기초 Excel 사용 능력"],
        level: "intermediate",
        language: "none",
        isActive: true,
        isFeatured: true,
    },
    {
        title: "애자일 실무 워크샵",
        shortDescription: "스크럼과 칸반으로 배우는 애자일 방법론",
        longDescription:
            "실제 프로젝트에 애자일을 적용하여 팀의 생산성을 높이는 방법을 실습합니다.",
        description:
            "스크럼, 칸반, 스프린트 계획 등 애자일 핵심 개념을 체득합니다.",
        categorySlug: "business-skills",
        position: "team-leader",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-orange-500",
        tags: ["애자일", "스크럼", "칸반"],
        price: 550000,
        priceText: "550,000원",
        date: "2026-01-05",
        duration: "2일",
        location: "강남 교육센터",
        hours: 16,
        target: "팀장 및 개발팀 리더",
        recommendedAudience: ["팀장", "스크럼마스터", "개발리더"],
        learningGoals: ["애자일 철학 이해", "스크럼 프로세스", "칸반 활용"],
        whatYouWillLearn: [
            "스프린트 계획 및 회고",
            "백로그 관리",
            "일일 스탠드업 미팅 운영",
        ],
        requirements: ["프로젝트 관리 기본 지식"],
        level: "intermediate",
        language: "none",
        isActive: true,
        isFeatured: false,
    },
    {
        title: "AI 시대의 업무 혁신",
        shortDescription: "생성형 AI로 업무 생산성 10배 높이기",
        longDescription:
            "ChatGPT, Midjourney 등 최신 AI 도구를 업무에 실전 적용하는 방법을 배웁니다.",
        description:
            "AI 프롬프트 엔지니어링부터 업무 자동화까지 실무 활용법을 학습합니다.",
        categorySlug: "dx",
        position: "all-employees",
        displayTag: "NEWEST",
        tagText: "HOT",
        tagColor: "text-red-600",
        tags: ["AI", "ChatGPT", "생산성"],
        price: 400000,
        priceText: "400,000원",
        date: "2026-01-10",
        duration: "1일",
        location: "온라인",
        hours: 8,
        target: "전 직원",
        recommendedAudience: ["전체", "기획자", "마케터"],
        learningGoals: ["AI 도구 활용", "프롬프트 작성", "업무 자동화"],
        whatYouWillLearn: [
            "ChatGPT 프롬프트 엔지니어링",
            "AI 기반 문서 작성",
            "이미지 생성 AI 활용",
        ],
        requirements: ["특별한 선수 조건 없음"],
        level: "beginner",
        language: "none",
        isActive: true,
        isFeatured: true,
    },
    {
        title: "신입사원 온보딩 프로그램",
        shortDescription: "성공적인 조직 생활의 첫걸음",
        longDescription:
            "회사 문화, 업무 프로세스, 조직 내 커뮤니케이션 방법을 체계적으로 학습합니다.",
        description:
            "신입사원이 빠르게 조직에 적응하고 성과를 낼 수 있도록 돕는 필수 과정입니다.",
        categorySlug: "life-career",
        position: "new-employee",
        displayTag: "NEWEST",
        tagText: "신규",
        tagColor: "text-green-600",
        tags: ["온보딩", "신입사원", "조직문화"],
        price: 250000,
        priceText: "250,000원",
        date: "2026-01-15",
        duration: "1일",
        location: "서울 본사",
        hours: 8,
        target: "신입사원",
        recommendedAudience: ["신입사원", "인턴"],
        learningGoals: ["조직 이해", "업무 프로세스", "비즈니스 매너"],
        whatYouWillLearn: [
            "회사 비전과 미션 이해",
            "효과적인 업무 관리",
            "조직 내 커뮤니케이션",
        ],
        requirements: ["신입사원 또는 입사 3개월 이내"],
        level: "beginner",
        language: "none",
        isActive: true,
        isFeatured: false,
    },
];

async function createSampleCourses() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        // Fetch all categories
        console.log("📂 Fetching categories...");
        const categories = await Category.find();
        console.log(`✅ Found ${categories.length} categories`);

        if (categories.length === 0) {
            console.log("❌ No categories found in database!");
            console.log("   Please create categories first.");
            return;
        }

        console.log("   Available categories:");
        categories.forEach((cat) =>
            console.log(`     - ${cat.title} (${cat._id})`)
        );

        console.log(
            `\n   Using category: ${categories[0].title} for all courses\n`
        );

        console.log("📝 Creating sample courses...\n");

        for (const courseTemplate of sampleCoursesTemplate) {
            // Replace categorySlug with actual category ObjectId
            const courseData = { ...courseTemplate };
            courseData.category = categories[0]._id; // Use first available category
            delete courseData.categorySlug;

            const course = await Course.create(courseData);
            console.log(`✅ Created: "${course.title}"`);
            console.log(`   - ID: ${course._id}`);
            console.log(`   - DisplayTag: ${course.displayTag}`);
            console.log(`   - Category: ${course.category}`);
            console.log(`   - Position: ${course.position}`);
            console.log(`   - Price: ${course.price}원`);
            console.log("");
        }

        console.log("🎉 Successfully created 5 NEW courses!");
        console.log("\n📋 Summary (All NEWEST tag):");
        console.log("   - Course 1: 효과적인 커뮤니케이션 스킬");
        console.log("   - Course 2: 데이터 기반 의사결정");
        console.log("   - Course 3: 애자일 실무 워크샵");
        console.log("   - Course 4: AI 시대의 업무 혁신");
        console.log("   - Course 5: 신입사원 온보딩 프로그램");
        console.log("\n💡 You can now add images via the admin panel or API");
    } catch (error) {
        console.error("❌ Error creating courses:", error);
        console.error(error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Database connection closed");
    }
}

createSampleCourses();
