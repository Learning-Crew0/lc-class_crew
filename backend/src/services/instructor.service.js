const Instructor = require("../models/instructor.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

const normalizeArrayFields = (data) => {
    const arrayFields = ["certificates", "attendanceHistory", "education"];
    
    arrayFields.forEach(field => {
        if (data[field]) {
            if (typeof data[field] === "string") {
                data[field] = data[field].split(",").map(item => item.trim()).filter(Boolean);
            }
        }
    });

    return data;
};

const getInstructorsByCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const instructors = await Instructor.find({ course: courseId });
    return instructors;
};

const createInstructor = async (courseId, instructorData, file) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const normalizedData = normalizeArrayFields(instructorData);

    if (file) {
        normalizedData.profileImage = getFileUrl("INSTRUCTORS", file.filename);
    }

    const instructor = await Instructor.create({
        ...normalizedData,
        course: courseId,
    });

    return instructor;
};

const updateInstructor = async (instructorId, updates, file) => {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
        throw ApiError.notFound("강사 정보를 찾을 수 없습니다");
    }

    const normalizedUpdates = normalizeArrayFields(updates);

    if (file) {
        if (instructor.profileImage) {
            deleteFileByUrl(instructor.profileImage);
        }
        normalizedUpdates.profileImage = getFileUrl("INSTRUCTORS", file.filename);
    }

    const updatedInstructor = await Instructor.findByIdAndUpdate(instructorId, normalizedUpdates, {
        new: true,
        runValidators: true,
    });

    return updatedInstructor;
};

const deleteInstructor = async (instructorId) => {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
        throw ApiError.notFound("강사 정보를 찾을 수 없습니다");
    }

    if (instructor.profileImage) {
        deleteFileByUrl(instructor.profileImage);
    }

    await Instructor.findByIdAndDelete(instructorId);
    return { message: "강사 정보가 성공적으로 삭제되었습니다" };
};

module.exports = {
    getInstructorsByCourse,
    createInstructor,
    updateInstructor,
    deleteInstructor,
};

