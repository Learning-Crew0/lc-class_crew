const CourseNotice = require("../models/courseNotice.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

const getNoticeByCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const notice = await CourseNotice.findOne({
        course: courseId,
        isActive: true,
    });
    return notice;
};

const upsertNotice = async (courseId, noticeData, file) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const existingNotice = await CourseNotice.findOne({ course: courseId });

    if (file) {
        if (existingNotice?.noticeImage) {
            deleteFileByUrl(existingNotice.noticeImage);
        }
        noticeData.noticeImage = getFileUrl("NOTICES", file.filename);
    }

    if (existingNotice) {
        const updated = await CourseNotice.findByIdAndUpdate(
            existingNotice._id,
            noticeData,
            { new: true, runValidators: true }
        );
        return updated;
    }

    const notice = await CourseNotice.create({
        ...noticeData,
        course: courseId,
    });

    return notice;
};

const deleteNotice = async (courseId) => {
    const notice = await CourseNotice.findOne({ course: courseId });
    if (!notice) {
        throw ApiError.notFound("공지를 찾을 수 없습니다");
    }

    if (notice.noticeImage) {
        deleteFileByUrl(notice.noticeImage);
    }

    await CourseNotice.findByIdAndDelete(notice._id);
    return { message: "공지가 성공적으로 삭제되었습니다" };
};

module.exports = {
    getNoticeByCourse,
    upsertNotice,
    deleteNotice,
};
