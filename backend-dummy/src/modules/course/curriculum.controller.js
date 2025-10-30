const Curriculum = require("./curriculum.model");
const Course = require("./course.model");

// upsert curriculum

exports.upsertCurriculum = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      const { keywords, modules } = req.body; // modules can be JSON string or array

      if (!courseId) return res.status(400).json({ success: false, message: 'course id required' });
  
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success:false, message: 'Course not found' });
  
      let parsedModules = modules;
      if (typeof modules === 'string') {
        try { parsedModules = JSON.parse(modules); } catch (e) { parsedModules = []; }
      }
  
      const payload = {
        courseId,
        keywords: Array.isArray(keywords) ? keywords : (keywords ? (() => { try { return JSON.parse(keywords); } catch { return [keywords]; } })() : [])
      };
      payload.modules = Array.isArray(parsedModules) ? parsedModules : [];
  
      const existing = await Curriculum.findOne({ courseId });
      if (existing) {
        const updated = await Curriculum.findByIdAndUpdate(existing._id, payload, { new: true });
        return res.json({ success:true, curriculum: updated });
      } else {
        const created = await Curriculum.create(payload);
        return res.status(201).json({ success:true, curriculum: created });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success:false, message:'Server error', error: err.message });
    }
  };
  
  // GET /api/courses/:id/curriculum
  exports.getCurriculum = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      const curriculum = await Curriculum.findOne({ courseId });
      return res.json({ success: true, curriculum: curriculum || null });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };