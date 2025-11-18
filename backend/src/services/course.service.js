const Course = require("../models/course.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");
const {
    getCategoryInfo,
    getPositionInfo,
    isValidCategory,
    isValidPosition,
} = require("../constants/categories");

const normalizeArrayFields = (data) => {
    const arrayFields = [
        "tags",
        "recommendedAudience",
        "whatYouWillLearn",
        "requirements",
    ];

    arrayFields.forEach((field) => {
        if (data[field]) {
            if (typeof data[field] === "string") {
                // Try JSON.parse first (handles stringified arrays like "[\"NEWEST\", \"ALL\"]")
                try {
                    const parsed = JSON.parse(data[field]);
                    data[field] = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    // Fall back to comma-split for simple strings like "tag1, tag2, tag3"
                    data[field] = data[field]
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                }
            }
        }
    });

    if (data.learningGoals) {
        if (typeof data.learningGoals === "string") {
            try {
                data.learningGoals = JSON.parse(data.learningGoals);
            } catch (e) {
                data.learningGoals = data.learningGoals
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        }
    }

    return data;
};

const getAllCourses = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};

    if (query.category) {
        filter.category = query.category;
    }

    if (query.level && query.level !== "all") {
        filter.level = query.level;
    }

    if (query.search) {
        filter.$text = { $search: query.search };
    }

    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }

    if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === "true";
    }

    // Filter by displayTag (NEWEST, POPULAR, ALL)
    if (query.displayTag && query.displayTag !== "ALL") {
        filter.displayTag = query.displayTag;
    }

    const courses = await Course.find(filter)
        .populate("category", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments(filter);

    return {
        courses,
        pagination: createPaginationMeta(page, limit, total),
    };
};

const getCourseById = async (courseId, includeRelated = false) => {
    let query = Course.findById(courseId).populate(
        "category",
        "title description"
    );

    if (includeRelated) {
        query = query
            .populate("trainingSchedules")
            .populate("curriculum")
            .populate("instructors")
            .populate({ path: "promotions", match: { isActive: true } })
            .populate({ path: "reviews", match: { isApproved: true } })
            .populate("notice");
    }

    const course = await query;

    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    return course;
};

const createCourse = async (courseData, files) => {
    const normalizedData = normalizeArrayFields(courseData);

    // Validate category and position (done by Joi validator already)
    // Auto-populate categoryInfo and positionInfo
    if (normalizedData.category) {
        const categoryInfo = getCategoryInfo(normalizedData.category);
        if (categoryInfo) {
            normalizedData.categoryInfo = {
                slug: categoryInfo.slug,
                koreanName: categoryInfo.koreanName,
                englishName: categoryInfo.englishName,
            };
        }
    }

    if (normalizedData.position) {
        const positionInfo = getPositionInfo(normalizedData.position);
        if (positionInfo) {
            normalizedData.positionInfo = {
                slug: positionInfo.slug,
                koreanName: positionInfo.koreanName,
                englishName: positionInfo.englishName,
            };
        }
    }

    if (files?.mainImage) {
        normalizedData.mainImage = getFileUrl(
            "COURSES",
            files.mainImage[0].filename
        );
        normalizedData.image = normalizedData.mainImage;
    }

    if (files?.hoverImage) {
        normalizedData.hoverImage = getFileUrl(
            "COURSES",
            files.hoverImage[0].filename
        );
    }

    const course = await Course.create(normalizedData);

    return course;
};

const updateCourse = async (courseId, updates, files) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const normalizedUpdates = normalizeArrayFields(updates);

    // Auto-populate categoryInfo if category is being updated
    if (normalizedUpdates.category) {
        const categoryInfo = getCategoryInfo(normalizedUpdates.category);
        if (categoryInfo) {
            normalizedUpdates.categoryInfo = {
                slug: categoryInfo.slug,
                koreanName: categoryInfo.koreanName,
                englishName: categoryInfo.englishName,
            };
        }
    }

    // Auto-populate positionInfo if position is being updated
    if (normalizedUpdates.position) {
        const positionInfo = getPositionInfo(normalizedUpdates.position);
        if (positionInfo) {
            normalizedUpdates.positionInfo = {
                slug: positionInfo.slug,
                koreanName: positionInfo.koreanName,
                englishName: positionInfo.englishName,
            };
        }
    }

    if (files?.mainImage) {
        if (course.mainImage) {
            deleteFileByUrl(course.mainImage);
        }
        normalizedUpdates.mainImage = getFileUrl(
            "COURSES",
            files.mainImage[0].filename
        );
        normalizedUpdates.image = normalizedUpdates.mainImage;
    }

    if (files?.hoverImage) {
        if (course.hoverImage) {
            deleteFileByUrl(course.hoverImage);
        }
        normalizedUpdates.hoverImage = getFileUrl(
            "COURSES",
            files.hoverImage[0].filename
        );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        normalizedUpdates,
        {
            new: true,
            runValidators: true,
        }
    );

    return updatedCourse;
};

const deleteCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    if (course.enrollmentCount > 0) {
        throw ApiError.badRequest("수강생이 있는 코스는 삭제할 수 없습니다");
    }

    if (course.mainImage) {
        deleteFileByUrl(course.mainImage);
    }
    if (course.hoverImage) {
        deleteFileByUrl(course.hoverImage);
    }

    await Course.findByIdAndDelete(courseId);

    return { message: "코스가 성공적으로 삭제되었습니다" };
};

/**
 * Get courses by category slug (for navbar filtering)
 * @param {string} categorySlug - Category slug
 * @param {Object} query - Query parameters (page, limit, sortBy, order)
 * @returns {Object} Courses and pagination
 */
const getCoursesByCategory = async (categorySlug, query = {}) => {
    // Validate category
    if (!isValidCategory(categorySlug)) {
        throw ApiError.badRequest(`Invalid category: ${categorySlug}`);
    }

    const { page, limit, skip } = getPaginationParams(query);
    const { sortBy = "createdAt", order = "desc" } = query;

    // Build filter
    const filter = {
        category: categorySlug,
        isActive: true, // Only show active courses to public
    };

    // Build sort
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Query courses
    const courses = await Course.find(filter)
        .populate("trainingSchedules")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments(filter);

    // Get category info for response
    const categoryInfo = getCategoryInfo(categorySlug);

    return {
        courses,
        pagination: createPaginationMeta(page, limit, total),
        categoryInfo,
    };
};

/**
 * Search/filter courses by category and/or position (advanced filtering)
 * @param {Object} filters - { category, position, page, limit, sortBy, order }
 * @returns {Object} Courses and pagination
 */
const searchCourses = async (filters = {}) => {
    const {
        category,
        position,
        displayTag,
        sortBy = "createdAt",
        order = "desc",
    } = filters;
    const { page, limit, skip } = getPaginationParams(filters);

    // Build filter
    const filter = {
        isActive: true, // Only show active courses
    };

    // Validate and add category filter
    if (category) {
        if (!isValidCategory(category)) {
            throw ApiError.badRequest(`Invalid category: ${category}`);
        }
        filter.category = category;
    }

    // Validate and add position filter
    if (position) {
        if (!isValidPosition(position)) {
            throw ApiError.badRequest(`Invalid position: ${position}`);
        }
        filter.position = position;
    }

    // Add displayTag filter (NEWEST, POPULAR, ALL)
    if (displayTag && displayTag !== "ALL") {
        filter.displayTag = displayTag;
    }

    // Build sort
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Query courses
    const courses = await Course.find(filter)
        .populate("trainingSchedules")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments(filter);

    // Get applied filter info
    const appliedFilters = {};
    if (category) {
        const categoryInfo = getCategoryInfo(category);
        appliedFilters.category = category;
        appliedFilters.categoryName = categoryInfo?.koreanName || category;
    }
    if (position) {
        const positionInfo = getPositionInfo(position);
        appliedFilters.position = position;
        appliedFilters.positionName = positionInfo?.koreanName || position;
    }

    return {
        courses,
        pagination: createPaginationMeta(page, limit, total),
        appliedFilters,
    };
};

/**
 * Helper function to populate category and position info
 * @param {Object} data - Course data with category and position slugs
 * @returns {Object} Data with populated categoryInfo and positionInfo
 */
const populateCategoryAndPositionInfo = (data) => {
    if (data.category) {
        const categoryInfo = getCategoryInfo(data.category);
        if (categoryInfo) {
            data.categoryInfo = {
                slug: categoryInfo.slug,
                koreanName: categoryInfo.koreanName,
                englishName: categoryInfo.englishName,
            };
        }
    }

    if (data.position) {
        const positionInfo = getPositionInfo(data.position);
        if (positionInfo) {
            data.positionInfo = {
                slug: positionInfo.slug,
                koreanName: positionInfo.koreanName,
                englishName: positionInfo.englishName,
            };
        }
    }

    return data;
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByCategory,
    searchCourses,
    populateCategoryAndPositionInfo,
};
