const express = require('express');
const router = express.Router();
const courseController = require('./course.controller');
const curriculumController = require('./curriculum.controller');
const instructorController = require('./instructor.controller');
const promotionController = require('./promotion.controller');
const noticeController = require('./notice.controller');
const reviewController = require('./review.controller');
const scheduleController = require('./trainingSchedule.controller');
const upload = require('../../middlewares/upload');
const { protect } = require('../../middleware/auth.middleware');
const { protectAdmin } = require('../../middleware/adminAuth.middleware'); 

router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'noticeImage', maxCount: 1 }
  ]),
  courseController.createCourse
);

router.get('/:id', courseController.getCourseDetail);
router.put('/:id',  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'noticeImage', maxCount: 1 }
  ]), courseController.updateCourse);
router.get('/', courseController.getAllCourses);
router.delete('/:id', courseController.deleteCourse);

// Curriculum
router.post('/:id/curriculum', curriculumController.upsertCurriculum);
router.get('/:id/curriculum', curriculumController.getCurriculum);

// Instructor
router.post('/:id/instructor', instructorController.upsertInstructor);
router.get('/:id/instructor', instructorController.getInstructor);
// Promotions - multiple images upload (field name: promotions)
// router.post('/:id/promotions', upload.array('promotions', 8), promotionController.addOrUpdatePromotions);
router.post(
  "/:id/promotions",
  upload.fields([{ name: "promotions", maxCount: 8 }]),
  promotionController.addOrUpdatePromotions
);
router.get('/:id/promotions', promotionController.getPromotions);
router.delete('/:id/promotions/:promotionId', promotionController.deletePromotion);

// Notice - single image field name: noticeImage or use req.file
router.post('/:id/notice', upload.single('noticeImage'), noticeController.addOrUpdateNotice);

// Reviews
router.post('/:id/reviews', reviewController.addReview);
router.get('/:id/reviews', reviewController.getReviews);
router.delete('/:id/reviews/:reviewId', reviewController.deleteReview);

// Training Schedules
router.get('/:id/training-schedules', scheduleController.getCourseTrainingSchedules);
router.post('/:id/training-schedules', protectAdmin, scheduleController.addTrainingSchedule);
router.put('/:id/training-schedules/:scheduleId', protectAdmin, scheduleController.updateTrainingSchedule);
router.delete('/:id/training-schedules/:scheduleId', protectAdmin, scheduleController.deleteTrainingSchedule);
router.post('/:id/training-schedules/:scheduleId/enroll', protect, scheduleController.enrollInSchedule);

module.exports = router;