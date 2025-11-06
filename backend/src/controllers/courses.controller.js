const courseService = require("../services/course.service");
const {
    successResponse,
    paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all courses
 */
const getAllCourses = async (req, res, next) => {
    try {
        const { courses, pagination } = await courseService.getAllCourses(
            req.query
        );
        return paginatedResponse(
            res,
            courses,
            pagination,
            "Courses retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get course by ID or slug
 */
const getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        return successResponse(res, course, "Course retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Create course
 */
const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.body);
        return successResponse(res, course, "Course created successfully", 201);
    } catch (error) {
        next(error);
    }
};

/**
 * Update course
 */
const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            req.body
        );
        return successResponse(res, course, "Course updated successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Delete course
 */
const deleteCourse = async (req, res, next) => {
    try {
        const result = await courseService.deleteCourse(req.params.id);
        return successResponse(res, result, "Course deleted successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle publish status
 */
const togglePublish = async (req, res, next) => {
    try {
        const course = await courseService.togglePublishStatus(req.params.id);
        return successResponse(
            res,
            course,
            "Course status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get featured courses
 */
const getFeatured = async (req, res, next) => {
    try {
        const courses = await courseService.getFeaturedCourses(req.query.limit);
        return successResponse(
            res,
            courses,
            "Featured courses retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    getFeatured,
};
