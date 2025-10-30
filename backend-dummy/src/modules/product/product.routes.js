const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const upload = require('../../middlewares/upload');

/**
 * @route   GET /api/products
 * @desc    Get all products (with optional filters)
 * @query   category, isActive, page, limit
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:categoryId', productController.getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @body    { name, category, baseCost, discountRate, availableQuantity, description, images, isActive }
 * @access  Admin
 */
router.post('/', upload.array('images', 5), productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @body    { name, category, baseCost, discountRate, availableQuantity, description, images, isActive }
 * @access  Admin
 */
router.put('/:id', upload.array('images', 5), productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Admin
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;

