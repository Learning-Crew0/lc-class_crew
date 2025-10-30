const Product = require("./product.model");
const mongoose = require("mongoose");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const ProductCategory = require("../productCategory/productCategory.model");

// Upload file to Cloudinary (same logic as course controller)
async function uploadFileToCloudinaryIfExists(file, folder = "products/images") {
  if (!file) return null;
  if (cloudinary && cloudinary.uploader) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    try {
      fs.unlinkSync(file.path);
    } catch {}
    return result.secure_url;
  }
  return `/uploads/${file.filename || file.path}`;
}

// Helper function to parse boolean from string
const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, category, search, minPrice, maxPrice } = req.query;
    const intLimit = parseInt(limit);
    const skip = (parseInt(page) - 1) * intLimit;
    const filter = {};

    if (isActive !== undefined) filter.isActive = parseBoolean(isActive);

    if (category !== undefined) {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: "Invalid category ID" });
      }
      filter.category = category;
    }

    // Search filter
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.baseCost = {};
      if (minPrice !== undefined) {
        const min = parseFloat(minPrice);
        if (!isNaN(min) && min >= 0) {
          filter.baseCost.$gte = min;
        }
      }
      if (maxPrice !== undefined) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max) && max >= 0) {
          filter.baseCost.$lte = max;
        }
      }
      // Remove empty price filter
      if (Object.keys(filter.baseCost).length === 0) {
        delete filter.baseCost;
      }
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(intLimit)
      .populate("category", "title description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / intLimit),
        totalProducts: totalProducts,
        limit: intLimit
      }
    });
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate("category", "title description");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

exports.createProduct = async (req, res) => {
  try {
    console.log('📦 CREATE PRODUCT REQUEST');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);
    
    const { name, category, baseCost, discountRate, availableQuantity, description, isActive } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('❌ Validation Error: Product name is missing');
      return res.status(400).json({ success: false, message: "Product name is required", receivedData: { name } });
    }
    if (!category) {
      console.error('❌ Validation Error: Category is missing');
      return res.status(400).json({ success: false, message: "Product category is required", receivedData: { category } });
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      console.error('❌ Validation Error: Invalid category ID format:', category);
      return res.status(400).json({ success: false, message: "Invalid category ID", receivedData: { category } });
    }
    if (baseCost === undefined || baseCost === null || baseCost < 0) {
      console.error('❌ Validation Error: Invalid baseCost:', baseCost);
      return res.status(400).json({ success: false, message: "Valid base cost is required (must be >= 0)", receivedData: { baseCost } });
    }

    console.log('✅ Basic validation passed');

    // Check if category exists
    const existingCategory = await ProductCategory.findById(category);
    if (!existingCategory) {
      console.error('❌ Category not found in database:', category);
      return res.status(404).json({ success: false, message: "Product category not found", receivedData: { category } });
    }
    console.log('✅ Category found:', existingCategory.title);

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} images to Cloudinary...`);
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(`  - Uploading image ${i + 1}/${req.files.length}: ${file.originalname}`);
        try {
          const imageUrl = await uploadFileToCloudinaryIfExists(file, "products/images");
          if (imageUrl) {
            imageUrls.push(imageUrl);
            console.log(`    ✅ Uploaded: ${imageUrl.substring(0, 60)}...`);
          } else {
            console.warn(`    ⚠️ Upload returned null for ${file.originalname}`);
          }
        } catch (uploadError) {
          console.error(`    ❌ Upload failed for ${file.originalname}:`, uploadError.message);
          // Continue with other images
        }
      }
      console.log(`✅ Successfully uploaded ${imageUrls.length}/${req.files.length} images`);
    } else {
      console.log('ℹ️ No images provided');
    }

    // Create product
    console.log('💾 Creating product in database...');
    const product = await Product.create({
      name,
      category,
      baseCost: Number(baseCost),
      discountRate: discountRate ? Number(discountRate) : 0,
      availableQuantity: availableQuantity ? Number(availableQuantity) : 0,
      description,
      images: imageUrls,
      isActive: isActive !== undefined ? parseBoolean(isActive) : true
    });
    
    console.log('✅ Product created successfully:', product._id);
    res.status(201).json({ success: true, message: "Product created successfully", product });
  }
  catch (err) {
    console.error('❌ CREATE PRODUCT ERROR:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      }));
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationErrors,
        fullError: err.message 
      });
    }
    
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Duplicate key error", 
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message,
      errorType: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    console.log('📝 UPDATE PRODUCT REQUEST');
    console.log('Product ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);
    
    const { id } = req.params;
    const {
      name,
      category,
      baseCost,
      discountRate,
      availableQuantity,
      description,
      isActive,
    } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('❌ Invalid product ID format:', id);
      return res.status(400).json({ success: false, message: "Invalid product ID", receivedData: { id } });
    }

    // Validate category if provided
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      console.error('❌ Invalid category ID format:', category);
      return res.status(400).json({ success: false, message: "Invalid category ID", receivedData: { category } });
    }

    // Validate category exists if provided
    if (category) {
      const existingCategory = await ProductCategory.findById(category);
      if (!existingCategory) {
        console.error('❌ Category not found:', category);
        return res.status(404).json({ success: false, message: "Product category not found", receivedData: { category } });
      }
      console.log('✅ Category found:', existingCategory.title);
    }

    const product = await Product.findById(id);
    if (!product) {
      console.error('❌ Product not found:', id);
      return res.status(404).json({ success: false, message: "Product not found", receivedData: { id } });
    }
    
    console.log('✅ Product found:', product.name);

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} new images to replace existing...`);
      let imageUrls = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(`  - Uploading image ${i + 1}/${req.files.length}: ${file.originalname}`);
        try {
          const imageUrl = await uploadFileToCloudinaryIfExists(file, "products/images");
          if (imageUrl) {
            imageUrls.push(imageUrl);
            console.log(`    ✅ Uploaded: ${imageUrl.substring(0, 60)}...`);
          }
        } catch (uploadError) {
          console.error(`    ❌ Upload failed for ${file.originalname}:`, uploadError.message);
        }
      }
      product.images = imageUrls;
      console.log(`✅ Images updated: ${imageUrls.length} images`);
    }

    // Update fields
    if (name !== undefined) {
      console.log('  - Updating name:', name);
      product.name = name;
    }
    if (category !== undefined) {
      console.log('  - Updating category:', category);
      product.category = category;
    }
    if (baseCost !== undefined && baseCost !== null) {
      console.log('  - Updating baseCost:', baseCost);
      product.baseCost = Number(baseCost);
    }
    if (discountRate !== undefined && discountRate !== null) {
      console.log('  - Updating discountRate:', discountRate);
      product.discountRate = Number(discountRate);
    }
    if (availableQuantity !== undefined && availableQuantity !== null) {
      console.log('  - Updating availableQuantity:', availableQuantity);
      product.availableQuantity = Number(availableQuantity);
    }
    if (description !== undefined) {
      console.log('  - Updating description');
      product.description = description;
    }
    if (isActive !== undefined) {
      console.log('  - Updating isActive:', isActive);
      product.isActive = parseBoolean(isActive);
    }

    console.log('💾 Saving product...');
    await product.save();

    console.log('✅ Product updated successfully');
    res.status(200).json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error('❌ UPDATE PRODUCT ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationErrors,
        fullError: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10, isActive } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    // Check if category exists
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const intLimit = parseInt(limit);
    const skip = (parseInt(page) - 1) * intLimit;

    const filter = { category: categoryId };
    if (isActive !== undefined) {
      filter.isActive = parseBoolean(isActive);
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(intLimit)
      .populate("category", "title description")
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      category: {
        id: category._id,
        title: category.title,
        description: category.description
      },
      products: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / intLimit),
        totalProducts: totalProducts,
        productsPerPage: intLimit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};