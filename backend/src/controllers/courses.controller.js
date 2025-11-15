const courseService = require("../services/course.service");
const trainingScheduleService = require("../services/trainingSchedule.service");
const curriculumService = require("../services/curriculum.service");
const instructorService = require("../services/instructor.service");
const promotionService = require("../services/promotion.service");
const courseReviewService = require("../services/courseReview.service");
const courseNoticeService = require("../services/courseNotice.service");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");

const getAllCourses = asyncHandler(async (req, res) => {
    const result = await courseService.getAllCourses(req.query);
    return successResponse(res, result, "코스 목록을 성공적으로 조회했습니다");
});

const getCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id, true);
    return successResponse(
        res,
        course,
        "코스 상세 정보를 성공적으로 조회했습니다"
    );
});

const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body, req.files);
    return successResponse(
        res,
        course,
        "코스가 성공적으로 생성되었습니다",
        201
    );
});

const updateCourse = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(
        req.params.id,
        req.body,
        req.files
    );
    return successResponse(res, course, "코스가 성공적으로 업데이트되었습니다");
});

const deleteCourse = asyncHandler(async (req, res) => {
    const result = await courseService.deleteCourse(req.params.id);
    return successResponse(res, result, result.message);
});

const getTrainingSchedules = asyncHandler(async (req, res) => {
    const schedules = await trainingScheduleService.getAllSchedulesForCourse(
        req.params.courseId
    );
    return successResponse(
        res,
        schedules,
        "일정 목록을 성공적으로 조회했습니다"
    );
});

const createTrainingSchedule = asyncHandler(async (req, res) => {
    const schedule = await trainingScheduleService.createSchedule(
        req.params.courseId,
        req.body
    );
    return successResponse(
        res,
        schedule,
        "일정이 성공적으로 생성되었습니다",
        201
    );
});

const updateTrainingSchedule = asyncHandler(async (req, res) => {
    const schedule = await trainingScheduleService.updateSchedule(
        req.params.scheduleId,
        req.body
    );
    return successResponse(
        res,
        schedule,
        "일정이 성공적으로 업데이트되었습니다"
    );
});

const deleteTrainingSchedule = asyncHandler(async (req, res) => {
    const result = await trainingScheduleService.deleteSchedule(
        req.params.scheduleId
    );
    return successResponse(res, result, result.message);
});

const getCurriculum = asyncHandler(async (req, res) => {
    const curriculum = await curriculumService.getCurriculumByCourse(
        req.params.courseId
    );
    return successResponse(
        res,
        curriculum,
        "커리큘럼을 성공적으로 조회했습니다"
    );
});

const upsertCurriculum = asyncHandler(async (req, res) => {
    const curriculum = await curriculumService.upsertCurriculum(
        req.params.courseId,
        req.body
    );
    return successResponse(
        res,
        curriculum,
        "커리큘럼이 성공적으로 저장되었습니다"
    );
});

const getInstructors = asyncHandler(async (req, res) => {
    const instructors = await instructorService.getInstructorsByCourse(
        req.params.courseId
    );
    return successResponse(
        res,
        instructors,
        "강사 정보를 성공적으로 조회했습니다"
    );
});

const createInstructor = asyncHandler(async (req, res) => {
    const instructor = await instructorService.createInstructor(
        req.params.courseId,
        req.body,
        req.file
    );
    return successResponse(
        res,
        instructor,
        "강사 정보가 성공적으로 생성되었습니다",
        201
    );
});

const updateInstructor = asyncHandler(async (req, res) => {
    const instructor = await instructorService.updateInstructor(
        req.params.instructorId,
        req.body,
        req.file
    );
    return successResponse(
        res,
        instructor,
        "강사 정보가 성공적으로 업데이트되었습니다"
    );
});

const deleteInstructor = asyncHandler(async (req, res) => {
    const result = await instructorService.deleteInstructor(
        req.params.instructorId
    );
    return successResponse(res, result, result.message);
});

const getPromotions = asyncHandler(async (req, res) => {
    const promotions = await promotionService.getPromotionsByCourse(
        req.params.courseId
    );
    return successResponse(
        res,
        promotions,
        "프로모션 목록을 성공적으로 조회했습니다"
    );
});

const createPromotion = asyncHandler(async (req, res) => {
    const promotion = await promotionService.createPromotion(
        req.params.courseId,
        req.body,
        req.files
    );
    return successResponse(
        res,
        promotion,
        "프로모션이 성공적으로 생성되었습니다",
        201
    );
});

const updatePromotion = asyncHandler(async (req, res) => {
    const promotion = await promotionService.updatePromotion(
        req.params.promotionId,
        req.body
    );
    return successResponse(
        res,
        promotion,
        "프로모션이 성공적으로 업데이트되었습니다"
    );
});

const deletePromotion = asyncHandler(async (req, res) => {
    const result = await promotionService.deletePromotion(
        req.params.promotionId,
        req.query.imageUrl
    );
    return successResponse(res, result, result.message);
});

const getReviews = asyncHandler(async (req, res) => {
    const reviews = await courseReviewService.getReviewsByCourse(
        req.params.courseId
    );
    return successResponse(res, reviews, "리뷰 목록을 성공적으로 조회했습니다");
});

const createReview = asyncHandler(async (req, res) => {
    const review = await courseReviewService.createReview(
        req.params.courseId,
        req.body,
        req.user?.id,
        req.file
    );
    return successResponse(
        res,
        review,
        "리뷰가 성공적으로 작성되었습니다",
        201
    );
});

const updateReview = asyncHandler(async (req, res) => {
    const review = await courseReviewService.updateReview(
        req.params.reviewId,
        req.body
    );
    return successResponse(res, review, "리뷰가 성공적으로 업데이트되었습니다");
});

const deleteReview = asyncHandler(async (req, res) => {
    const result = await courseReviewService.deleteReview(req.params.reviewId);
    return successResponse(res, result, result.message);
});

const getNotice = asyncHandler(async (req, res) => {
    const notice = await courseNoticeService.getNoticeByCourse(
        req.params.courseId
    );
    return successResponse(res, notice, "공지를 성공적으로 조회했습니다");
});

const upsertNotice = asyncHandler(async (req, res) => {
    const notice = await courseNoticeService.upsertNotice(
        req.params.courseId,
        req.body,
        req.file
    );
    return successResponse(res, notice, "공지가 성공적으로 저장되었습니다");
});

/**
 * Get courses by category (navbar filtering)
 * GET /api/v1/courses/category/:slug
 */
const getCoursesByCategory = asyncHandler(async (req, res) => {
    const result = await courseService.getCoursesByCategory(
        req.params.slug,
        req.query
    );
    return successResponse(
        res,
        result,
        "카테고리별 코스를 성공적으로 조회했습니다"
    );
});

/**
 * Search/filter courses by category and/or position
 * GET /api/v1/courses/search
 */
const searchCourses = asyncHandler(async (req, res) => {
    const result = await courseService.searchCourses(req.query);
    return successResponse(
        res,
        result,
        "코스 검색을 성공적으로 완료했습니다"
    );
});

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getTrainingSchedules,
    createTrainingSchedule,
    updateTrainingSchedule,
    deleteTrainingSchedule,
    getCurriculum,
    upsertCurriculum,
    getInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getNotice,
    upsertNotice,
    getCoursesByCategory,
    searchCourses,
};
