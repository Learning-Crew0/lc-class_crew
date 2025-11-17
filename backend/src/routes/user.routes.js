const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/auth.controller");
const enrollmentsController = require("../controllers/enrollments.controller");
const cartController = require("../controllers/cart.controller");
const inquiriesController = require("../controllers/inquiries.controller");
const messagesController = require("../controllers/messages.controller");

// Validators
const { validate } = require("../middlewares/validate.middleware");
const {
    updateProfileSchema,
    changePasswordSchema,
} = require("../validators/auth.validators");
const {
    createEnrollmentSchema,
} = require("../validators/enrollment.validators");
const {
    addToCartSchema,
    updateCartItemSchema,
} = require("../validators/cart.validators");
const {
    getMessagesQuerySchema,
} = require("../validators/message.validators");

// Middleware
const { authenticate } = require("../middlewares/auth.middleware");

// Apply authentication to all routes
router.use(authenticate);

// === PROFILE ===
// GET /api/v1/user/profile - Get current user profile
router.get("/profile", authController.getProfile);

// PUT /api/v1/user/profile - Update profile
router.put(
    "/profile",
    validate(updateProfileSchema),
    authController.updateProfile
);

// POST /api/v1/user/change-password - Change password
router.post(
    "/change-password",
    validate(changePasswordSchema),
    authController.changePassword
);

// === ENROLLMENTS ===
// GET /api/v1/user/enrolled-courses - Get enrolled courses for learning status page
router.get("/enrolled-courses", enrollmentsController.getEnrolledCourses);

// GET /api/v1/user/enrollments - Get user's enrollments
router.get("/enrollments", enrollmentsController.getUserEnrollments);

// POST /api/v1/user/enrollments - Create enrollment
router.post(
    "/enrollments",
    validate(createEnrollmentSchema),
    enrollmentsController.createEnrollment
);

// GET /api/v1/user/enrollments/:id - Get enrollment by ID
router.get("/enrollments/:id", enrollmentsController.getEnrollmentById);

// GET /api/v1/user/enrollments/:id/progress - Get progress report
router.get("/enrollments/:id/progress", enrollmentsController.getProgress);

// GET /api/v1/user/enrollments/:id/eligibility - Check certificate eligibility
router.get(
    "/enrollments/:id/eligibility",
    enrollmentsController.checkEligibility
);

// === CART ===
// GET /api/v1/user/cart - Get user's cart
router.get("/cart", cartController.getCart);

// POST /api/v1/user/cart - Add item to cart
router.post("/cart", validate(addToCartSchema), cartController.addToCart);

// PUT /api/v1/user/cart/:productId - Update cart item
router.put(
    "/cart/:productId",
    validate(updateCartItemSchema),
    cartController.updateCartItem
);

// DELETE /api/v1/user/cart/:productId - Remove item from cart
router.delete("/cart/:productId", cartController.removeFromCart);

// DELETE /api/v1/user/cart - Clear cart
router.delete("/cart", cartController.clearCart);

// === INQUIRIES ===
// GET /api/v1/user/inquiries - Get user's inquiries (also as my-enquiries)
router.get("/inquiries", inquiriesController.getMyEnquiries);
router.get("/my-enquiries", inquiriesController.getMyEnquiries);

// GET /api/v1/user/inquiries/:id - Get inquiry by ID
router.get("/inquiries/:id", inquiriesController.getInquiryById);

// === MESSAGES ===
// GET /api/v1/user/messages - Get user messages with filters
router.get(
    "/messages",
    validate(getMessagesQuerySchema),
    messagesController.getUserMessages
);

// GET /api/v1/user/messages/unread-count - Get unread message count
router.get("/messages/unread-count", messagesController.getUnreadCount);

// PUT /api/v1/user/messages/:id/read - Mark message as read
router.put("/messages/:id/read", messagesController.markMessageAsRead);

// PUT /api/v1/user/messages/read-all - Mark all messages as read
router.put("/messages/read-all", messagesController.markAllMessagesAsRead);

module.exports = router;
