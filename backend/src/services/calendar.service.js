const {
    getDateRange,
    getDayName,
    combineDateAndTime,
    parseTime,
} = require("../utils/date.util");

/**
 * Generate course sessions based on schedule pattern
 */
const generateCourseSessions = (courseData) => {
    const { startDate, endDate, schedulePattern } = courseData;

    if (
        !schedulePattern ||
        !schedulePattern.daysOfWeek ||
        schedulePattern.daysOfWeek.length === 0
    ) {
        throw new Error("Schedule pattern with days of week is required");
    }

    const sessions = [];
    const dateRange = getDateRange(startDate, endDate);
    let sessionNumber = 1;

    // Filter dates that match the schedule pattern
    const scheduledDates = dateRange.filter((date) => {
        const dayName = getDayName(date);
        return schedulePattern.daysOfWeek.includes(dayName);
    });

    // Create sessions for each scheduled date
    scheduledDates.forEach((date) => {
        sessions.push({
            sessionNumber,
            title: `Session ${sessionNumber}`,
            date,
            startTime: schedulePattern.startTime,
            endTime: schedulePattern.endTime,
            description: "",
        });
        sessionNumber++;
    });

    return sessions;
};

/**
 * Validate course schedule
 */
const validateSchedule = (startDate, endDate, schedulePattern) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
        throw new Error("End date must be after start date");
    }

    if (
        !schedulePattern ||
        !schedulePattern.daysOfWeek ||
        schedulePattern.daysOfWeek.length === 0
    ) {
        throw new Error("At least one day of the week must be selected");
    }

    if (!schedulePattern.startTime || !schedulePattern.endTime) {
        throw new Error("Start time and end time are required");
    }

    const startTime = parseTime(schedulePattern.startTime);
    const endTime = parseTime(schedulePattern.endTime);

    if (
        startTime.hours > endTime.hours ||
        (startTime.hours === endTime.hours &&
            startTime.minutes >= endTime.minutes)
    ) {
        throw new Error("End time must be after start time");
    }

    return true;
};

/**
 * Get upcoming sessions for a course
 */
const getUpcomingSessions = (sessions, limit = 5) => {
    const now = new Date();

    return sessions
        .filter((session) => new Date(session.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);
};

/**
 * Check if session date/time conflicts with existing sessions
 */
const checkSessionConflict = (newSession, existingSessions) => {
    const newStart = combineDateAndTime(newSession.date, newSession.startTime);
    const newEnd = combineDateAndTime(newSession.date, newSession.endTime);

    for (const session of existingSessions) {
        const existingStart = combineDateAndTime(
            session.date,
            session.startTime
        );
        const existingEnd = combineDateAndTime(session.date, session.endTime);

        // Check if times overlap
        if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
        ) {
            return {
                conflict: true,
                conflictingSession: session,
            };
        }
    }

    return { conflict: false };
};

module.exports = {
    generateCourseSessions,
    validateSchedule,
    getUpcomingSessions,
    checkSessionConflict,
};
