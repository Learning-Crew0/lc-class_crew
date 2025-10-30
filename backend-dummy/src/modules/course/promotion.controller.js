const Promotion = require("./promotion.model");
const Course = require("./course.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// upsert promotion

async function uploadManyFiles(files = [], folder = 'courses/promotions') {
  const urls = [];
  console.log('uploadManyFiles called with:', files.length, 'files');

  for (const file of files) {
    if (!file) {
      console.log('Skipping null/undefined file');
      continue;
    }

    console.log('Processing file:', file.filename, 'path:', file.path);

    try {
      if (cloudinary && cloudinary.uploader) {
        console.log('Uploading to Cloudinary...');
        const result = await cloudinary.uploader.upload(file.path, { folder });
        console.log('Cloudinary upload successful:', result.secure_url);
        urls.push(result.secure_url);
        // Clean up local file after successful upload
        try {
          fs.unlinkSync(file.path);
          console.log('Local file cleaned up');
        } catch (cleanupError) {
          console.warn('Failed to cleanup local file:', cleanupError.message);
        }
      } else {
        console.log('Cloudinary not available, using local path');
        // Fallback to local file serving
        const localUrl = `/uploads/${file.filename || file.path}`;
        console.log('Using local URL:', localUrl);
        urls.push(localUrl);
      }
    } catch (error) {
      console.error('File upload error for', file.filename, ':', error.message);
      // Clean up local file on error
      try {
        fs.unlinkSync(file.path);
        console.log('Local file cleaned up after error');
      } catch (cleanupError) {
        console.warn('Failed to cleanup local file after error:', cleanupError.message);
      }
      // Continue with other files instead of failing completely
    }
  }

  console.log('Final URLs:', urls);
  return urls;
}

// POST /api/courses/:id/promotions  (add images & description)
exports.addOrUpdatePromotions = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate ObjectId format
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // req.files.promotions may be an array
    const files = req.files && req.files.promotions ? req.files.promotions : [];
    console.log('Files received:', files.length, files.map(f => f.filename));
    const imageUrls = await uploadManyFiles(files, 'courses/promotions');
    console.log('Image URLs generated:', imageUrls);

    const description = req.body.description || req.body.promotionDesc || '';

    const existing = await Promotion.findOne({ courseId });
    if (existing) {
      existing.images = existing.images.concat(imageUrls);
      if (description) existing.description = description;
      await existing.save();
      return res.json({ success: true, promotion: existing });
    } else {
      const created = await Promotion.create({ courseId, images: imageUrls, description });
      return res.status(201).json({ success: true, promotion: created });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE single promotion image or entire promotion
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params; // course id from route
    const { promotionId } = req.params; // promotion doc id
    const courseId = id; // course id is the first parameter
    const { imageUrl } = req.query; // optional: remove specific image

    // Validate ObjectId format
    if (!promotionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid promotion ID format' });
    }

    const promotion = await Promotion.findById(promotionId);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });

    // Validate promotion belongs to course
    if (promotion.courseId.toString() !== courseId) {
      return res.status(403).json({ success: false, message: 'Promotion does not belong to this course' });
    }

    if (imageUrl) {
      promotion.images = promotion.images.filter(u => u !== imageUrl);
      await promotion.save();
      return res.json({ success: true, promotion });
    } else {
      await Promotion.findByIdAndDelete(promotionId);
      return res.json({ success: true, message: 'Promotion removed' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};



// GET /api/courses/:id/promotions
exports.getPromotions = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate ObjectId format
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    // Check course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find promotion by courseId
    const promotion = await Promotion.findOne({ courseId });
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'No promotion found for this course' });
    }

    return res.json({
      success: true,
      promotion,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
