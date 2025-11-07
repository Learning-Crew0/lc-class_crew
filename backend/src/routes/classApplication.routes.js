const express = require("express");
const router = express.Router();
const classApplicationController = require("../controllers/classApplication.controller");
const { authenticate, optionalAuth } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    createClassApplicationSchema,
    updateApplicationStatusSchema,
} = require("../validators/classApplication.validators");

router.post(
    "/",
    optionalAuth,
    validate(createClassApplicationSchema),
    classApplicationController.createClassApplication
);

router.get(
    "/",
    authenticate,
    requireAdmin,
    classApplicationController.getAllApplications
);

router.get(
    "/my-applications",
    authenticate,
    classApplicationController.getUserApplications
);

router.get("/:id", authenticate, classApplicationController.getApplicationById);

router.patch(
    "/:id/status",
    authenticate,
    requireAdmin,
    validate(updateApplicationStatusSchema),
    classApplicationController.updateApplicationStatus
);

router.delete(
    "/:id/cancel",
    authenticate,
    classApplicationController.cancelApplication
);

router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    classApplicationController.deleteApplication
);

module.exports = router;

