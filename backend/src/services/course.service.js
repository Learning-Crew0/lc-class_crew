const Course = require("../models/course.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError.util");
const {
    getPaginationParams,
    createPaginationMeta,
} = require("../utils/pagination.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

const normalizeArrayFields = (data) => {
    const arrayFields = [
        "tags",
        "recommendedAudience",
        "whatYouWillLearn",
        "requirements",
    ];

    arrayFields.forEach((field) => {
        if (data[field]) {
            if (typeof data[field] === "string") {
                data[field] = data[field]
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        }
    });

    if (data.learningGoals) {
        if (typeof data.learningGoals === "string") {
            try {
                data.learningGoals = JSON.parse(data.learningGoals);
            } catch (e) {
                data.learningGoals = data.learningGoals
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        }
    }

    return data;
};

const getAllCourses = async (query) => {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};

    if (query.category) {
        filter.category = query.category;
    }

    if (query.level && query.level !== "all") {
        filter.level = query.level;
    }

    if (query.search) {
        filter.$text = { $search: query.search };
    }

    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }

    if (query.isFeatured !== undefined) {
        filter.isFeatured = query.isFeatured === "true";
    }

    const courses = await Course.find(filter)
        .populate("category", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments(filter);

    return {
        courses,
        pagination: createPaginationMeta(page, limit, total),
    };
};

const getCourseById = async (courseId, includeRelated = false) => {
    let query = Course.findById(courseId).populate(
        "category",
        "title description"
    );

    if (includeRelated) {
        query = query
            .populate("trainingSchedules")
            .populate("curriculum")
            .populate("instructors")
            .populate({ path: "promotions", match: { isActive: true } })
            .populate({ path: "reviews", match: { isApproved: true } })
            .populate("notice");
    }

    const course = await query;

    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    return course;
};

const createCourse = async (courseData, files) => {
    const normalizedData = normalizeArrayFields(courseData);

    const category = await Category.findById(normalizedData.category);
    if (!category) {
        throw ApiError.notFound("카테고리를 찾을 수 없습니다");
    }

    if (files?.mainImage) {
        normalizedData.mainImage = getFileUrl(
            "COURSES",
            files.mainImage[0].filename
        );
        normalizedData.image = normalizedData.mainImage;
    }

    if (files?.hoverImage) {
        normalizedData.hoverImage = getFileUrl(
            "COURSES",
            files.hoverImage[0].filename
        );
    }

    const course = await Course.create(normalizedData);

    await Category.findByIdAndUpdate(normalizedData.category, {
        $inc: { courseCount: 1 },
    });

    return course;
};

const updateCourse = async (courseId, updates, files) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const normalizedUpdates = normalizeArrayFields(updates);

    if (
        normalizedUpdates.category &&
        normalizedUpdates.category !== course.category.toString()
    ) {
        const category = await Category.findById(normalizedUpdates.category);
        if (!category) {
            throw ApiError.notFound("카테고리를 찾을 수 없습니다");
        }

        await Category.findByIdAndUpdate(course.category, {
            $inc: { courseCount: -1 },
        });
        await Category.findByIdAndUpdate(normalizedUpdates.category, {
            $inc: { courseCount: 1 },
        });
    }

    if (files?.mainImage) {
        if (course.mainImage) {
            deleteFileByUrl(course.mainImage);
        }
        normalizedUpdates.mainImage = getFileUrl(
            "COURSES",
            files.mainImage[0].filename
        );
        normalizedUpdates.image = normalizedUpdates.mainImage;
    }

    if (files?.hoverImage) {
        if (course.hoverImage) {
            deleteFileByUrl(course.hoverImage);
        }
        normalizedUpdates.hoverImage = getFileUrl(
            "COURSES",
            files.hoverImage[0].filename
        );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        normalizedUpdates,
        {
            new: true,
            runValidators: true,
        }
    ).populate("category", "title");

    return updatedCourse;
};

const deleteCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    if (course.enrollmentCount > 0) {
        throw ApiError.badRequest("수강생이 있는 코스는 삭제할 수 없습니다");
    }

    if (course.mainImage) {
        deleteFileByUrl(course.mainImage);
    }
    if (course.hoverImage) {
        deleteFileByUrl(course.hoverImage);
    }

    await Category.findByIdAndUpdate(course.category, {
        $inc: { courseCount: -1 },
    });
    await Course.findByIdAndDelete(courseId);

    return { message: "코스가 성공적으로 삭제되었습니다" };
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
};
