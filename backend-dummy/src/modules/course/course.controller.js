const Course = require("./course.model");
const Curriculum = require("./curriculum.model");
const Instructor = require("./instructor.model");
const Promotion = require("./promotion.model");
const Notice = require("./notice.model");
const Review = require("./review.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");

// Safe JSON parse helper
function safeParse(str) {
  if (typeof str !== "string") return str;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

// Upload local image to cloudinary
async function uploadFileToCloudinaryIfExists(file, folder = "courses") {
  if (!file) return null;
  if (cloudinary && cloudinary.uploader) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    try {
      fs.unlinkSync(file.path);
    } catch {}
    return result.secure_url;
  }
  return `/uploads/${file.filename || file.path}`;
}

// Normalize booleans
function parseBoolean(val) {
  if (val === true || val === "true") return true;
  if (val === false || val === "false") return false;
  return undefined; // Invalid inputs return undefined
}
// Helper to safely parse arrays from string/JSON/array
function parseArray(val) {
  if (!val) return [];
  try {
    if (typeof val === "string") {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    if (Array.isArray(val)) return val;
    return [val];
  } catch {
    if (typeof val === "string" && val.includes(",")) {
      return val.split(",").map((item) => item.trim());
    }
    return Array.isArray(val) ? val : [val];
  }
}

// Helper to parse training schedules
function parseTrainingSchedules(val) {
  if (!val) return [];
  try {
    if (typeof val === "string") {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    if (Array.isArray(val)) return val;
    return [];
  } catch {
    return [];
  }
}

// ================= GET ALL COURSES =================
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, isFeatured } = req.query;
    const intLimit = parseInt(limit);
    const skip = (parseInt(page) - 1) * intLimit;
    const filter = {};

    if (isActive !== undefined) filter.isActive = parseBoolean(isActive);
    if (isFeatured !== undefined) filter.isFeatured = parseBoolean(isFeatured);

    const courses = await Course.find(filter)
      .skip(skip)
      .limit(intLimit)
      .populate("category", "title description")
      .populate("tags", "tagText tagColor")
      .sort({ createdAt: -1 })
      .lean();

    const total = await Course.countDocuments(filter);

    const courseIds = courses.map((c) => c._id);
    const objectIds = courseIds.map((id) => new mongoose.Types.ObjectId(id));

    const [
      allCurriculums,
      allInstructors,
      allPromotions,
      allNotices,
      allReviews,
    ] = await Promise.all([
      Curriculum.find({ courseId: { $in: objectIds } }).lean(),
      Instructor.find({ courseId: { $in: objectIds } }).lean(),
      Promotion.find({ courseId: { $in: objectIds } }).lean(),
      Notice.find({ courseId: { $in: objectIds } }).lean(),
      Review.find({ courseId: { $in: objectIds } }).lean(),
    ]);

    // Map related data
    const mapByCourseId = (arr) => {
      const map = new Map();
      arr.forEach((item) => {
        const key = item.courseId.toString();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
      });
      return map;
    };

    const promotionsMap = mapByCourseId(allPromotions);
    const reviewsMap = mapByCourseId(allReviews);
    const curriculumMap = new Map(
      allCurriculums.map((c) => [c.courseId.toString(), c])
    );
    const instructorMap = new Map(
      allInstructors.map((i) => [i.courseId.toString(), i])
    );
    const noticeMap = new Map(
      allNotices.map((n) => [n.courseId.toString(), n])
    );

    const enhancedCourses = courses.map((course) => ({
      ...course,
      curriculum: curriculumMap.get(course._id.toString()) || null,
      instructor: instructorMap.get(course._id.toString()) || null,
      promotions: promotionsMap.get(course._id.toString()) || [],
      notice: noticeMap.get(course._id.toString()) || null,
      reviews: reviewsMap.get(course._id.toString()) || [],
    }));

    res.json({
      success: true,
      courses: enhancedCourses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / intLimit),
        total,
      },
    });
  } catch (err) {
    console.error("Get all courses error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ================= GET COURSE DETAIL =================
exports.getCourseDetail = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });

    const course = await Course.findById(courseId)
      .populate("category", "title description")
      .populate("tags", "tagText tagColor")
      .lean();

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const [curriculum, instructor, promotions, notice, reviews] =
      await Promise.all([
        Curriculum.findOne({ courseId }).lean(),
        Instructor.findOne({ courseId }).lean(),
        Promotion.find({ courseId }).lean(),
        Notice.findOne({ courseId }).lean(),
        Review.find({ courseId }).lean(),
      ]);

    res.json({
      success: true,
      course,
      curriculum: curriculum || null,
      instructor: instructor || null,
      promotions: promotions || [],
      notice: notice || null,
      reviews: reviews || [],
    });
  } catch (err) {
    console.error("Course detail error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ================= CREATE COURSE =================
exports.createCourse = async (req, res) => {
  try {
    const body = req.body;

    if (!body.title || !body.category) {
      return res
        .status(400)
        .json({ success: false, message: "Title and category required" });
    }

    // Validate category ObjectId
    if (!mongoose.Types.ObjectId.isValid(body.category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }

    let mainImageUrl = body.mainImage || null;
    if (req.files?.mainImage?.[0]) {
      mainImageUrl = await uploadFileToCloudinaryIfExists(
        req.files.mainImage[0],
        "courses/images"
      );
    }

    let noticeImageUrl = body.noticeImage || null;
    if (req.files?.noticeImage?.[0]) {
      noticeImageUrl = await uploadFileToCloudinaryIfExists(
        req.files.noticeImage[0],
        "courses/notices"
      );
    }

    // Prepare course data
    const courseData = {
      title: body.title,
      category: body.category,
      tagColor: body.tagColor,
      tagText: body.tagText,
      processName: body.processName,
      shortDescription: body.shortDescription,
      longDescription: body.longDescription,
      target: body.target,
      duration: body.duration,
      location: body.location,
      hours: body.hours ? Number(body.hours) : undefined,
      price: body.price ? Number(body.price) : undefined,
      priceText: body.priceText,
      field: body.field,
      date: body.date,
      refundOptions: body.refundOptions,
      learningGoals: parseArray(body.learningGoals),
      mainImage: mainImageUrl,
      noticeImage: noticeImageUrl,
      tags: parseArray(body.tags),
      recommendedAudience: parseArray(body.recommendedAudience),
      trainingSchedules: parseTrainingSchedules(body.trainingSchedules),
    };

    // Only set boolean fields if they are valid
    if (body.isActive !== undefined) {
      const parsedActive = parseBoolean(body.isActive);
      if (parsedActive === undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid isActive value" });
      }
      courseData.isActive = parsedActive;
    }

    if (body.isFeatured !== undefined) {
      const parsedFeatured = parseBoolean(body.isFeatured);
      if (parsedFeatured === undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid isFeatured value" });
      }
      courseData.isFeatured = parsedFeatured;
    }

    const course = await Course.create(courseData);

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("Create course error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// ================= UPDATE COURSE =================

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }

    const body = req.body;
    console.log("Request body:", JSON.stringify(body, null, 2)); // Detailed logging
    const updates = {};

    // Validate and process fields
    if (body.title !== undefined) {
      if (!body.title) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }
      updates.title = String(body.title).trim();
    }

    if (body.category !== undefined && body.category !== null) {
      let categoryValue = body.category;
      if (Array.isArray(body.category)) {
        if (body.category.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "Category array cannot be empty" });
        }
        categoryValue = body.category[0]; // Take the first element
      }
      categoryValue = String(categoryValue).trim();
      if (!mongoose.Types.ObjectId.isValid(categoryValue)) {
        console.log(
          "Invalid category ID provided:",
          body.category,
          typeof body.category
        );
        return res.status(400).json({
          success: false,
          message: `Invalid category ID: ${JSON.stringify(
            body.category
          )} (type: ${typeof body.category})`,
        });
      }
      updates.category = categoryValue;
    }

    // String fields
    const stringFields = [
      "tagColor",
      "tagText",
      "processName",
      "shortDescription",
      "longDescription",
      "target",
      "duration",
      "location",
      "priceText",
      "field",
      "refundOptions",
    ];
    stringFields.forEach((f) => {
      if (body[f] !== undefined) updates[f] = String(body[f]).trim();
    });

    // Number fields
    if (body.hours !== undefined && body.hours !== null && body.hours !== "") {
      let hoursValue = body.hours;
      if (Array.isArray(body.hours)) {
        hoursValue = body.hours[0]; // Take the first element if array
      }
      const numValue = Number(hoursValue);
      if (isNaN(numValue)) {
        console.log("Invalid hours value provided:", body.hours, typeof body.hours);
        return res.status(400).json({
          success: false,
          message: `Invalid hours value: ${JSON.stringify(body.hours)} (type: ${typeof body.hours})`,
        });
      }
      updates.hours = numValue;
    }

    if (body.price !== undefined && body.price !== null && body.price !== "") {
      let priceValue = body.price;
      if (Array.isArray(body.price)) {
        priceValue = body.price[0]; // Take the first element if array
      }
      const numValue = Number(priceValue);
      if (isNaN(numValue)) {
        console.log("Invalid price value provided:", body.price, typeof body.price);
        return res.status(400).json({
          success: false,
          message: `Invalid price value: ${JSON.stringify(body.price)} (type: ${typeof body.price})`,
        });
      }
      updates.price = numValue;
    }

    // Boolean fields
    if (body.isActive !== undefined) {
      let isActiveValue = body.isActive;
      if (Array.isArray(body.isActive)) {
        if (body.isActive.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "isActive array cannot be empty" });
        }
        isActiveValue = String(body.isActive[0]).trim(); // Trim spaces from first element
      }
      const parsedActive = parseBoolean(isActiveValue);
      if (parsedActive === undefined) {
        console.log(
          "Invalid isActive value provided:",
          body.isActive,
          typeof body.isActive,
          "Trimmed value:",
          isActiveValue
        );
        return res.status(400).json({
          success: false,
          message: `Invalid isActive value: ${JSON.stringify(
            body.isActive
          )} (trimmed: "${isActiveValue}", type: ${typeof body.isActive}). Expected true, false, "true", or "false".`,
        });
      }
      updates.isActive = parsedActive;
    }

    if (body.isFeatured !== undefined) {
      let isFeaturedValue = body.isFeatured;
      if (Array.isArray(body.isFeatured)) {
        if (body.isFeatured.length === 0) {
          return res
            .status(400)
            .json({ success: false, message: "isFeatured array cannot be empty" });
        }
        isFeaturedValue = String(body.isFeatured[0]).trim(); // Trim spaces from first element
      }
      const parsedFeatured = parseBoolean(isFeaturedValue);
      if (parsedFeatured === undefined) {
        console.log(
          "Invalid isFeatured value provided:",
          body.isFeatured,
          typeof body.isFeatured,
          "Trimmed value:",
          isFeaturedValue
        );
        return res.status(400).json({
          success: false,
          message: `Invalid isFeatured value: ${JSON.stringify(
            body.isFeatured
          )} (trimmed: "${isFeaturedValue}", type: ${typeof body.isFeatured}). Expected true, false, "true", or "false".`,
        });
      }
      updates.isFeatured = parsedFeatured;
    }

    // Date
    if (body.date !== undefined) {
      const d = new Date(body.date);
      if (!isNaN(d)) updates.date = d;
    }

    // Arrays
    if (body.tags !== undefined) updates.tags = parseArray(body.tags);
    if (body.recommendedAudience !== undefined) {
      updates.recommendedAudience = parseArray(body.recommendedAudience);
    }
    if (body.learningGoals !== undefined) {
      updates.learningGoals = parseArray(body.learningGoals);
    }
    if (body.trainingSchedules !== undefined) {
      updates.trainingSchedules = parseTrainingSchedules(body.trainingSchedules);
    }

    // Images
    if (req.files?.mainImage?.[0]) {
      updates.mainImage = await uploadFileToCloudinaryIfExists(
        req.files.mainImage[0],
        "courses/images"
      );
    } else if (body.mainImage === "null") {
      updates.mainImage = null;
    }

    if (req.files?.noticeImage?.[0]) {
      updates.noticeImage = await uploadFileToCloudinaryIfExists(
        req.files.noticeImage[0],
        "courses/notices"
      );
    } else if (body.noticeImage === "null") {
      updates.noticeImage = null;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updates },
      { new: true }
    )
      .populate("category", "title description")
      .populate("tags", "tagText tagColor");

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course updated",
      course: updatedCourse,
    });
  } catch (err) {
    console.error("Update course error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Supporting functions (unchanged)
function parseBoolean(val) {
  if (val === true || val === "true") return true;
  if (val === false || val === "false") return false;
  return undefined; // Invalid inputs return undefined
}

function parseArray(val) {
  if (!val) return [];
  try {
    if (typeof val === "string") {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    if (Array.isArray(val)) return val;
    return [val];
  } catch {
    if (typeof val === "string" && val.includes(",")) {
      return val.split(",").map((item) => item.trim());
    }
    return Array.isArray(val) ? val : [val];
  }
}

async function uploadFileToCloudinaryIfExists(file, folder = "courses") {
  if (!file) return null;
  if (cloudinary && cloudinary.uploader) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    try {
      fs.unlinkSync(file.path);
    } catch {}
    return result.secure_url;
  }
  return `/uploads/${file.filename || file.path}`;
}


// ================= DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });

    const removed = await Course.findByIdAndDelete(courseId);
    if (!removed)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    await Promise.all([
      Curriculum.deleteMany({ courseId }),
      Instructor.deleteMany({ courseId }),
      Promotion.deleteMany({ courseId }),
      Notice.deleteMany({ courseId }),
      Review.deleteMany({ courseId }),
    ]);

    res.json({ success: true, message: "Course and related data deleted" });
  } catch (err) {
    console.error("Delete course error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
