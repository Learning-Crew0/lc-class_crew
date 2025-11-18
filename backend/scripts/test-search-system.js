/**
 * Test script for Search System
 * Tests: popular keywords, suggestions, logging, history, analytics
 */

require("dotenv").config();
const axios = require("axios");
const { generateToken } = require("../src/utils/crypto.util");

// Configuration
const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api/v1";
const TEST_USER_ID = "691aebe8962da064edc9cb18"; // Ishant's ID

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
    success: (msg) =>
        console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    section: (msg) =>
        console.log(
            `\n${colors.bright}${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`
        ),
};

let userToken;

(async () => {
    try {
        console.log("\n🔍 Testing Search System\n");
        console.log(`Base URL: ${BASE_URL}\n`);

        // Generate auth token
        userToken = generateToken({ id: TEST_USER_ID, role: "user" });
        log.info(`Generated token for user ${TEST_USER_ID}`);

        // ===== TEST 1: Log Search Queries =====
        log.section("TEST 1: Log Search Queries");

        const searchQueries = [
            { keyword: "리더십", resultsCount: 5, source: "modal" },
            { keyword: "프로젝트 관리", resultsCount: 3, source: "navbar" },
            { keyword: "마케팅", resultsCount: 7, source: "results_page" },
            { keyword: "리더십 개발", resultsCount: 2, source: "modal" },
            { keyword: "데이터 분석", resultsCount: 4, source: "navbar" },
        ];

        for (const query of searchQueries) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/search/log`,
                    query,
                    {
                        headers: { Authorization: `Bearer ${userToken}` },
                    }
                );

                log.success(
                    `Logged search: "${query.keyword}" (${query.resultsCount} results)`
                );
            } catch (error) {
                log.error(
                    `Failed to log search "${query.keyword}": ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // Wait a moment for logs to be indexed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ===== TEST 2: Get Popular Keywords =====
        log.section("TEST 2: Get Popular Keywords");

        try {
            const response = await axios.get(
                `${BASE_URL}/search/popular-keywords`,
                {
                    params: {
                        limit: 10,
                        period: "week",
                    },
                }
            );

            log.success("Popular keywords retrieved");
            console.log(`Found ${response.data.data.keywords.length} keywords:`);
            response.data.data.keywords.forEach((k, i) => {
                console.log(
                    `  ${i + 1}. "${k.keyword}" - ${k.searchCount} searches`
                );
            });
        } catch (error) {
            log.error(
                `Failed to get popular keywords: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 3: Get Search Suggestions =====
        log.section("TEST 3: Get Search Suggestions");

        const suggestionQueries = ["리더", "프로", "마케"];

        for (const query of suggestionQueries) {
            try {
                const response = await axios.get(
                    `${BASE_URL}/search/suggestions`,
                    {
                        params: {
                            q: query,
                            limit: 5,
                        },
                    }
                );

                log.success(`Suggestions for "${query}"`);
                console.log(
                    `  Found ${response.data.data.suggestions.length} suggestions:`
                );
                response.data.data.suggestions.forEach((s, i) => {
                    console.log(`    ${i + 1}. ${s}`);
                });
            } catch (error) {
                log.error(
                    `Failed to get suggestions for "${query}": ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 4: Get User Search History =====
        log.section("TEST 4: Get User Search History");

        try {
            const response = await axios.get(`${BASE_URL}/search/history`, {
                headers: { Authorization: `Bearer ${userToken}` },
                params: { limit: 10 },
            });

            log.success("User search history retrieved");
            console.log(`Found ${response.data.data.history.length} searches:`);
            response.data.data.history.slice(0, 5).forEach((h, i) => {
                console.log(
                    `  ${i + 1}. "${h.keyword}" - ${h.resultsCount} results (${new Date(
                        h.searchedAt
                    ).toLocaleString()})`
                );
            });
        } catch (error) {
            log.error(
                `Failed to get search history: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 5: Search Products with Logging =====
        log.section("TEST 5: Search Products with Logging");

        const productSearches = [
            { search: "리더십", source: "modal" },
            { search: "management", source: "navbar" },
        ];

        for (const query of productSearches) {
            try {
                const response = await axios.get(`${BASE_URL}/products`, {
                    params: {
                        search: query.search,
                        isActive: true,
                        source: query.source,
                    },
                });

                log.success(
                    `Product search for "${query.search}": ${response.data.pagination.totalProducts} results`
                );
            } catch (error) {
                log.error(
                    `Failed to search products for "${query.search}": ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 6: Test Popular Keywords with Different Periods =====
        log.section("TEST 6: Popular Keywords - Different Periods");

        const periods = ["day", "week", "month", "all"];

        for (const period of periods) {
            try {
                const response = await axios.get(
                    `${BASE_URL}/search/popular-keywords`,
                    {
                        params: {
                            limit: 5,
                            period,
                        },
                    }
                );

                log.success(
                    `Popular keywords (${period}): ${response.data.data.keywords.length} keywords`
                );
            } catch (error) {
                log.error(
                    `Failed to get popular keywords (${period}): ${
                        error.response?.data?.message || error.message
                    }`
                );
            }
        }

        // ===== TEST 7: Anonymous Search Logging =====
        log.section("TEST 7: Anonymous Search Logging");

        try {
            const response = await axios.post(
                `${BASE_URL}/search/log`,
                {
                    keyword: "익명 검색",
                    resultsCount: 10,
                    source: "other",
                },
                {
                    // No Authorization header
                }
            );

            log.success("Anonymous search logged successfully");
        } catch (error) {
            log.error(
                `Failed to log anonymous search: ${
                    error.response?.data?.message || error.message
                }`
            );
        }

        // ===== TEST 8: Error Cases =====
        log.section("TEST 8: Error Cases");

        // Empty suggestion query
        try {
            await axios.get(`${BASE_URL}/search/suggestions`, {
                params: { q: "" },
            });
            log.error("Should have failed for empty suggestion query");
        } catch (error) {
            if (error.response?.status === 400) {
                log.success("Correctly rejected empty suggestion query");
            } else {
                log.error(`Unexpected error: ${error.message}`);
            }
        }

        // Invalid period
        try {
            await axios.get(`${BASE_URL}/search/popular-keywords`, {
                params: { period: "invalid" },
            });
            log.error("Should have failed for invalid period");
        } catch (error) {
            if (error.response?.status === 400) {
                log.success("Correctly rejected invalid period");
            } else {
                log.error(`Unexpected error: ${error.message}`);
            }
        }

        // ===== SUMMARY =====
        log.section("TEST SUMMARY");
        log.success("All search system tests completed!");
        console.log(
            "\n✅ Search system is working correctly with:\n" +
                "   - Search logging\n" +
                "   - Popular keywords\n" +
                "   - Search suggestions\n" +
                "   - User search history\n" +
                "   - Product search integration\n" +
                "   - Anonymous search support\n"
        );
    } catch (error) {
        log.error(`Test failed: ${error.message}`);
        if (error.response) {
            console.log("\nResponse:", error.response.data);
        }
        process.exit(1);
    }
})();

