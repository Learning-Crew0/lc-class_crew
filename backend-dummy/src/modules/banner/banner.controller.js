const Banner = require("./banner.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// ✅ Create Banner
exports.createBanner = async (req, res) => {
  try {
    const { headline, subText, mainText, buttonText, linkUrl, displayPeriod, order } = req.body;

    let imageUrl = null;

    // ✅ Upload banner image if provided
    if (req.file) {
      const imagePath = req.file.path;

      const imageResult = await cloudinary.uploader.upload(imagePath, {
        folder: "banners",
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

    // ✅ Create banner object
    const bannerData = {
      imageUrl,
      headline,
      subText,
      mainText,
      buttonText,
      linkUrl,
      order: order || 0,
    };

    // ✅ Parse and add displayPeriod only if provided
    if (displayPeriod) {
      let parsedDisplayPeriod;
      if (typeof displayPeriod === 'string') {
        parsedDisplayPeriod = JSON.parse(displayPeriod);
      } else {
        parsedDisplayPeriod = displayPeriod;
      }

      if (parsedDisplayPeriod && parsedDisplayPeriod.start && parsedDisplayPeriod.end) {
        bannerData.displayPeriod = {
          start: new Date(parsedDisplayPeriod.start),
          end: new Date(parsedDisplayPeriod.end)
        };
      }
    }

    const banner = new Banner(bannerData);
    await banner.save();

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error("❌ Error creating banner:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Get All Active Banners (Public)
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Banner by ID (Public)
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    res.json({
      success: true,
      banner
    });
  } catch (error) {
    console.error("❌ Error fetching banner by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Get All Banners for Admin (with pagination, search, filter)
exports.getAllBannersAdmin = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const isActive = req.query.isActive; // 'true', 'false', or undefined (all)
    const sortBy = req.query.sortBy || 'createdAt'; // 'createdAt', 'order', 'headline'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter query
    const filter = {};

    // Search in headline, mainText, or buttonText
    if (search) {
      filter.$or = [
        { headline: { $regex: search, $options: 'i' } },
        { mainText: { $regex: search, $options: 'i' } },
        { buttonText: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query with pagination
    const banners = await Banner.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalBanners = await Banner.countDocuments(filter);
    const totalPages = Math.ceil(totalBanners / limit);

    // Get statistics
    const stats = {
      total: await Banner.countDocuments(),
      active: await Banner.countDocuments({ isActive: true }),
      inactive: await Banner.countDocuments({ isActive: false })
    };

    res.json({
      success: true,
      data: banners,
      pagination: {
        currentPage: page,
        totalPages,
        totalBanners,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats
    });
  } catch (error) {
    console.error("❌ Error fetching all banners for admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { headline, subText, mainText, buttonText, linkUrl, displayPeriod, order, isActive } = req.body;

    let updateData = {
      headline,
      subText,
      mainText,
      buttonText,
      linkUrl,
      order,
      isActive
    };

    // ✅ Add displayPeriod if provided
    if (displayPeriod) {
      let parsedDisplayPeriod;
      if (typeof displayPeriod === 'string') {
        parsedDisplayPeriod = JSON.parse(displayPeriod);
      } else {
        parsedDisplayPeriod = displayPeriod;
      }

      if (parsedDisplayPeriod && parsedDisplayPeriod.start && parsedDisplayPeriod.end) {
        updateData.displayPeriod = {
          start: new Date(parsedDisplayPeriod.start),
          end: new Date(parsedDisplayPeriod.end)
        };
      }
    }

    // ✅ Upload new image if provided
    if (req.file) {
      const imagePath = req.file.path;

      const imageResult = await cloudinary.uploader.upload(imagePath, {
        folder: "banners",
      });

      updateData.imageUrl = imageResult.secure_url;

      // remove local file after upload
      fs.unlinkSync(imagePath);
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Banner not found" });

    res.json({ success: true, banner: updated });
  } catch (error) {
    console.error("❌ Error updating banner:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Banner not found" });
    res.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
