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

/**
 * Get all training schedules for calendar view
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} - Schedules with metadata
 */
const getCalendarSchedules = async (filters = {}) => {
    const {
        startDate,
        endDate,
        status,
        categorySlug,
        isActive = true,
    } = filters;

    // Build query
    const query = { isActive };

    // Date range filtering
    if (startDate || endDate) {
        query.startDate = {};
        if (startDate) query.startDate.$gte = new Date(startDate);
        if (endDate) query.startDate.$lte = new Date(endDate);
    }

    // Status filtering
    if (status) {
        query.status = status;
    }

    // Fetch schedules with populated course data
    let schedules = await TrainingSchedule.find(query)
        .sort({ startDate: 1 })
        .populate({
            path: "course",
            select: "title category categoryInfo position positionInfo mainImage price",
        })
        .lean();

    // Category filtering (after population)
    if (categorySlug) {
        schedules = schedules.filter(
            (schedule) => schedule.course?.categoryInfo?.slug === categorySlug
        );
    }

    // Transform schedules to include computed fields
    const transformedSchedules = schedules.map((schedule) => ({
        ...schedule,
        remainingSeats: Math.max(
            0,
            schedule.availableSeats - schedule.enrolledCount
        ),
        isFull: schedule.enrolledCount >= schedule.availableSeats,
    }));

    return {
        schedules: transformedSchedules,
        totalSchedules: transformedSchedules.length,
        filters: {
            startDate: startDate || null,
            endDate: endDate || null,
            status: status || null,
            categorySlug: categorySlug || null,
        },
    };
};

/**
 * Generate annual schedule export data
 * @param {Number} year - Year to export
 * @returns {Promise<Array>} - Schedule data for export
 */
const getAnnualScheduleData = async (year) => {
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st

    const schedules = await TrainingSchedule.find({
        startDate: { $gte: startDate, $lte: endDate },
        isActive: true,
    })
        .sort({ startDate: 1 })
        .populate({
            path: "course",
            select: "title category categoryInfo position positionInfo location duration",
        })
        .lean();

    // Transform data for export
    return schedules.map((schedule) => ({
        대분류: schedule.course?.categoryInfo?.koreanName || "미분류",
        중분류:
            schedule.course?.positionInfo?.koreanName ||
            schedule.course?.category ||
            "기타",
        과정명: schedule.course?.title || "제목 없음",
        교육일정: schedule.scheduleName,
        시작일: schedule.startDate
            ? new Date(schedule.startDate).toISOString().split("T")[0]
            : "",
        종료일: schedule.endDate
            ? new Date(schedule.endDate).toISOString().split("T")[0]
            : "",
        교육시간: schedule.course?.duration
            ? `${schedule.course.duration}시간`
            : "",
        교육장소: schedule.course?.location || "",
        정원: schedule.availableSeats,
        현재신청: schedule.enrolledCount,
        상태:
            schedule.status === "upcoming"
                ? "모집중"
                : schedule.status === "ongoing"
                  ? "진행중"
                  : schedule.status === "completed"
                    ? "종료"
                    : "취소",
        잔여석: Math.max(0, schedule.availableSeats - schedule.enrolledCount),
    }));
};

/**
 * Bulk create training schedules from array
 * @param {Array} schedulesData - Array of schedule objects
 * @returns {Promise<Object>} - Summary of operation
 */
const bulkCreateSchedules = async (schedulesData) => {
    const summary = {
        totalProcessed: schedulesData.length,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
    };
    const details = [];

    for (let i = 0; i < schedulesData.length; i++) {
        const row = i + 1;
        const data = schedulesData[i];

        try {
            // Validate course exists
            const course = await Course.findById(data.courseId);
            if (!course) {
                details.push({
                    row,
                    status: "failed",
                    message: `Course not found: ${data.courseId}`,
                });
                summary.failed++;
                continue;
            }

            // Check if schedule already exists for this course and date
            const existingSchedule = await TrainingSchedule.findOne({
                course: data.courseId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            });

            if (existingSchedule) {
                // Update existing schedule
                existingSchedule.scheduleName =
                    data.scheduleName || existingSchedule.scheduleName;
                existingSchedule.availableSeats =
                    data.availableSeats || existingSchedule.availableSeats;
                existingSchedule.status =
                    data.status || existingSchedule.status;
                await existingSchedule.save();

                details.push({
                    row,
                    status: "updated",
                    message: "Training schedule updated successfully",
                    scheduleId: existingSchedule._id,
                });
                summary.updated++;
            } else {
                // Create new schedule
                const newSchedule = await TrainingSchedule.create({
                    course: data.courseId,
                    scheduleName: data.scheduleName,
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate),
                    availableSeats: data.availableSeats || 30,
                    status: data.status || "upcoming",
                    enrolledCount: 0,
                    isActive: true,
                });

                details.push({
                    row,
                    status: "created",
                    message: "Training schedule created successfully",
                    scheduleId: newSchedule._id,
                });
                summary.created++;
            }
        } catch (error) {
            details.push({
                row,
                status: "failed",
                message: error.message,
            });
            summary.failed++;
        }
    }

    return { summary, details };
};

module.exports = {
    getAllSchedulesForCourse,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    incrementEnrolledCount,
    getCalendarSchedules,
    getAnnualScheduleData,
    bulkCreateSchedules,
};
