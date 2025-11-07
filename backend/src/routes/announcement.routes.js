const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcement.controller");
const { authenticate, optionalAuth } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { uploadMultiple } = require("../middlewares/upload.middleware");
const {
    createAnnouncementSchema,
    updateAnnouncementSchema,
    bulkDeleteSchema,
} = require("../validators/announcement.validators");

router.get("/", announcementController.getAllAnnouncements);

router.get("/:id", optionalAuth, announcementController.getAnnouncementById);

router.post(
    "/",
    authenticate,
    requireAdmin,
    uploadMultiple("ANNOUNCEMENTS", "attachments", 5),
    validate(createAnnouncementSchema),
    announcementController.createAnnouncement
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    uploadMultiple("ANNOUNCEMENTS", "attachments", 5),
    validate(updateAnnouncementSchema),
    announcementController.updateAnnouncement
);

router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    announcementController.deleteAnnouncement
);

router.patch(
    "/:id/archive",
    authenticate,
    requireAdmin,
    announcementController.softDeleteAnnouncement
);

router.delete(
    "/:id/attachments/:attachmentId",
    authenticate,
    requireAdmin,
    announcementController.deleteAttachment
);

router.post(
    "/bulk-delete",
    authenticate,
    requireAdmin,
    validate(bulkDeleteSchema),
    announcementController.bulkDeleteAnnouncements
);

router.get(
    "/admin/stats",
    authenticate,
    requireAdmin,
    announcementController.getAnnouncementStats
);

module.exports = router;

