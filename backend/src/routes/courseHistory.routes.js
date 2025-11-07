const express = require("express");
const router = express.Router();
const courseHistoryController = require("../controllers/courseHistory.controller");
const { validate } = require("../middlewares/validate.middleware");
const {
    personalHistoryInquirySchema,
    corporateHistoryInquirySchema,
    requestVerificationSchema,
} = require("../validators/courseHistory.validators");

router.post(
    "/personal",
    validate(personalHistoryInquirySchema),
    courseHistoryController.getPersonalCourseHistory
);

router.post(
    "/corporate",
    validate(corporateHistoryInquirySchema),
    courseHistoryController.getCorporateCourseHistory
);

router.post(
    "/corporate/verify",
    validate(requestVerificationSchema),
    courseHistoryController.requestCorporateVerification
);

router.get(
    "/certificate/:enrollmentId",
    courseHistoryController.getCertificate
);

module.exports = router;

