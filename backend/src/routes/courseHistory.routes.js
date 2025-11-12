const express = require("express");
const router = express.Router();
const courseHistoryController = require("../controllers/courseHistory.controller");
const { validate } = require("../middlewares/validate.middleware");
const {
    verifyCourseHistorySchema,
} = require("../validators/courseHistory.validators");

// POST /api/v1/course-history/verify - Verify user and get enrollment history
router.post(
    "/verify",
    validate(verifyCourseHistorySchema),
    courseHistoryController.verifyCourseHistory
);

module.exports = router;
