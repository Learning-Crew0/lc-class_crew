const Enquiry = require("./enquiry.model");
const cloudinary = require("../../config/cloudinary");

// ==================== PUBLIC CONTROLLERS ====================

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
// @note    Phone number must be 11 digits (Korean format)
exports.createEnquiry = async (req, res) => {
  try {
    console.log('📝 Creating new enquiry...');
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const {
      userId,
      name,
      contact,
      phone, // Accept flat phone field
      countryCode, // Accept flat countryCode field
      email,
      company,
      category,
      subject,
      message,
      agreeToTerms,
    } = req.body;

    // Validate required fields
    if (!name || !email || !category || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, category, subject, message",
      });
    }

    // Parse contact if it's a JSON string (from form-data)
    let contactData = contact;
    if (typeof contact === 'string') {
      try {
        contactData = JSON.parse(contact);
      } catch (e) {
        contactData = null;
      }
    }

    // Handle both nested and flat phone structure
    let phoneNumber = null;
    let contactCountryCode = "82";

    if (contactData && contactData.phone) {
      // Nested structure: contact: { phone: "..." }
      phoneNumber = contactData.phone;
      contactCountryCode = contactData.countryCode || "82";
    } else if (phone) {
      // Flat structure: phone: "..."
      phoneNumber = phone;
      contactCountryCode = countryCode || "82";
    }

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required in contact information",
      });
    }

    // Validate agreeToTerms (handle both string and boolean)
    const agreeToTermsBool = agreeToTerms === true || agreeToTerms === "true" || agreeToTerms === 1 || agreeToTerms === "1";
    
    if (!agreeToTermsBool) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the terms and conditions",
      });
    }

    // Handle file upload (attachment)
    let attachmentUrl = null;
    if (req.file) {
      try {
        console.log('📎 Uploading attachment to Cloudinary...');
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "enquiries/attachments",
          resource_type: "auto", // Supports images, PDFs, etc.
        });
        attachmentUrl = result.secure_url;
        console.log('✅ Attachment uploaded:', attachmentUrl);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        // Continue without attachment if upload fails
        attachmentUrl = null;
      }
    }

    // Create enquiry
    const enquiry = await Enquiry.create({
      userId: userId || null,
      name,
      contact: {
        countryCode: contactCountryCode,
        phone: phoneNumber,
      },
      email,
      company: company || null,
      category,
      subject,
      message,
      attachment: attachmentUrl,
      agreeToTerms: agreeToTermsBool,
    });

    console.log('✅ Enquiry created successfully:', enquiry._id);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. We will get back to you soon!",
      data: enquiry.getPublicEnquiry(),
    });
  } catch (error) {
    console.error("❌ Create enquiry error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create enquiry",
      error: error.errors || error.message,
    });
  }
};

// @desc    Get all enquiries (with filters)
// @route   GET /api/enquiries
// @access  Private/Admin
exports.getAllEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      userId,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (userId) query.userId = userId;

    // Search by name, email, subject, or message
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const enquiries = await Enquiry.find(query)
      .populate("userId", "username email fullName")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(query);

    // Get statistics
    const stats = await Enquiry.getEnquiryStats();

    res.status(200).json({
      success: true,
      data: {
        enquiries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalEnquiries: total,
          limit: parseInt(limit),
        },
        statistics: stats,
      },
    });
  } catch (error) {
    console.error("Get all enquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

// @desc    Get enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private (User can only see their own, Admin can see all)
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate(
      "userId",
      "username email fullName"
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Check if requester is admin (req.admin is set by protectAdmin middleware)
    const isAdmin = !!req.admin;

    // If user is not admin, they can only see their own enquiries
    if (!isAdmin && enquiry.userId && enquiry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this enquiry",
      });
    }

    // Return public data for non-admin users
    const responseData = isAdmin 
      ? enquiry 
      : enquiry.getPublicEnquiry();

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get enquiry by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error.message,
    });
  }
};

// @desc    Update enquiry
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Admin can update more fields
    const allowedUpdates = [
      "status",
      "adminNote",
      "name",
      "contact",
      "email",
      "company",
      "category",
      "subject",
      "message",
    ];

    // Update only allowed fields
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        enquiry[field] = req.body[field];
      }
    });

    // Handle new attachment upload
    if (req.file) {
      try {
        console.log('📎 Uploading new attachment to Cloudinary...');
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "enquiries/attachments",
          resource_type: "auto",
        });
        enquiry.attachment = result.secure_url;
        console.log('✅ New attachment uploaded:', result.secure_url);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
      }
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Update enquiry error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message,
    });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Delete attachment from Cloudinary if exists
    if (enquiry.attachment) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = enquiry.attachment.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExtension.split('.')[0];
        
        await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
        console.log('🗑️ Attachment deleted from Cloudinary');
      } catch (deleteError) {
        console.error('❌ Failed to delete attachment from Cloudinary:', deleteError);
        // Continue with enquiry deletion even if Cloudinary delete fails
      }
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error.message,
    });
  }
};

// ==================== ADDITIONAL CONTROLLERS ====================

// @desc    Get user's own enquiries
// @route   GET /api/enquiries/my-enquiries
// @access  Private
exports.getMyEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
    } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        enquiries: enquiries.map(enq => enq.getPublicEnquiry()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalEnquiries: total,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get my enquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your enquiries",
      error: error.message,
    });
  }
};

// @desc    Get enquiry statistics
// @route   GET /api/enquiries/stats
// @access  Private/Admin
exports.getEnquiryStatistics = async (req, res) => {
  try {
    const stats = await Enquiry.getEnquiryStats();
    
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: "pending" });
    const inProgressEnquiries = await Enquiry.countDocuments({ status: "in progress" });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: "resolved" });

    // Get enquiries by category
    const categoryStats = await Enquiry.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalEnquiries,
          pending: pendingEnquiries,
          inProgress: inProgressEnquiries,
          resolved: resolvedEnquiries,
        },
        byStatus: stats,
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    console.error("Get enquiry statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry statistics",
      error: error.message,
    });
  }
};

// @desc    Update enquiry status
// @route   PATCH /api/enquiries/:id/status
// @access  Private/Admin
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "in progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, in progress, or resolved",
      });
    }

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    enquiry.status = status;
    if (adminNote) {
      enquiry.adminNote = adminNote;
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Update enquiry status error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update enquiry status",
      error: error.message,
    });
  }
};

