/**
 * Seed announcement data
 * Populates the database with sample announcements
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Announcement = require("../src/models/announcement.model");
const User = require("../src/models/user.model");
const config = require("../src/config/env");

const sampleAnnouncements = [
    {
        title: "2025년 하반기 공개교육 안내",
        content: `<h2>2025년 하반기 공개교육 일정 안내</h2>
<p>안녕하세요, 클래스 크루입니다.</p>
<p>2025년 하반기 공개교육 일정을 안내드립니다.</p>
<h3>교육 일정</h3>
<ul>
<li>7월: 리더십 교육 (7/10-7/12)</li>
<li>8월: 프로젝트 관리 교육 (8/15-8/17)</li>
<li>9월: 마케팅 전략 교육 (9/20-9/22)</li>
</ul>
<p>자세한 사항은 고객센터로 문의해 주시기 바랍니다.</p>`,
        isPinned: true,
        isActive: true,
        views: 245,
        createdAt: new Date("2025-07-10"),
    },
    {
        title: "성수 러닝센터 대관 안내",
        content: `<h2>성수 러닝센터 대관 서비스 안내</h2>
<p>성수에 위치한 러닝센터를 대관하실 수 있습니다.</p>
<h3>대관 가능 시설</h3>
<ul>
<li>강의실 A (50명 수용)</li>
<li>강의실 B (30명 수용)</li>
<li>세미나실 (20명 수용)</li>
</ul>
<h3>대관 문의</h3>
<p>전화: 02-1234-5678<br>이메일: rental@class-crew.com</p>`,
        isPinned: true,
        isActive: true,
        views: 189,
        createdAt: new Date("2025-06-10"),
    },
    {
        title: "66 챌린지 Kit 출시, 얼리버드 할인 받으세요!",
        content: `<h2>66 챌린지 Kit 출시 안내</h2>
<p>습관 형성을 위한 66 챌린지 Kit이 출시되었습니다!</p>
<h3>얼리버드 할인</h3>
<p>출시 기념 특가: 정가 49,000원 → <strong>29,900원</strong></p>
<p>할인 기간: 6월 10일 ~ 6월 30일</p>
<h3>구성품</h3>
<ul>
<li>66일 챌린지 노트</li>
<li>습관 트래커 스티커</li>
<li>동기부여 카드 세트</li>
<li>온라인 강의 3개월 이용권</li>
</ul>`,
        isPinned: false,
        isActive: true,
        views: 312,
        createdAt: new Date("2025-06-10"),
    },
    {
        title: "2025년 상반기 교육 만족도 조사 결과",
        content: `<h2>2025년 상반기 교육 만족도 조사 결과 발표</h2>
<p>지난 상반기 동안 진행된 교육에 대한 만족도 조사 결과를 공유합니다.</p>
<h3>주요 결과</h3>
<ul>
<li>전체 만족도: 4.8/5.0</li>
<li>강사 만족도: 4.9/5.0</li>
<li>시설 만족도: 4.7/5.0</li>
<li>재등록 의향: 95%</li>
</ul>
<p>많은 관심과 참여 감사드립니다!</p>`,
        isPinned: false,
        isActive: true,
        views: 156,
        createdAt: new Date("2025-05-15"),
    },
    {
        title: "개인정보 처리방침 개정 안내",
        content: `<h2>개인정보 처리방침 개정 안내</h2>
<p>개인정보 처리방침이 2025년 5월 1일부로 개정되었습니다.</p>
<h3>주요 개정 내용</h3>
<ul>
<li>개인정보 보관 기간 명확화</li>
<li>제3자 제공 관련 규정 강화</li>
<li>개인정보 열람 및 정정 절차 간소화</li>
</ul>
<p>자세한 내용은 홈페이지 하단의 개인정보 처리방침을 참고해 주세요.</p>`,
        isPinned: false,
        isActive: true,
        views: 98,
        createdAt: new Date("2025-05-01"),
    },
    {
        title: "5월 무료 특강 안내",
        content: `<h2>5월 무료 특강 일정 안내</h2>
<p>5월 한 달 동안 진행되는 무료 특강을 안내합니다.</p>
<h3>일정</h3>
<ul>
<li>5/10 (토) 14:00 - "성공하는 팀의 비밀" (김철수 강사)</li>
<li>5/17 (토) 14:00 - "디지털 마케팅 트렌드" (이영희 강사)</li>
<li>5/24 (토) 14:00 - "효율적인 시간 관리" (박민수 강사)</li>
</ul>
<p>신청: 홈페이지 이벤트 페이지</p>`,
        isPinned: false,
        isActive: true,
        views: 278,
        createdAt: new Date("2025-04-25"),
    },
    {
        title: "플랫폼 업데이트 안내",
        content: `<h2>플랫폼 시스템 업데이트 안내</h2>
<p>더 나은 서비스 제공을 위해 시스템 업데이트를 진행합니다.</p>
<h3>업데이트 일정</h3>
<p>일시: 2025년 4월 20일 (일) 02:00 ~ 06:00 (4시간)</p>
<h3>주요 업데이트 내용</h3>
<ul>
<li>모바일 앱 UI/UX 개선</li>
<li>동영상 로딩 속도 향상</li>
<li>결제 시스템 안정화</li>
<li>새로운 학습 기능 추가</li>
</ul>
<p>업데이트 시간 동안 서비스 이용이 일시 중단됩니다. 양해 부탁드립니다.</p>`,
        isPinned: false,
        isActive: true,
        views: 134,
        createdAt: new Date("2025-04-15"),
    },
    {
        title: "신규 강사 모집 안내",
        content: `<h2>클래스 크루 신규 강사 모집</h2>
<p>함께 성장할 전문 강사님을 모집합니다.</p>
<h3>모집 분야</h3>
<ul>
<li>리더십 & 조직관리</li>
<li>마케팅 & 세일즈</li>
<li>IT & 디지털</li>
<li>자기계발 & 커리어</li>
</ul>
<h3>지원 자격</h3>
<ul>
<li>해당 분야 3년 이상 강의 경력</li>
<li>열정적인 교육 마인드</li>
<li>우수한 커뮤니케이션 스킬</li>
</ul>
<p>지원: jobs@class-crew.com</p>`,
        isPinned: false,
        isActive: true,
        views: 223,
        createdAt: new Date("2025-04-01"),
    },
];

(async () => {
    console.log("\n🌱 Seeding Announcement Data...\n");

    try {
        await mongoose.connect(config.mongodb.uri);
        console.log("✅ Connected to database\n");

        // Find an admin user to assign as creator
        let adminUser = await User.findOne({ role: "admin" });

        // If no admin found, use the first user or create a dummy reference
        if (!adminUser) {
            const anyUser = await User.findOne();
            if (anyUser) {
                console.log(
                    "⚠️  No admin user found, using first available user"
                );
                adminUser = anyUser;
            } else {
                console.log("❌ No users found in database!");
                console.log(
                    "   Please create a user first or update the seed script.\n"
                );
                await mongoose.disconnect();
                return;
            }
        }

        console.log(`Using admin: ${adminUser.email} (${adminUser._id})\n`);

        // Clear existing announcements (optional)
        const existingCount = await Announcement.countDocuments();
        if (existingCount > 0) {
            console.log(`Found ${existingCount} existing announcements`);
            console.log("Clearing existing announcements...");
            await Announcement.deleteMany({});
            console.log("✅ Cleared\n");
        }

        // Insert sample announcements one by one (for auto-increment)
        console.log("Creating sample announcements...\n");

        const created = [];
        for (const annData of sampleAnnouncements) {
            const announcement = await Announcement.create({
                ...annData,
                createdBy: adminUser._id,
            });
            created.push(announcement);
            console.log(
                `  ✓ Created: ${announcement.title} (ID: ${announcement.id})`
            );
        }

        console.log(
            `\n✅ Successfully created ${created.length} announcements!\n`
        );

        // Show summary
        const stats = {
            total: await Announcement.countDocuments(),
            active: await Announcement.countDocuments({ isActive: true }),
            pinned: await Announcement.countDocuments({ isPinned: true }),
        };

        console.log("📊 Summary:");
        console.log(`   Total announcements: ${stats.total}`);
        console.log(`   Active: ${stats.active}`);
        console.log(`   Pinned: ${stats.pinned}\n`);

        // Show recent announcements
        const recent = await Announcement.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select("id title views isPinned")
            .lean();

        console.log("📝 Recent Announcements:");
        recent.forEach((ann, i) => {
            console.log(
                `   ${i + 1}. [${ann.id}] ${ann.title} ${ann.isPinned ? "📌" : ""} (${ann.views} views)`
            );
        });

        console.log("\n✅ Seeding complete!\n");

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error seeding data:", error.message);
        console.error(error);
        process.exit(1);
    }
})();
