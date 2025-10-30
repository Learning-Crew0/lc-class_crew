const Instructor = require("./instructor.model");
const Course = require("./course.model");
// upsert instructor

exports.upsertInstructor = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      const { name, bio, professionalField, certificates, attendanceHistory } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Instructor name required' });

      // Validate course exists
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  
      const payload = {
        courseId,
        name,
        bio,
        professionalField,
        certificates: Array.isArray(certificates) ? certificates : (certificates ? (() => { try { return JSON.parse(certificates); } catch { return [certificates]; } })() : []),
        attendanceHistory: Array.isArray(attendanceHistory) ? attendanceHistory : (attendanceHistory ? (() => { try { return JSON.parse(attendanceHistory); } catch { return [attendanceHistory]; } })() : [])
      };
  
      const existing = await Instructor.findOne({ courseId });
      if (existing) {
        const updated = await Instructor.findByIdAndUpdate(existing._id, payload, { new: true });
        return res.json({ success:true, instructor: updated });
      }
      const created = await Instructor.create(payload);
      return res.status(201).json({ success:true, instructor: created });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success:false, message:'Server error', error: err.message });
    }
  };
  
  // GET /api/courses/:id/instructor
  exports.getInstructor = async (req, res) => {
    try {
      const courseId = req.params.id;

      // Validate ObjectId format
      if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid course ID format' });
      }

      const instructor = await Instructor.findOne({ courseId });
      return res.json({ success: true, instructor: instructor || null });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };