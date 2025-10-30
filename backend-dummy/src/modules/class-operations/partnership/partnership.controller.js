const Partnership = require("./partnership.model");

exports.getPartnerships = async (req, res) => {
    try {
        const {status} = req.query;
        const filter = {};

        if(status) {
            if(!["pending", "approved", "rejected"].includes(status)) {
                return res.status(400).json({success: false, message: "Invalid status"});
            }
            filter.status = status;
        }

        const partnerships = await Partnership.find(filter).sort({createdAt: -1});
        res.json({success: true, partnerships});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}

exports.getPartnershipById = async (req, res) => {
try {
    const {id} = req.params;
    const p = await Partnership.findById(id);
    if(!p) return res.status(404).json({success: false, message: "Partnership not found"});

    res.json({success: true, p})
}
catch(err) {
    console.error(err);
    res.status(500).json({success: false, message: "Server error", error: err.message});
}
}

exports.createPartnership = async (req, res) => {
    try {
        const {proposerName, proposerEmail, message} = req.body;

        if(!proposerName || !proposerEmail) return res.status(400).json({success: false, message: "Proposer name and email are required"});

        const created = await Partnership.create({proposerName, proposerEmail, message});
        if(!created) return res.status(400).json({success: false, message: "Failed to create partnership"});

        res.status(201).json({success: true, message: "Partnership created successfully", created});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({success: false, message: "Server error", error: err.message});
    }
}

exports.updatePartnership = async (req, res) => {
    try {
      const { id } = req.params;
      // allow status update + message edit
      const updates = {};
      if (req.body.status) {
        if (!['pending','reviewed','accepted','rejected'].includes(req.body.status)) {
          return res.status(400).json({ success:false, message:'Invalid status' });
        }
        updates.status = req.body.status;
      }
      if (req.body.proposerName) updates.proposerName = req.body.proposerName;
      if (req.body.proposerEmail) updates.proposerEmail = req.body.proposerEmail;
      if (req.body.message) updates.message = req.body.message;
  
      const updated = await Partnership.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ success:false, message:'Partnership not found' });
      res.json({ success:true, partnership: updated });
    } catch (err) {
      console.error('updatePartnership', err);
      res.status(500).json({ success:false, message:'Server error', error: err.message });
    }
  };
  
  /**
   * DELETE /api/class-operations/partnerships/:id
   */
  exports.deletePartnership = async (req, res) => {
    try {
      const { id } = req.params;
      const removed = await Partnership.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success:false, message:'Partnership not found' });
      res.json({ success:true, message:'Partnership deleted' });
    } catch (err) {
      console.error('deletePartnership', err);
      res.status(500).json({ success:false, message:'Server error', error: err.message });
    }
  };