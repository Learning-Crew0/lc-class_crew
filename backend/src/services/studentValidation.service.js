const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");

/**
 * Validate student credentials against existing user account
 * CRITICAL: Students MUST have existing user accounts
 * 
 * @param {Object} studentData - { email: { username, domain }, phone: { prefix, middle, last }, name }
 * @returns {Promise<Object>} - { valid: Boolean, userId: String, user: Object, error: String }
 */
const validateStudent = async (studentData) => {
    const { email, phone, name } = studentData;

    // Construct full email
    const fullEmail = `${email.username}@${email.domain}`.toLowerCase();

    // Construct full phone number
    const fullPhone = `${phone.prefix}${phone.middle}${phone.last}`;

    // Check if user exists by email
    const user = await User.findOne({ email: fullEmail });

    if (!user) {
        return {
            valid: false,
            error: "학생은 반드시 등록된 계정이 있어야 합니다. 먼저 회원가입을 진행해주세요.",
        };
    }

    // Verify phone number matches (removing hyphens for comparison)
    const userPhone = user.phone?.replace(/-/g, "");
    if (userPhone !== fullPhone) {
        return {
            valid: false,
            error: "전화번호가 등록된 정보와 일치하지 않습니다.",
        };
    }

    // Verify name matches
    if (user.fullName !== name) {
        return {
            valid: false,
            error: "이름이 등록된 정보와 일치하지 않습니다.",
        };
    }

    // All validations passed
    return {
        valid: true,
        userId: user._id.toString(),
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            memberType: user.memberType,
        },
    };
};

/**
 * Validate multiple students (for bulk operations)
 * 
 * @param {Array<Object>} studentsData 
 * @returns {Promise<Array<Object>>}
 */
const validateMultipleStudents = async (studentsData) => {
    const validationResults = await Promise.all(
        studentsData.map(async (studentData) => {
            const result = await validateStudent(studentData);
            return {
                ...studentData,
                ...result,
            };
        })
    );

    return validationResults;
};

/**
 * Check if student is already enrolled in a course
 * 
 * @param {String} studentId 
 * @param {String} courseId 
 * @param {String} scheduleId 
 * @returns {Promise<Boolean>}
 */
const isStudentEnrolled = async (studentId, courseId, scheduleId) => {
    const StudentEnrollment = require("../models/studentEnrollment.model");

    const enrollment = await StudentEnrollment.findOne({
        student: studentId,
        course: courseId,
        trainingSchedule: scheduleId,
    });

    return !!enrollment;
};

/**
 * Validate student enrollment eligibility
 * 
 * @param {String} studentId 
 * @param {String} courseId 
 * @param {String} scheduleId 
 * @returns {Promise<Object>}
 */
const validateEnrollmentEligibility = async (studentId, courseId, scheduleId) => {
    // Check if already enrolled
    const alreadyEnrolled = await isStudentEnrolled(studentId, courseId, scheduleId);

    if (alreadyEnrolled) {
        return {
            eligible: false,
            error: "학생이 이미 해당 과정에 등록되어 있습니다.",
        };
    }

    // Check training schedule availability
    const TrainingSchedule = require("../models/trainingSchedule.model");
    const schedule = await TrainingSchedule.findById(scheduleId);

    if (!schedule) {
        return {
            eligible: false,
            error: "해당 교육 일정을 찾을 수 없습니다.",
        };
    }

    if (!schedule.isActive) {
        return {
            eligible: false,
            error: "해당 교육 일정은 현재 이용할 수 없습니다.",
        };
    }

    if (schedule.enrolledCount >= schedule.availableSeats) {
        return {
            eligible: false,
            error: "해당 교육 일정의 정원이 모두 찼습니다.",
        };
    }

    return {
        eligible: true,
    };
};

module.exports = {
    validateStudent,
    validateMultipleStudents,
    isStudentEnrolled,
    validateEnrollmentEligibility,
};

