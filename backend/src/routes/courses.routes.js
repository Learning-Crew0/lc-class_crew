const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");
const categoryController = require("../controllers/category.controller");
const enrollmentController = require("../controllers/enrollment.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
    courseUploads,
    promotionUploads,
    instructorUploads,
    noticeUploads,
    reviewUploads,
    categoryUploads,
} = require("../middlewares/upload.middleware");
const {
    createCourseSchema,
    updateCourseSchema,
} = require("../validators/course.validators");
const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validators/category.validators");
const {
    createTrainingScheduleSchema,
    updateTrainingScheduleSchema,
} = require("../validators/trainingSchedule.validators");
const {
    createCurriculumSchema,
    updateCurriculumSchema,
} = require("../validators/curriculum.validators");
const {
    createInstructorSchema,
    updateInstructorSchema,
} = require("../validators/instructor.validators");
const {
    createCourseReviewSchema,
    updateCourseReviewSchema,
} = require("../validators/courseReview.validators");
const {
    createCourseNoticeSchema,
    updateCourseNoticeSchema,
} = require("../validators/courseNotice.validators");
const {
    createEnrollmentSchema,
    updateEnrollmentStatusSchema,
    updateEnrollmentProgressSchema,
    requestRefundSchema,
    processRefundSchema,
} = require("../validators/enrollment.validators");

router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.get("/categories/:id/courses", categoryController.getCategoryWithCourses);

router.post(
    "/categories",
    authenticate,
    isAdmin,
    validate(createCategorySchema),
    categoryController.createCategory
);

router.put(
    "/categories/:id",
    authenticate,
    isAdmin,
    validate(updateCategorySchema),
    categoryController.updateCategory
);

router.delete(
    "/categories/:id",
    authenticate,
    isAdmin,
    categoryController.deleteCategory
);

router.get("/courses", coursesController.getAllCourses);
router.get("/courses/:id", coursesController.getCourseById);

router.post(
    "/courses",
    authenticate,
    isAdmin,
    courseUploads,
    validate(createCourseSchema),
    coursesController.createCourse
);

router.put(
    "/courses/:id",
    authenticate,
    isAdmin,
    courseUploads,
    validate(updateCourseSchema),
    coursesController.updateCourse
);

router.delete(
    "/courses/:id",
    authenticate,
    isAdmin,
    coursesController.deleteCourse
);

router.get(
    "/courses/:courseId/training-schedules",
    coursesController.getTrainingSchedules
);

router.post(
    "/courses/:courseId/training-schedules",
    authenticate,
    isAdmin,
    validate(createTrainingScheduleSchema),
    coursesController.createTrainingSchedule
);

router.put(
    "/courses/:courseId/training-schedules/:scheduleId",
    authenticate,
    isAdmin,
    validate(updateTrainingScheduleSchema),
    coursesController.updateTrainingSchedule
);

router.delete(
    "/courses/:courseId/training-schedules/:scheduleId",
    authenticate,
    isAdmin,
    coursesController.deleteTrainingSchedule
);

router.post(
    "/courses/:courseId/training-schedules/:scheduleId/enroll",
    authenticate,
    validate(createEnrollmentSchema),
    enrollmentController.enrollInSchedule
);

router.get("/courses/:courseId/curriculum", coursesController.getCurriculum);

router.post(
    "/courses/:courseId/curriculum",
    authenticate,
    isAdmin,
    validate(createCurriculumSchema),
    coursesController.upsertCurriculum
);

router.get("/courses/:courseId/instructors", coursesController.getInstructors);

router.post(
    "/courses/:courseId/instructors",
    authenticate,
    isAdmin,
    instructorUploads,
    validate(createInstructorSchema),
    coursesController.createInstructor
);

router.put(
    "/courses/:courseId/instructors/:instructorId",
    authenticate,
    isAdmin,
    instructorUploads,
    validate(updateInstructorSchema),
    coursesController.updateInstructor
);

router.delete(
    "/courses/:courseId/instructors/:instructorId",
    authenticate,
    isAdmin,
    coursesController.deleteInstructor
);

router.get("/courses/:courseId/promotions", coursesController.getPromotions);

router.post(
    "/courses/:courseId/promotions",
    authenticate,
    isAdmin,
    promotionUploads,
    coursesController.createPromotion
);

router.put(
    "/courses/:courseId/promotions/:promotionId",
    authenticate,
    isAdmin,
    coursesController.updatePromotion
);

router.delete(
    "/courses/:courseId/promotions/:promotionId",
    authenticate,
    isAdmin,
    coursesController.deletePromotion
);

router.get("/courses/:courseId/reviews", coursesController.getReviews);

router.post(
    "/courses/:courseId/reviews",
    reviewUploads,
    validate(createCourseReviewSchema),
    coursesController.createReview
);

router.put(
    "/courses/:courseId/reviews/:reviewId",
    authenticate,
    isAdmin,
    validate(updateCourseReviewSchema),
    coursesController.updateReview
);

router.delete(
    "/courses/:courseId/reviews/:reviewId",
    authenticate,
    isAdmin,
    coursesController.deleteReview
);

router.get("/courses/:courseId/notice", coursesController.getNotice);

router.post(
    "/courses/:courseId/notice",
    authenticate,
    isAdmin,
    noticeUploads,
    validate(createCourseNoticeSchema),
    coursesController.upsertNotice
);

router.get(
    "/enrollments",
    authenticate,
    enrollmentController.getMyEnrollments
);

router.get(
    "/enrollments/:id",
    authenticate,
    enrollmentController.getEnrollmentById
);

router.patch(
    "/enrollments/:id/status",
    authenticate,
    isAdmin,
    validate(updateEnrollmentStatusSchema),
    enrollmentController.updateEnrollmentStatus
);

router.patch(
    "/enrollments/:id/progress",
    authenticate,
    validate(updateEnrollmentProgressSchema),
    enrollmentController.updateEnrollmentProgress
);

router.post(
    "/enrollments/:id/refund",
    authenticate,
    validate(requestRefundSchema),
    enrollmentController.requestRefund
);

router.patch(
    "/enrollments/:id/refund/process",
    authenticate,
    isAdmin,
    validate(processRefundSchema),
    enrollmentController.processRefund
);

router.delete(
    "/enrollments/:id",
    authenticate,
    enrollmentController.cancelEnrollment
);

module.exports = router;

