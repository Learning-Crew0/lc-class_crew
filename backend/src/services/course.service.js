const Course = require("../models/course.model");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");

/**
 * Get all courses with pagination and filters
 */
const getAllCourses = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};

    // Public routes should only see published courses
    if (query.publicOnly) {
        filter.isPublished = true;
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.level) {
        filter.level = query.level;
    }

    if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === "true";
    }

    if (query.search) {
        filter.$text = { $search: query.search };
    }

    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    const courses = await Course.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments(filter);

    return {
        courses,
        pagination: createPaginationMeta(page, limit, total),
    };
};

/**
 * Get course by ID or slug
 */
const getCourseById = async (identifier) => {
    let course;

    // Check if identifier is a valid ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        course = await Course.findById(identifier);
    } else {
        course = await Course.findOne({ slug: identifier });
    }

    if (!course) {
        throw new Error("Course not found");
    }

    return course;
};

/**
 * Create a new course
 */
const createCourse = async (courseData) => {
    const course = await Course.create(courseData);
    return course;
};

/**
 * Update course
 */
const updateCourse = async (courseId, updates) => {
    const course = await Course.findByIdAndUpdate(courseId, updates, {
        new: true,
        runValidators: true,
    });

    if (!course) {
        throw new Error("Course not found");
    }

    return course;
};

/**
 * Delete course
 */
const deleteCourse = async (courseId) => {
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    return { message: "Course deleted successfully" };
};

/**
 * Toggle course published status
 */
const togglePublishStatus = async (courseId) => {
    const course = await Course.findById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    course.isPublished = !course.isPublished;
    await course.save();

    return course;
};

/**
 * Get featured courses
 */
const getFeaturedCourses = async (limit = 6) => {
    const courses = await Course.find({
        isPublished: true,
        isFeatured: true,
    })
        .sort({ enrollmentCount: -1 })
        .limit(limit);

    return courses;
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublishStatus,
    getFeaturedCourses,
};
