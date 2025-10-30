const mongoose = require("mongoose");
const Applicant = require("./applicant.model");
const {Parser} = require("json2csv");

exports.getApplicants = async  (req, res) => {
    try {
        const {courseId, status, userId} = req.query;
        const filter = {};
        if (courseId && mongoose.Types.ObjectId.isValid(courseId)) filter.courseId = courseId;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) filter.userId = userId;
        if (status) {
        if (!['pending','approved','rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status filter' });
        }
        filter.status = status;
        }

        const applicants = await Applicant.find(filter).populate("userId", "name email").populate("courseId", "title");
        res.json({success: true, applicants});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}

exports.getApplicantById = async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid id' });
  
      const applicant = await Applicant.findById(id).populate("userId", "name email").populate("courseId", "title").lean();
      if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });

      res.json({ success: true, applicant });
    } catch (err) {
      console.error('getApplicantById', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };

  exports.createApplicant = async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      if (!userId || !courseId) {
        return res.status(400).json({ success: false, message: 'userId and courseId are required' });
      }
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ success: false, message: 'Invalid userId or courseId' });
      }
  
      // optional: prevent duplicate
      const exists = await Applicant.findOne({ userId, courseId });
      if (exists) return res.status(409).json({ success: false, message: 'Application already exists' });

      const applicant = await Applicant.create({
        userId,
        courseId,
        appliedAt: new Date() // Explicitly set appliedAt to ensure consistency
      });
      res.status(201).json({ success: true, applicant });
    } catch (err) {
      console.error('createApplicant', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };

exports.updateApplicant = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid applicant ID format' });
        }

        const updates = {};

        if(req.body.status) {
            if(!["pending", "approved", "rejected"].includes(req.body.status)) {
                return res.status(400).json({ success: false, message: "Invalid status" });
            }
            updates.status = req.body.status;
        }

        const applicant = await Applicant.findByIdAndUpdate(id, updates, { new: true }).populate("userId", "name email").populate("courseId", "title");

        if(!applicant) return res.status(404).json({ success: false, message: "Applicant not found" });

        res.json({ success: true, message: "Applicant updated successfully", applicant });
        
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}

exports.deleteApplicant = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid applicant ID format' });
        }

        const removed = await Applicant.findByIdAndDelete(id);
        if (!removed) return res.status(404).json({ success: false, message: "Applicant not found" });

        res.json({ success: true, message: "Applicant deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}

exports.exportApplicants = async (req, res) => {
    try {
      const { courseId, status, userId } = req.query;
      const filter = {};
      if (courseId) filter.courseId = courseId;
      if (userId) filter.userId = userId;
      if (status) filter.status = status;
  
      const applicants = await Applicant.find(filter).lean();
  
      // simple CSV generation
      const fields = ['_id','userId','courseId','status','appliedAt','createdAt','updatedAt'];
      const csvRows = [];
      csvRows.push(fields.join(','));
      for (const a of applicants) {
        const row = fields.map(f => {
          let v = a[f];
          if (v === undefined || v === null) return '';
          if (v instanceof Date) return v.toISOString();
          // ensure no commas break columns - wrap in quotes and escape internal quotes
          return `"${String(v).replace(/"/g,'""')}"`;
        });
        csvRows.push(row.join(','));
      }
      const csv = csvRows.join('\n');
  
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="applicants_export_${Date.now()}.csv"`);
      res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Export failed', error: err.message });
    }
  };