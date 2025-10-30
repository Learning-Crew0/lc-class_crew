const Coalition = require("./coalation.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// Helper function to upload file to Cloudinary (same as course.controller.js)
async function uploadFileToCloudinaryIfExists(file, folder = "coalitions") {
  if (!file) return null;
  if (cloudinary && cloudinary.uploader) {
    try {
      const result = await cloudinary.uploader.upload(file.path, { folder });
      try {
        fs.unlinkSync(file.path);
      } catch { }
      return result.secure_url;
    } catch (uploadError) {
      console.log("Cloudinary upload failed, using local path:", uploadError.message);
      return `/uploads/${file.filename || file.path}`;
    }
  }
  return `/uploads/${file.filename || file.path}`;
}

// Create Coalition (Public - Anyone can create)
exports.createCoalition = async (req, res) => {
  try {
    console.log("Coalition API called");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : "No file");

    const { name, affiliation, field, contact, email } = req.body;

    // Validate required fields
    if (!name || !affiliation || !field || !contact || !email) {
      console.log("Missing required fields:", { name, affiliation, field, contact, email });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        details: { name: !!name, affiliation: !!affiliation, field: !!field, contact: !!contact, email: !!email }
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({
        success: false,
        message: "Profile/Reference file is required",
      });
    }

    // Upload file to Cloudinary using the same method as course controller
    const fileUrl = await uploadFileToCloudinaryIfExists(
      req.file,
      "coalitions/files"
    );

    // Create coalition application
    const coalition = await Coalition.create({
      name,
      affiliation,
      field,
      contact,
      email,
      file: fileUrl,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Coalition application submitted successfully",
      data: {
        id: coalition._id,
        name: coalition.name,
        status: coalition.status,
        createdAt: coalition.createdAt,
      },
    });
  } catch (error) {
    console.error("Create coalition error:", error);

    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Coalitions (Admin Only)
exports.getAllCoalitions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = "createdAt", order = "desc" } = req.query;

    const filter = {};

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Search by name, email, affiliation, or field
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { affiliation: { $regex: search, $options: "i" } },
        { field: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    const coalitions = await Coalition.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Coalition.countDocuments(filter);

    // Get status statistics
    const stats = await Coalition.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        coalitions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCoalitions: total,
          limit: parseInt(limit),
        },
        statistics: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Get all coalitions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Coalition by ID (Admin Only)
exports.getCoalitionById = async (req, res) => {
  try {
    const { id } = req.params;

    const coalition = await Coalition.findById(id);

    if (!coalition) {
      return res.status(404).json({
        success: false,
        message: "Coalition application not found",
      });
    }

    res.json({
      success: true,
      data: coalition,
    });
  } catch (error) {
    console.error("Get coalition by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Coalition Status (Admin Only)
exports.updateCoalitionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    // Validate status
    if (!status || !["pending", "reviewed", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (pending, reviewed, approved, rejected)",
      });
    }

    const coalition = await Coalition.findById(id);

    if (!coalition) {
      return res.status(404).json({
        success: false,
        message: "Coalition application not found",
      });
    }

    coalition.status = status;
    if (adminNote) {
      coalition.adminNote = adminNote;
    }

    await coalition.save();

    res.json({
      success: true,
      message: "Coalition status updated successfully",
      data: coalition,
    });
  } catch (error) {
    console.error("Update coalition status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Coalition (Admin Only)
exports.deleteCoalition = async (req, res) => {
  try {
    const { id } = req.params;

    const coalition = await Coalition.findByIdAndDelete(id);

    if (!coalition) {
      return res.status(404).json({
        success: false,
        message: "Coalition application not found",
      });
    }

    res.json({
      success: true,
      message: "Coalition application deleted successfully",
    });
  } catch (error) {
    console.error("Delete coalition error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Coalition Statistics (Admin Only)
exports.getCoalitionStats = async (req, res) => {
  try {
    const stats = await Coalition.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const fieldStats = await Coalition.aggregate([
      {
        $group: {
          _id: "$field",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const total = await Coalition.countDocuments();

    res.json({
      success: true,
      data: {
        total,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byField: fieldStats,
      },
    });
  } catch (error) {
    console.error("Get coalition stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = exports;

