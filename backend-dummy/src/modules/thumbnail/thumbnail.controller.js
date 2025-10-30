const Thumbnail = require("./thumbnail.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// ✅ Get Thumbnails by Category
exports.getThumbnailsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = { isActive: true };
    if (category && category !== "ALL") {
      query.category = category;
    }

    const thumbnails = await Thumbnail.find(query)
      .populate('courseId')
      .sort({ order: 1, createdAt: -1 });
    
    res.json({ success: true, thumbnails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Create Thumbnail
exports.createThumbnail = async (req, res) => {
  try {
    const { 
      courseId, 
      title, 
      category, 
      tags, 
      level, 
      instructor, 
      schedule, 
      price, 
      buttonText, 
      order 
    } = req.body;

    let imageUrl = null;

    // ✅ Upload thumbnail image if provided
    if (req.file) {
      const imagePath = req.file.path;

      const imageResult = await cloudinary.uploader.upload(imagePath, {
        folder: "thumbnails",
      });

      imageUrl = imageResult.secure_url;

      // remove local file after upload
      fs.unlinkSync(imagePath);
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // ✅ Create thumbnail object
    const thumbnailData = {
      courseId,
      title,
      imageUrl,
      category,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      level,
      instructor,
      schedule,
      price,
      buttonText: buttonText || "View",
      order: order || 0,
    };

    const thumbnail = new Thumbnail(thumbnailData);
    await thumbnail.save();

    res.status(201).json({
      success: true,
      message: "Thumbnail created successfully",
      thumbnail,
    });
  } catch (error) {
    console.error("❌ Error creating thumbnail:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Update Thumbnail
exports.updateThumbnail = async (req, res) => {
  try {
    const { 
      courseId, 
      title, 
      category, 
      tags, 
      level, 
      instructor, 
      schedule, 
      price, 
      buttonText, 
      order, 
      isActive 
    } = req.body;
    
    let updateData = { 
      courseId,
      title, 
      category, 
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [], 
      level,
      instructor,
      schedule,
      price,
      buttonText,
      order, 
      isActive 
    };

    // ✅ Upload new image if provided
    if (req.file) {
      const imagePath = req.file.path;

      const imageResult = await cloudinary.uploader.upload(imagePath, {
        folder: "thumbnails",
      });

      updateData.imageUrl = imageResult.secure_url;

      // remove local file after upload
      fs.unlinkSync(imagePath);
    }

    const updated = await Thumbnail.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Thumbnail not found" });
    
    res.json({ success: true, thumbnail: updated });
  } catch (error) {
    console.error("❌ Error updating thumbnail:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete Thumbnail
exports.deleteThumbnail = async (req, res) => {
  try {
    const deleted = await Thumbnail.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Thumbnail not found" });
    res.json({ success: true, message: "Thumbnail deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
