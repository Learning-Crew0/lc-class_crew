const ProductCategory = require("./productCategory.model");
const mongoose = require("mongoose");

exports.getAllProductCategories = async (req, res) => {
    try {
        const categories = await ProductCategory.find().sort({order: 1, createdAt: -1});
        res.status(200).json({success: true, categories});
    }
    catch(err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}

exports.getProductCategoryById = async (req, res) => {
    try {
        const {id} = req.params;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, message: "Invalid category ID"});
        }
        
        const category = await ProductCategory.findById(id);
        
        if (!category) {
            return res.status(404).json({success: false, message: "Product category not found"});
        }
        
        res.status(200).json({success: true, category});
    }
    catch(err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}

exports.createProductCategory = async (req, res) => {
    try {
        const {title, description, order, isActive} = req.body;
        
        // Validate required fields
        if (!title || title.trim() === '') {
            return res.status(400).json({success: false, message: "Title is required"});
        }
        
        const category = await ProductCategory.create({title, description, order, isActive});
        res.status(201).json({success: true, message: "Product category created successfully", category});
    }
    catch(err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({success: false, message: "Validation error", error: err.message});
        }
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}

exports.updateProductCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description, order, isActive} = req.body;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, message: "Invalid category ID"});
        }
        
        // Validate required fields if provided
        if (title !== undefined && (!title || title.trim() === '')) {
            return res.status(400).json({success: false, message: "Title cannot be empty"});
        }
        
        const category = await ProductCategory.findByIdAndUpdate(id, {title, description, order, isActive}, {new: true});
        
        if (!category) {
            return res.status(404).json({success: false, message: "Product category not found"});
        }
        
        res.status(200).json({success: true, message: "Product category updated successfully", category});
    }
    catch(err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({success: false, message: "Validation error", error: err.message});
        }
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}

exports.deleteProductCategory = async (req, res) => {
    try {
        const {id} = req.params;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, message: "Invalid category ID"});
        }
        
        const category = await ProductCategory.findByIdAndDelete(id);
        
        if (!category) {
            return res.status(404).json({success: false, message: "Product category not found"});
        }
        
        res.status(200).json({success: true, message: "Product category deleted successfully", category});
    }
    catch(err) {
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}