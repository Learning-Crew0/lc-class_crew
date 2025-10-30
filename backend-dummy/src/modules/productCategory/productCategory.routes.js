const express = require('express');
const router = express.Router();
const productCategoryController = require('./productCategory.controller');

/**
 * @route   GET /api/product-categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/', productCategoryController.getAllProductCategories);

/**
 * @route   GET /api/product-categories/:id
 * @desc    Get single product category by ID
 * @access  Public
 */
router.get('/:id', productCategoryController.getProductCategoryById);

/**
 * @route   POST /api/product-categories
 * @desc    Create new product category
 * @body    { title, description, order, isActive }
 * @access  Admin
 */
router.post('/', productCategoryController.createProductCategory);

/**
 * @route   PUT /api/product-categories/:id
 * @desc    Update product category
 * @body    { title, description, order, isActive }
 * @access  Admin
 */
router.put('/:id', productCategoryController.updateProductCategory);

/**
 * @route   DELETE /api/product-categories/:id
 * @desc    Delete product category
 * @access  Admin
 */
router.delete('/:id', productCategoryController.deleteProductCategory);

module.exports = router;

