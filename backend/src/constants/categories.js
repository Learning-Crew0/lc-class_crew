/**
 * Category & Position Constants
 * These are the 5 main course categories and 9 position/level types
 */

const CATEGORIES = [
    {
        slug: "leadership",
        koreanName: "리더십/직급/계층",
        englishName: "Leadership/Position/Level",
        order: 1,
    },
    {
        slug: "business-skills",
        koreanName: "비즈니스 스킬",
        englishName: "Business Skills",
        order: 2,
    },
    {
        slug: "dx",
        koreanName: "DX",
        englishName: "Digital Transformation",
        order: 3,
    },
    {
        slug: "life-career",
        koreanName: "라이프/커리어",
        englishName: "Life & Career",
        order: 4,
    },
    {
        slug: "special",
        koreanName: "스페셜",
        englishName: "Special",
        order: 5,
    },
];

const POSITIONS = [
    {
        slug: "executive",
        koreanName: "임원",
        englishName: "Executive",
        order: 1,
    },
    {
        slug: "manager",
        koreanName: "차부장",
        englishName: "Manager/Deputy Manager",
        order: 2,
    },
    {
        slug: "assistant-manager",
        koreanName: "과장",
        englishName: "Assistant Manager",
        order: 3,
    },
    {
        slug: "associate",
        koreanName: "대리",
        englishName: "Associate",
        order: 4,
    },
    {
        slug: "staff",
        koreanName: "사원",
        englishName: "Staff",
        order: 5,
    },
    {
        slug: "leader",
        koreanName: "직책자",
        englishName: "Team Leader",
        order: 6,
    },
    {
        slug: "new-leader",
        koreanName: "신임 직책자",
        englishName: "New Team Leader",
        order: 7,
    },
    {
        slug: "new-hire",
        koreanName: "신규 입사자",
        englishName: "New Hire",
        order: 8,
    },
    {
        slug: "other",
        koreanName: "기타",
        englishName: "Other",
        order: 9,
    },
];

// Create maps for quick lookup
const CATEGORY_MAP = CATEGORIES.reduce((map, category) => {
    map[category.slug] = category;
    return map;
}, {});

const POSITION_MAP = POSITIONS.reduce((map, position) => {
    map[position.slug] = position;
    return map;
}, {});

// Extract slug arrays for enum validation
const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
const POSITION_SLUGS = POSITIONS.map((p) => p.slug);

/**
 * Get category info by slug
 * @param {string} slug - Category slug
 * @returns {Object|null} Category object or null
 */
const getCategoryInfo = (slug) => {
    return CATEGORY_MAP[slug] || null;
};

/**
 * Get position info by slug
 * @param {string} slug - Position slug
 * @returns {Object|null} Position object or null
 */
const getPositionInfo = (slug) => {
    return POSITION_MAP[slug] || null;
};

/**
 * Validate category slug
 * @param {string} slug - Category slug to validate
 * @returns {boolean} True if valid
 */
const isValidCategory = (slug) => {
    return CATEGORY_SLUGS.includes(slug);
};

/**
 * Validate position slug
 * @param {string} slug - Position slug to validate
 * @returns {boolean} True if valid
 */
const isValidPosition = (slug) => {
    return POSITION_SLUGS.includes(slug);
};

module.exports = {
    CATEGORIES,
    POSITIONS,
    CATEGORY_MAP,
    POSITION_MAP,
    CATEGORY_SLUGS,
    POSITION_SLUGS,
    getCategoryInfo,
    getPositionInfo,
    isValidCategory,
    isValidPosition,
};

