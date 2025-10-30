const Notice = require("./notice.model");
const Course = require("./course.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// upsert notice

async function uploadFile(file, folder = 'courses/notices') {
  if (!file) return null;

  try {
    if (cloudinary && cloudinary.uploader) {
      const result = await cloudinary.uploader.upload(file.path, { folder });
      // Clean up local file after successful upload
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup local file:', cleanupError.message);
      }
      return result.secure_url;
    }
    // Fallback to local file serving
    return `/uploads/${file.filename || file.path}`;
  } catch (error) {
    console.error('File upload error:', error);
    // Clean up local file on error
    try {
      fs.unlinkSync(file.path);
    } catch (cleanupError) {
      console.warn('Failed to cleanup local file after error:', cleanupError.message);
    }
    throw new Error('Failed to upload file');
  }
}
  
  // POST /api/courses/:id/notice
  exports.addOrUpdateNotice = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      // Validate course exists
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

      const description = req.body.noticeDesc || req.body.description || '';
      const file = req.file;
      const imageUrl = await uploadFile(file, 'courses/notices');
  
      const existing = await Notice.findOne({ courseId });
      if (existing) {
        if (imageUrl) existing.noticeImage = imageUrl;
        if (description) existing.noticeDesc = description;
        await existing.save();
        return res.json({ success:true, notice: existing });
      }
      const created = await Notice.create({ courseId, noticeImage: imageUrl, noticeDesc: description });
      return res.status(201).json({ success:true, notice: created });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success:false, message:'Server error', error: err.message });
    }
  };