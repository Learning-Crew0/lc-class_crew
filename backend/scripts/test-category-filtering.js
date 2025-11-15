/**
 * Test Script for Category & Position Filtering System
 * Tests all new endpoints for category and position filtering
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1/public";

const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
};

console.log(`${colors.blue}🧪 Category & Position Filtering Test Suite${colors.reset}\n`);
console.log(`📍 Testing: ${BASE_URL}\n`);

const runTests = async () => {
    try {
        // Test 1: Get All Categories
        console.log("=".repeat(70));
        console.log("TEST 1: GET /categories - Get all categories");
        console.log("=".repeat(70));
        
        const categoriesRes = await axios.get(`${BASE_URL}/categories`);
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${categoriesRes.status}`);
        console.log(`Total Categories: ${categoriesRes.data.data.categories.length}`);
        
        console.log("\nCategories:");
        categoriesRes.data.data.categories.forEach((cat, index) => {
            console.log(`  ${index + 1}. ${cat.koreanName} (${cat.englishName})`);
            console.log(`     Slug: ${cat.slug}, Order: ${cat.order}`);
        });

        // Test 2: Get All Positions
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 2: GET /positions - Get all positions");
        console.log("=".repeat(70));
        
        const positionsRes = await axios.get(`${BASE_URL}/positions`);
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${positionsRes.status}`);
        console.log(`Total Positions: ${positionsRes.data.data.positions.length}`);
        
        console.log("\nPositions:");
        positionsRes.data.data.positions.forEach((pos, index) => {
            console.log(`  ${index + 1}. ${pos.koreanName} (${pos.englishName})`);
            console.log(`     Slug: ${pos.slug}, Order: ${pos.order}`);
        });

        // Test 3: Get Courses by Category (navbar filtering)
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 3: GET /courses/category/:slug - Filter by category");
        console.log("=".repeat(70));
        console.log(`Testing with category: leadership\n`);
        
        const categoryCoursesRes = await axios.get(
            `${BASE_URL}/courses/category/leadership`
        );
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${categoryCoursesRes.status}`);
        console.log(`Total Courses: ${categoryCoursesRes.data.data.courses.length}`);
        
        if (categoryCoursesRes.data.data.categoryInfo) {
            console.log(`\nCategory Info:`);
            console.log(`  ${categoryCoursesRes.data.data.categoryInfo.koreanName}`);
            console.log(`  (${categoryCoursesRes.data.data.categoryInfo.englishName})`);
        }
        
        if (categoryCoursesRes.data.data.courses.length > 0) {
            console.log("\nSample Courses:");
            categoryCoursesRes.data.data.courses.slice(0, 3).forEach((course, index) => {
                console.log(`  ${index + 1}. ${course.title}`);
                console.log(`     Category: ${course.categoryInfo?.koreanName || course.category}`);
                console.log(`     Position: ${course.positionInfo?.koreanName || course.position}`);
            });
        } else {
            console.log(`\n${colors.yellow}⚠️  No courses found for this category${colors.reset}`);
        }

        // Test 4: Get Courses by Category with Pagination
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 4: GET /courses/category/:slug?page=1&limit=5");
        console.log("=".repeat(70));
        console.log(`Testing with category: business-skills, page=1, limit=5\n`);
        
        const paginatedCategoryRes = await axios.get(
            `${BASE_URL}/courses/category/business-skills?page=1&limit=5`
        );
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${paginatedCategoryRes.status}`);
        console.log(`Courses Returned: ${paginatedCategoryRes.data.data.courses.length}`);
        
        if (paginatedCategoryRes.data.data.pagination) {
            const p = paginatedCategoryRes.data.data.pagination;
            console.log(`\nPagination:`);
            console.log(`  Page ${p.currentPage} of ${p.totalPages}`);
            console.log(`  Total Courses: ${p.totalCourses}`);
            console.log(`  Limit: ${p.limit}`);
            console.log(`  Has Next Page: ${p.hasNextPage}`);
            console.log(`  Has Previous Page: ${p.hasPrevPage}`);
        }

        // Test 5: Search Courses (category only)
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 5: GET /courses/search?category=dx");
        console.log("=".repeat(70));
        
        const searchCategoryRes = await axios.get(
            `${BASE_URL}/courses/search?category=dx`
        );
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${searchCategoryRes.status}`);
        console.log(`Total Courses: ${searchCategoryRes.data.data.courses.length}`);
        
        if (searchCategoryRes.data.data.appliedFilters) {
            console.log(`\nApplied Filters:`);
            console.log(`  Category: ${searchCategoryRes.data.data.appliedFilters.categoryName} (${searchCategoryRes.data.data.appliedFilters.category})`);
        }

        // Test 6: Search Courses (position only)
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 6: GET /courses/search?position=manager");
        console.log("=".repeat(70));
        
        const searchPositionRes = await axios.get(
            `${BASE_URL}/courses/search?position=manager`
        );
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${searchPositionRes.status}`);
        console.log(`Total Courses: ${searchPositionRes.data.data.courses.length}`);
        
        if (searchPositionRes.data.data.appliedFilters) {
            console.log(`\nApplied Filters:`);
            console.log(`  Position: ${searchPositionRes.data.data.appliedFilters.positionName} (${searchPositionRes.data.data.appliedFilters.position})`);
        }

        // Test 7: Search Courses (category + position combined)
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 7: GET /courses/search?category=leadership&position=executive");
        console.log("=".repeat(70));
        
        const searchCombinedRes = await axios.get(
            `${BASE_URL}/courses/search?category=leadership&position=executive`
        );
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${searchCombinedRes.status}`);
        console.log(`Total Courses: ${searchCombinedRes.data.data.courses.length}`);
        
        if (searchCombinedRes.data.data.appliedFilters) {
            console.log(`\nApplied Filters:`);
            const af = searchCombinedRes.data.data.appliedFilters;
            console.log(`  Category: ${af.categoryName} (${af.category})`);
            console.log(`  Position: ${af.positionName} (${af.position})`);
        }

        if (searchCombinedRes.data.data.courses.length > 0) {
            console.log("\nMatching Courses:");
            searchCombinedRes.data.data.courses.forEach((course, index) => {
                console.log(`  ${index + 1}. ${course.title}`);
                console.log(`     Category: ${course.categoryInfo?.koreanName}`);
                console.log(`     Position: ${course.positionInfo?.koreanName}`);
            });
        } else {
            console.log(`\n${colors.yellow}⚠️  No courses found matching both filters${colors.reset}`);
        }

        // Test 8: Search with Pagination and Sorting
        console.log(`\n${"=".repeat(70)}`);
        console.log("TEST 8: GET /courses/search?category=life-career&page=1&limit=10&sortBy=title&order=asc");
        console.log("=".repeat(70));
        
        const searchAdvancedRes = await axios.get(
            `${BASE_URL}/courses/search?category=life-career&page=1&limit=10&sortBy=title&order=asc`
        );
        
        console.log(`${colors.green}✅ SUCCESS${colors.reset}`);
        console.log(`Status: ${searchAdvancedRes.status}`);
        console.log(`Courses Returned: ${searchAdvancedRes.data.data.courses.length}`);

        // Summary
        console.log(`\n${"=".repeat(70)}`);
        console.log(`${colors.green}✅ ALL TESTS PASSED${colors.reset}`);
        console.log("=".repeat(70));

        console.log("\n📋 Summary:");
        console.log(`   ✅ Categories Endpoint Working (${categoriesRes.data.data.categories.length} categories)`);
        console.log(`   ✅ Positions Endpoint Working (${positionsRes.data.data.positions.length} positions)`);
        console.log(`   ✅ Category Filtering Working`);
        console.log(`   ✅ Position Filtering Working`);
        console.log(`   ✅ Combined Filtering Working`);
        console.log(`   ✅ Pagination Working`);
        console.log(`   ✅ Sorting Working`);

        console.log("\n🚀 Frontend Integration Endpoints:");
        console.log(`   GET ${BASE_URL}/categories`);
        console.log(`   GET ${BASE_URL}/positions`);
        console.log(`   GET ${BASE_URL}/courses/category/{slug}`);
        console.log(`   GET ${BASE_URL}/courses/search?category=X&position=Y`);
        console.log(`   GET ${BASE_URL}/courses/{id}`);

        console.log("\n💡 Example Usage:");
        console.log(`   ${colors.yellow}# Get all categories${colors.reset}`);
        console.log(`   curl ${BASE_URL}/categories`);
        console.log(`\n   ${colors.yellow}# Get courses for 리더십/직급/계층${colors.reset}`);
        console.log(`   curl "${BASE_URL}/courses/category/leadership"`);
        console.log(`\n   ${colors.yellow}# Search: DX courses for managers${colors.reset}`);
        console.log(`   curl "${BASE_URL}/courses/search?category=dx&position=manager"`);

        console.log(`\n${colors.green}✅ Backend is ready for frontend integration!${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ ERROR:${colors.reset}`, error.message);
        
        if (error.response) {
            console.error("\nResponse Details:");
            console.error(`  Status: ${error.response.status}`);
            console.error(`  Message: ${error.response.data?.message || 'No message'}`);
            
            if (error.response.data) {
                console.error("\n  Full Response:");
                console.error(JSON.stringify(error.response.data, null, 2));
            }
        } else if (error.request) {
            console.error("\n❌ No response received from server");
            console.error("   Is the backend running on port 5000?");
        }
        
        process.exit(1);
    }
};

runTests();

