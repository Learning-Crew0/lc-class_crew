const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faq.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    createFAQCategorySchema,
    updateFAQCategorySchema,
    createFAQSchema,
    updateFAQSchema,
    markHelpfulSchema,
    bulkDeleteSchema,
} = require("../validators/faq.validators");

router.get("/categories", faqController.getAllFAQCategories);

router.get("/categories/:id", faqController.getFAQCategoryById);

router.post(
    "/categories",
    authenticate,
    requireAdmin,
    validate(createFAQCategorySchema),
    faqController.createFAQCategory
);

router.put(
    "/categories/:id",
    authenticate,
    requireAdmin,
    validate(updateFAQCategorySchema),
    faqController.updateFAQCategory
);

router.delete(
    "/categories/:id",
    authenticate,
    requireAdmin,
    faqController.deleteFAQCategory
);

router.get(
    "/admin/stats",
    authenticate,
    requireAdmin,
    faqController.getFAQStats
);

router.post(
    "/bulk-delete",
    authenticate,
    requireAdmin,
    validate(bulkDeleteSchema),
    faqController.bulkDeleteFAQs
);

router.get("/", faqController.getAllFAQs);

router.get("/category/:categoryKey", faqController.getFAQsByCategory);

router.get("/:id", faqController.getFAQById);

router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createFAQSchema),
    faqController.createFAQ
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateFAQSchema),
    faqController.updateFAQ
);

router.delete("/:id", authenticate, requireAdmin, faqController.deleteFAQ);

router.post(
    "/:id/helpful",
    validate(markHelpfulSchema),
    faqController.markHelpful
);

module.exports = router;
