const Curriculum = require("../models/curriculum.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");

const getCurriculumByCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const curriculum = await Curriculum.findOne({ course: courseId });
    return curriculum;
};

const upsertCurriculum = async (courseId, curriculumData) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const existingCurriculum = await Curriculum.findOne({ course: courseId });

    if (existingCurriculum) {
        const updated = await Curriculum.findByIdAndUpdate(
            existingCurriculum._id,
            curriculumData,
            { new: true, runValidators: true }
        );
        return updated;
    }

    const curriculum = await Curriculum.create({
        ...curriculumData,
        course: courseId,
    });

    return curriculum;
};

const deleteCurriculum = async (courseId) => {
    const curriculum = await Curriculum.findOneAndDelete({ course: courseId });
    if (!curriculum) {
        throw ApiError.notFound("커리큘럼을 찾을 수 없습니다");
    }
    return { message: "커리큘럼이 성공적으로 삭제되었습니다" };
};

module.exports = {
    getCurriculumByCourse,
    upsertCurriculum,
    deleteCurriculum,
};

