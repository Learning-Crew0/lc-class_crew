const TrainingSchedule = require("../models/trainingSchedule.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");

const getAllSchedulesForCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const schedules = await TrainingSchedule.find({
        course: courseId,
        isActive: true,
    })
        .sort({ startDate: 1 })
        .populate("course", "title");

    return schedules;
};

const getScheduleById = async (scheduleId) => {
    const schedule = await TrainingSchedule.findById(scheduleId).populate(
        "course",
        "title price"
    );
    if (!schedule) {
        throw ApiError.notFound("일정을 찾을 수 없습니다");
    }
    return schedule;
};

const createSchedule = async (courseId, scheduleData) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const schedule = await TrainingSchedule.create({
        ...scheduleData,
        course: courseId,
    });

    return schedule;
};

const updateSchedule = async (scheduleId, updates) => {
    const schedule = await TrainingSchedule.findByIdAndUpdate(
        scheduleId,
        updates,
        {
            new: true,
            runValidators: true,
        }
    ).populate("course", "title");

    if (!schedule) {
        throw ApiError.notFound("일정을 찾을 수 없습니다");
    }

    return schedule;
};

const deleteSchedule = async (scheduleId) => {
    const schedule = await TrainingSchedule.findById(scheduleId);
    if (!schedule) {
        throw ApiError.notFound("일정을 찾을 수 없습니다");
    }

    if (schedule.enrolledCount > 0) {
        throw ApiError.badRequest("수강생이 있는 일정은 삭제할 수 없습니다");
    }

    await TrainingSchedule.findByIdAndDelete(scheduleId);
    return { message: "일정이 성공적으로 삭제되었습니다" };
};

const incrementEnrolledCount = async (scheduleId) => {
    const schedule = await TrainingSchedule.findById(scheduleId);
    if (!schedule) {
        throw ApiError.notFound("일정을 찾을 수 없습니다");
    }

    if (schedule.isFull) {
        throw ApiError.badRequest("해당 일정의 좌석이 모두 찼습니다");
    }

    schedule.enrolledCount += 1;
    await schedule.save();

    return schedule;
};

module.exports = {
    getAllSchedulesForCourse,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    incrementEnrolledCount,
};
