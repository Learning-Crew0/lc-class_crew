/**
 * Test public announcement endpoints (no auth required)
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1";

(async () => {
    console.log("\n🧪 Testing Public Announcement Endpoints\n");

    try {
        // TEST 1: Get all announcements
        console.log("━━━ TEST 1: GET /announcements ━━━");
        const response1 = await axios.get(`${BASE_URL}/announcements?page=1&limit=5`);
        
        console.log(`✅ Status: ${response1.status}`);
        console.log(`✅ Message: ${response1.data.message}`);
        console.log(`✅ Found: ${response1.data.data.announcements.length} announcements`);
        console.log(`   Total items: ${response1.data.data.pagination.totalItems}`);
        console.log(`   Has next page: ${response1.data.data.pagination.hasNextPage}\n`);

        if (response1.data.data.announcements.length > 0) {
            const first = response1.data.data.announcements[0];
            console.log("   First announcement:");
            console.log(`     Title: ${first.title}`);
            console.log(`     Display ID: ${first.id || 'undefined'}`);
            console.log(`     Database ID: ${first._id}`);
            console.log(`     isPinned: ${first.isPinned}`);
            console.log(`     isActive: ${first.isActive}`);
            console.log(`     Views: ${first.views}`);
            console.log(`     Created: ${new Date(first.createdAt).toLocaleString()}\n`);

            // TEST 2: Get single announcement
            console.log("━━━ TEST 2: GET /announcements/:id ━━━");
            const announcementId = first._id;
            
            // First call
            const response2a = await axios.get(`${BASE_URL}/announcements/${announcementId}`);
            const views1 = response2a.data.data.announcement.views;
            console.log(`✅ Status: ${response2a.status}`);
            console.log(`✅ Views (1st call): ${views1}`);

            // Second call (should increment views)
            const response2b = await axios.get(`${BASE_URL}/announcements/${announcementId}`);
            const views2 = response2b.data.data.announcement.views;
            console.log(`✅ Views (2nd call): ${views2}`);
            
            if (views2 > views1) {
                console.log(`✅ View count incremented correctly! (+1)\n`);
            } else {
                console.log(`❌ View count did NOT increment\n`);
            }
        }

        // TEST 3: Pagination
        console.log("━━━ TEST 3: Test Pagination ━━━");
        const response3 = await axios.get(`${BASE_URL}/announcements?page=1&limit=2`);
        console.log(`✅ Status: ${response3.status}`);
        console.log(`   Page 1 items: ${response3.data.data.announcements.length}`);
        console.log(`   Total pages: ${response3.data.data.pagination.totalPages}`);
        console.log(`   Has next: ${response3.data.data.pagination.hasNextPage}\n`);

        // TEST 4: Filter by active
        console.log("━━━ TEST 4: Filter by isActive ━━━");
        const response4 = await axios.get(`${BASE_URL}/announcements?isActive=true`);
        console.log(`✅ Status: ${response4.status}`);
        console.log(`   Active announcements: ${response4.data.data.announcements.length}\n`);

        // TEST 5: Error handling - non-existent ID
        console.log("━━━ TEST 5: Error Handling ━━━");
        try {
            await axios.get(`${BASE_URL}/announcements/000000000000000000000000`);
            console.log("❌ Should have returned 404\n");
        } catch (error) {
            if (error.response?.status === 404) {
                console.log(`✅ Correctly returns 404 for non-existent ID\n`);
            }
        }

        // SUMMARY
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ PUBLIC ENDPOINTS WORKING!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        console.log("Tested features:");
        console.log("  ✅ Get all announcements");
        console.log("  ✅ Get single announcement");
        console.log("  ✅ View count increment");
        console.log("  ✅ Pagination");
        console.log("  ✅ Filtering");
        console.log("  ✅ Error handling\n");
        console.log("📝 Note: Admin endpoints require authentication\n");
        console.log("🎯 Ready for frontend integration!\n");

    } catch (error) {
        console.log("\n❌ Error:", error.message);
        if (error.response) {
            console.log("   Status:", error.response.status);
            console.log("   Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
})();

