const Category = require("./category.model");

// ✅ Get All Categories (with optional filtering)
exports.getAllCategories = async (req, res) => {
    try {
        const { isActive } = req.query;

        let filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const categories = await Category.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, categories });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: "Category not found" });
        res.json({ success: true, category });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { title, description, isActive } = req.body;

        // ✅ Basic validation
        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const category = await Category.create({
            title,
            description,
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json({ success: true, message: "Category created successfully", category });
    }
    catch (err) {
        console.error("❌ Error creating category:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// ✅ Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, isActive } = req.body;

        // ✅ Basic validation
        if (title === "") {
            return res.status(400).json({ success: false, message: "Title cannot be empty" });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Category not found" });

        res.json({ success: true, message: "Category updated successfully", category: updated });
    }
    catch (err) {
        console.error("❌ Error updating category:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });

        res.json({ success: true, message: "Category deleted successfully" });
    }
    catch (err) {
        console.error("❌ Error deleting category:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};