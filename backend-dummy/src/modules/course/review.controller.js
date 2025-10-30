const Review = require("./review.model");
const Course = require("./course.model");

// upsert review
exports.addReview = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      // Validate course exists
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

      const { reviewerName, avatar, text } = req.body;
      if (!reviewerName || !text) return res.status(400).json({ success: false, message: 'reviewerName and text required' });
  
      const created = await Review.create({ courseId, reviewerName, avatar, text });
      return res.status(201).json({ success:true, review: created });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success:false, message:'Server error', error: err.message });
    }
  };
  
  exports.getReviews = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      const list = await Review.find({ courseId }).sort({ createdAt: -1 });
      return res.json({ success: true, reviews: list });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };
  
  exports.deleteReview = async (req, res) => {
    try {
      const { id } = req.params; // course id from route
      const { reviewId } = req.params; // review id
      const courseId = id; // course id is the first parameter

      // Validate ObjectId format
      if (!reviewId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID format' });
      }

      // Find and validate review belongs to course
      const review = await Review.findById(reviewId);
      if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

      if (review.courseId.toString() !== courseId) {
        return res.status(403).json({ success: false, message: 'Review does not belong to this course' });
      }

      await Review.findByIdAndDelete(reviewId);
      return res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };