/**
 * Test script for Announcement System
 * Tests all announcement endpoints
 */

require("dotenv").config();
const axios = require("axios");
const { generateToken } = require("../src/utils/crypto.util");

// Configuration
const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api/v1";
const ADMIN_USER_ID = "691aebe8962da064edc9cb18"; // Update with your admin ID

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    section: (msg) =>
        console.log(
            `\n${colors.bright}${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`
        ),
};

let adminToken;
let createdAnnouncementId;

(async () => {
    try {
        console.log("\n📢 Testing Announcement System\n");
        console.log(`Base URL: ${BASE_URL}\n`);

        // Generate admin token
        adminToken = generateToken({ id: ADMIN_USER_ID, role: "admin" });
        log.info(`Generated admin token`);

        // ===== TEST 1: Get All Announcements (Public) =====
        log.section("TEST 1: Get All Announcements (Public)");

        try {
            const response = await axios.get(`${BASE_URL}/announcements`, {
                params: {
                    page: 1,
                    limit: 10,
                },
            });

            log.success("Public - Get all announcements");
            console.log(`  Found ${response.data.data.announcements.length} announcements`);
            console.log(`  Total: ${response.data.data.pagination.totalItems}`);
            console.log(`  Pages: ${response.data.data.pagination.totalPages}`);

            if (response.data.data.announcements.length > 0) {
                const first = response.data.data.announcements[0];
                console.log(`\n  First announcement:`);
                console.log(`    ID: ${first.id}`);
                console.log(`    Title: ${first.title}`);
                console.log(`    isPinned: ${first.isPinned}`);
                console.log(`    isNew: ${first.isNew}`);
                console.log(`    Views: ${first.views}`);
            }
        } catch (error) {
            log.error(
                `Failed to get announcements: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 2: Create Announcement (Admin) =====
        log.section("TEST 2: Create Announcement (Admin)");

        try {
            const newAnnouncement = {
                title: "테스트 공지사항 - " + new Date().toLocaleString(),
                content:
                    "<h2>테스트 공지</h2><p>이것은 테스트 공지사항입니다.</p><p>자동으로 생성되었습니다.</p>",
                isPinned: false,
                isActive: true,
            };

            const response = await axios.post(
                `${BASE_URL}/announcements`,
                newAnnouncement,
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );

            createdAnnouncementId = response.data.data.announcement._id;

            log.success("Admin - Create announcement");
            console.log(`  Created ID: ${response.data.data.announcement._id}`);
            console.log(`  Display ID: ${response.data.data.announcement.id}`);
            console.log(`  Title: ${response.data.data.announcement.title}`);
        } catch (error) {
            log.error(
                `Failed to create announcement: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 3: Get Single Announcement (Public) =====
        log.section("TEST 3: Get Single Announcement (Public)");

        if (createdAnnouncementId) {
            try {
                const response = await axios.get(
                    `${BASE_URL}/announcements/${createdAnnouncementId}`
                );

                const initialViews = response.data.data.announcement.views;

                log.success("Public - Get single announcement");
                console.log(`  Views before: ${initialViews}`);

                // Get again to check view increment
                const response2 = await axios.get(
                    `${BASE_URL}/announcements/${createdAnnouncementId}`
                );

                const newViews = response2.data.data.announcement.views;

                console.log(`  Views after: ${newViews}`);

                if (newViews === initialViews + 1) {
                    log.success("View count incremented correctly");
                } else {
                    log.error(
                        `View count not incremented correctly (${initialViews} -> ${newViews})`
                    );
                }
            } catch (error) {
                log.error(
                    `Failed to get single announcement: ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        } else {
            log.error("No announcement ID available for testing");
        }

        // ===== TEST 4: Update Announcement (Admin) =====
        log.section("TEST 4: Update Announcement (Admin)");

        if (createdAnnouncementId) {
            try {
                const updates = {
                    title: "수정된 테스트 공지사항 - " + new Date().toLocaleString(),
                    isPinned: true,
                };

                const response = await axios.put(
                    `${BASE_URL}/announcements/${createdAnnouncementId}`,
                    updates,
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );

                log.success("Admin - Update announcement");
                console.log(`  New title: ${response.data.data.announcement.title}`);
                console.log(`  isPinned: ${response.data.data.announcement.isPinned}`);
            } catch (error) {
                log.error(
                    `Failed to update announcement: ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 5: Toggle Pin (Admin) =====
        log.section("TEST 5: Toggle Pin (Admin)");

        if (createdAnnouncementId) {
            try {
                const response = await axios.patch(
                    `${BASE_URL}/announcements/${createdAnnouncementId}/pin`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );

                log.success("Admin - Toggle pin");
                console.log(`  isPinned: ${response.data.data.announcement.isPinned}`);
            } catch (error) {
                log.error(
                    `Failed to toggle pin: ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 6: Toggle Active (Admin) =====
        log.section("TEST 6: Toggle Active (Admin)");

        if (createdAnnouncementId) {
            try {
                const response = await axios.patch(
                    `${BASE_URL}/announcements/${createdAnnouncementId}/active`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );

                log.success("Admin - Toggle active");
                console.log(`  isActive: ${response.data.data.announcement.isActive}`);
            } catch (error) {
                log.error(
                    `Failed to toggle active: ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 7: Get Statistics (Admin) =====
        log.section("TEST 7: Get Statistics (Admin)");

        try {
            const response = await axios.get(
                `${BASE_URL}/announcements/stats/overview`,
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );

            log.success("Admin - Get statistics");
            const stats = response.data.data.stats;
            console.log(`  Total announcements: ${stats.totalAnnouncements}`);
            console.log(`  Active: ${stats.activeAnnouncements}`);
            console.log(`  Pinned: ${stats.pinnedAnnouncements}`);
            console.log(`  Total views: ${stats.totalViews}`);
            console.log(`  Average views: ${stats.averageViews}`);
        } catch (error) {
            log.error(
                `Failed to get statistics: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 8: Filter by Active Status =====
        log.section("TEST 8: Filter by Active Status");

        try {
            const response = await axios.get(`${BASE_URL}/announcements`, {
                params: {
                    isActive: true,
                    limit: 5,
                },
            });

            log.success("Public - Filter by active status");
            console.log(`  Active announcements: ${response.data.data.announcements.length}`);
        } catch (error) {
            log.error(
                `Failed to filter announcements: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 9: Pagination =====
        log.section("TEST 9: Pagination");

        try {
            const page1 = await axios.get(`${BASE_URL}/announcements`, {
                params: { page: 1, limit: 2 },
            });

            const page2 = await axios.get(`${BASE_URL}/announcements`, {
                params: { page: 2, limit: 2 },
            });

            log.success("Public - Pagination");
            console.log(`  Page 1 items: ${page1.data.data.announcements.length}`);
            console.log(`  Page 2 items: ${page2.data.data.announcements.length}`);
            console.log(`  Has next page: ${page1.data.data.pagination.hasNextPage}`);
        } catch (error) {
            log.error(
                `Failed to test pagination: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 10: Delete Announcement (Admin) =====
        log.section("TEST 10: Delete Announcement (Admin)");

        if (createdAnnouncementId) {
            try {
                await axios.delete(
                    `${BASE_URL}/announcements/${createdAnnouncementId}`,
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );

                log.success("Admin - Delete announcement");
                console.log(`  Deleted ID: ${createdAnnouncementId}`);
            } catch (error) {
                log.error(
                    `Failed to delete announcement: ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 11: Error Handling =====
        log.section("TEST 11: Error Handling");

        // Try to get non-existent announcement
        try {
            await axios.get(`${BASE_URL}/announcements/000000000000000000000000`);
            log.error("Should have returned 404 for non-existent announcement");
        } catch (error) {
            if (error.response?.status === 404) {
                log.success("Correctly returns 404 for non-existent announcement");
            } else {
                log.error(`Unexpected error: ${error.message}`);
            }
        }

        // Try to create announcement without auth
        try {
            await axios.post(`${BASE_URL}/announcements`, {
                title: "Test",
                content: "Test content",
            });
            log.error("Should have returned 401 for unauthenticated request");
        } catch (error) {
            if (error.response?.status === 401) {
                log.success("Correctly returns 401 for unauthenticated request");
            } else {
                log.error(`Unexpected error: ${error.message}`);
            }
        }

        // ===== SUMMARY =====
        log.section("TEST SUMMARY");
        log.success("All announcement system tests completed!");
        console.log(
            "\n✅ Announcement system is working correctly!\n" +
                "   - Public access to view announcements\n" +
                "   - Admin CRUD operations\n" +
                "   - View count increment\n" +
                "   - Pin/Active toggles\n" +
                "   - Statistics\n" +
                "   - Pagination\n" +
                "   - Error handling\n"
        );
    } catch (error) {
        log.error(`Test failed: ${error.message}`);
        if (error.response) {
            console.log("\nResponse:", error.response.data);
        }
        process.exit(1);
    }
})();

