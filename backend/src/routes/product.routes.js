const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    createProductSchema,
    updateProductSchema,
    updateStockSchema,
} = require("../validators/product.validators");

// Public routes
router.get("/", productsController.getAllProducts);
router.get("/featured", productsController.getFeatured);
router.get("/:id", productsController.getProductById);

// Admin routes
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createProductSchema),
    productsController.createProduct
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateProductSchema),
    productsController.updateProduct
);

router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    productsController.deleteProduct
);

router.patch(
    "/:id/toggle-publish",
    authenticate,
    requireAdmin,
    productsController.togglePublish
);

router.patch(
    "/:id/stock",
    authenticate,
    requireAdmin,
    validate(updateStockSchema),
    productsController.updateStock
);

module.exports = router;

