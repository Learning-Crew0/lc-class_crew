const mongoose = require("mongoose");
const Course = require("../models/course.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");
const {
    getFileUrl,
    deleteFileByUrl,
    BASE_UPLOAD_PATH,
} = require("../config/fileStorage");
const {
    getCategoryInfo,
    getPositionInfo,
    isValidCategory,
    isValidPosition,
} = require("../constants/categories");
const fs = require("fs");
const path = require("path");

/**
 * Helper function to move file from temp to courses folder
 * @param {string} tempUrl - URL pointing to a file in /uploads/temp/
 * @returns {string} - New URL pointing to /uploads/courses/
 */
const moveTempFileToCourses = (tempUrl) => {
    if (!tempUrl || !tempUrl.includes("/uploads/temp/")) {
        return tempUrl; // Not a temp file, return as is
    }

    try {
        // Extract filename from URL
        const filename = path.basename(tempUrl);

        // Construct file paths
        const tempPath = path.join(BASE_UPLOAD_PATH, "temp", filename);
        const coursesPath = path.join(BASE_UPLOAD_PATH, "courses", filename);

        // Check if temp file exists
        if (fs.existsSync(tempPath)) {
            // Move (rename) the file
            fs.renameSync(tempPath, coursesPath);

            // Return the new URL
            return getFileUrl("COURSES", filename);
        } else {
            console.warn(`Temp file not found: ${tempPath}`);
            return tempUrl; // File doesn't exist, return original URL
        }
    } catch (error) {
        console.error(`Error moving temp file: ${error.message}`);
        return tempUrl; // On error, return original URL
    }
};

const normalizeArrayFields = (data) => {
    const arrayFields = [
        "tags",
        "recommendedAudience",
        "targetAudience", // Handle targetAudience array field
        "whatYouWillLearn",
        "requirements",
        "promotion", // NEW: Handle promotion array field
    ];

    arrayFields.forEach((field) => {
        // Skip if field is undefined or null
        if (data[field] === undefined || data[field] === null) {
            return;
        }

        // If already an array, ensure no empty strings
        if (Array.isArray(data[field])) {
            data[field] = data[field].filter(Boolean);
            return;
        }

        // Only process strings
        if (typeof data[field] === "string") {
            // Handle empty string
            if (!data[field].trim()) {
                data[field] = [];
                return;
            }

            // Try JSON.parse first (handles stringified arrays like "[\"NEWEST\", \"ALL\"]")
            try {
                const parsed = JSON.parse(data[field]);
                data[field] = Array.isArray(parsed)
                    ? parsed.filter(Boolean)
                    : parsed
                      ? [parsed]
                      : [];
            } catch (e) {
                // Fall back to comma-split for simple strings like "tag1, tag2, tag3"
                data[field] = data[field]
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
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
        .populate("category", "title description order")
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
        // Try to get category info from constants (if slug) or database (if ObjectId)
        let categoryInfo = getCategoryInfo(normalizedData.category);
        
        // If not found in constants, try database lookup (ObjectId)
        if (!categoryInfo && mongoose.Types.ObjectId.isValid(normalizedData.category)) {
            const categoryDoc = await Category.findById(normalizedData.category).select('title');
            if (categoryDoc) {
                normalizedData.categoryInfo = {
                    title: categoryDoc.title,
                    id: categoryDoc._id.toString(),
                };
            }
        } else if (categoryInfo) {
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

    // Handle image uploads
    if (files?.mainImage) {
        // Image uploaded directly with the course creation request
        normalizedData.mainImage = getFileUrl(
            "COURSES",
            files.mainImage[0].filename
        );
        normalizedData.image = normalizedData.mainImage;
    } else if (normalizedData.mainImage) {
        // Image was uploaded separately to temp folder
        normalizedData.mainImage = moveTempFileToCourses(
            normalizedData.mainImage
        );
        normalizedData.image = normalizedData.mainImage;
    }

    if (files?.hoverImage) {
        // Image uploaded directly with the course creation request
        normalizedData.hoverImage = getFileUrl(
            "COURSES",
            files.hoverImage[0].filename
        );
    } else if (normalizedData.hoverImage) {
        // Image was uploaded separately to temp folder
        normalizedData.hoverImage = moveTempFileToCourses(
            normalizedData.hoverImage
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
        // Try to get category info from constants (if slug) or database (if ObjectId)
        let categoryInfo = getCategoryInfo(normalizedUpdates.category);
        
        // If not found in constants, try database lookup (ObjectId)
        if (!categoryInfo && mongoose.Types.ObjectId.isValid(normalizedUpdates.category)) {
            const categoryDoc = await Category.findById(normalizedUpdates.category).select('title');
            if (categoryDoc) {
                normalizedUpdates.categoryInfo = {
                    title: categoryDoc.title,
                    id: categoryDoc._id.toString(),
                };
            }
        } else if (categoryInfo) {
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

    // Handle image uploads
    if (files?.mainImage) {
        // Image uploaded directly with the course update request
        if (course.mainImage) {
            deleteFileByUrl(course.mainImage);
        }
        normalizedUpdates.mainImage = getFileUrl(
            "COURSES",
            files.mainImage[0].filename
        );
        normalizedUpdates.image = normalizedUpdates.mainImage;
    } else if (
        normalizedUpdates.mainImage &&
        normalizedUpdates.mainImage !== course.mainImage
    ) {
        // Image was uploaded separately to temp folder and is different from current image
        const newImageUrl = moveTempFileToCourses(normalizedUpdates.mainImage);
        if (newImageUrl !== normalizedUpdates.mainImage) {
            // Successfully moved from temp, delete old image
            if (course.mainImage) {
                deleteFileByUrl(course.mainImage);
            }
        }
        normalizedUpdates.mainImage = newImageUrl;
        normalizedUpdates.image = newImageUrl;
    }

    if (files?.hoverImage) {
        // Image uploaded directly with the course update request
        if (course.hoverImage) {
            deleteFileByUrl(course.hoverImage);
        }
        normalizedUpdates.hoverImage = getFileUrl(
            "COURSES",
            files.hoverImage[0].filename
        );
    } else if (
        normalizedUpdates.hoverImage &&
        normalizedUpdates.hoverImage !== course.hoverImage
    ) {
        // Image was uploaded separately to temp folder and is different from current image
        const newHoverUrl = moveTempFileToCourses(normalizedUpdates.hoverImage);
        if (newHoverUrl !== normalizedUpdates.hoverImage) {
            // Successfully moved from temp, delete old image
            if (course.hoverImage) {
                deleteFileByUrl(course.hoverImage);
            }
        }
        normalizedUpdates.hoverImage = newHoverUrl;
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

/**
 * Get courses with advanced filtering (Admin)
 * Supports filtering by category, position, status, promotion, refundEligible, etc.
 */
const getCoursesWithFilters = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    // Build filter object
    const filter = {};

    // Category filter (accepts both ObjectId and slug)
    if (query.category) {
        if (query.category.match(/^[0-9a-fA-F]{24}$/)) {
            // It's an ObjectId
            filter.category = query.category;
        } else {
            // It's a slug - find category by slug
            const category = await Category.findOne({ slug: query.category });
            if (category) {
                filter.category = category._id;
            }
        }
    }

    // Position filter
    if (query.position) {
        filter.position = query.position;
    }

    // Current status filter
    if (query.status || query.currentStatus) {
        filter.currentStatus = query.status || query.currentStatus;
    }

    // Promotion filter (array field - check if promotion includes the value)
    if (query.promotion) {
        filter.promotion = query.promotion;
    }

    // Refund eligible filter
    if (query.refundEligible !== undefined) {
        filter.refundEligible = query.refundEligible === "true";
    }

    // Display tag filter
    if (query.displayTag) {
        filter.displayTag = query.displayTag;
    }

    // Active status filter
    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }

    // Search by course name
    if (query.search) {
        filter.$or = [
            { title: { $regex: query.search, $options: "i" } },
            {
                courseNameFormatted: {
                    $regex: query.search,
                    $options: "i",
                },
            },
        ];
    }

    // Determine sort order based on displayTag
    let sortOrder = { createdAt: -1 }; // Default: newest first

    if (query.displayTag === "NEWEST") {
        sortOrder = { "thumbnailOrder.newest": 1, createdAt: -1 };
    } else if (query.displayTag === "POPULAR") {
        sortOrder = { "thumbnailOrder.popular": 1, enrollmentCount: -1 };
    } else if (query.displayTag === "ALL") {
        sortOrder = { "thumbnailOrder.all": 1, createdAt: -1 };
    }

    // Execute query
    const courses = await Course.find(filter)
        .populate("category", "title slug koreanName englishName")
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Course.countDocuments(filter);

    return {
        courses,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Reorder course thumbnails within a category (NEWEST, POPULAR, ALL)
 */
const reorderCourseThumbnails = async (category, reorders) => {
    // Validate category
    const validCategories = ["newest", "popular", "all"];
    if (!validCategories.includes(category)) {
        throw ApiError.badRequest(
            "Invalid category. Must be newest, popular, or all"
        );
    }

    // Update each course's thumbnail order
    const updatePromises = reorders.map(({ courseId, order }) => {
        return Course.findByIdAndUpdate(
            courseId,
            { [`thumbnailOrder.${category}`]: order },
            { new: true, runValidators: true }
        );
    });

    const updatedCourses = await Promise.all(updatePromises);

    // Filter out any null results (course not found)
    const validCourses = updatedCourses.filter((course) => course !== null);

    if (validCourses.length !== reorders.length) {
        throw ApiError.notFound("Some courses were not found");
    }

    return {
        category,
        updatedCount: validCourses.length,
        courses: validCourses,
    };
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
    getCoursesWithFilters,
    reorderCourseThumbnails,
};
