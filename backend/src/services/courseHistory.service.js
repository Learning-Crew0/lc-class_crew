const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");

const getPersonalCourseHistory = async (inquiryData) => {
    const { phoneNumber, email, name } = inquiryData;

    const user = await User.findOne({
        phone: phoneNumber,
        email: email.toLowerCase(),
        fullName: name,
    });

    if (!user) {
        throw ApiError.notFound("No user found with the provided information");
    }

    const enrollments = await Enrollment.find({ user: user._id })
        .populate("course", "title category")
        .populate("schedule", "scheduleName startDate endDate")
        .sort({ enrollmentDate: -1 });

    const courseHistory = enrollments.map((enrollment, index) => {
        let trainingDate = "N/A";
        if (enrollment.schedule) {
            const startDate = enrollment.schedule.startDate
                .toISOString()
                .split("T")[0]
                .replace(/-/g, ".");
            const endDate = enrollment.schedule.endDate
                .toISOString()
                .split("T")[0]
                .replace(/-/g, ".");
            trainingDate = `${startDate}~${endDate}`;
        }

        return {
            no: index + 1,
            enrollmentId: enrollment._id,
            courseId: enrollment.course._id,
            courseName: enrollment.course.title,
            trainingDate,
            status: enrollment.status,
            certificateAvailable:
                enrollment.certificateIssued && !!enrollment.certificateUrl,
            certificateUrl: enrollment.certificateUrl || null,
            enrollmentDate: enrollment.enrollmentDate,
            completedAt: enrollment.completedAt || null,
        };
    });

    const statusCounts = enrollments.reduce(
        (acc, enrollment) => {
            acc.total += 1;
            if (enrollment.status === "수료") acc.completed += 1;
            else if (
                enrollment.status === "수강중" ||
                enrollment.status === "수강예정"
            )
                acc.ongoing += 1;
            return acc;
        },
        { total: 0, completed: 0, ongoing: 0 }
    );

    return {
        userInfo: {
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            userId: user._id,
        },
        courseHistory,
        totalCourses: statusCounts.total,
        completedCourses: statusCounts.completed,
        ongoingCourses: statusCounts.ongoing,
    };
};

const getCorporateCourseHistory = async (inquiryData) => {
    const {
        companyName,
        contactPerson,
        contactPhone,
        contactEmail,
        department,
        startDate,
        endDate,
    } = inquiryData;

    const query = {
        $or: [
            { "userInfo.organization": { $regex: companyName, $options: "i" } },
        ],
    };

    if (startDate || endDate) {
        query.enrollmentDate = {};
        if (startDate) {
            query.enrollmentDate.$gte = new Date(startDate);
        }
        if (endDate) {
            query.enrollmentDate.$lte = new Date(endDate);
        }
    }

    const enrollments = await Enrollment.find(query)
        .populate("user", "fullName email phone organization")
        .populate("course", "title category")
        .populate("schedule", "scheduleName startDate endDate")
        .sort({ enrollmentDate: -1 });

    if (enrollments.length === 0) {
        throw ApiError.notFound("No enrollment records found for this company");
    }

    const courseHistory = enrollments.map((enrollment, index) => {
        let trainingDate = "N/A";
        if (enrollment.schedule) {
            const startDate = enrollment.schedule.startDate
                .toISOString()
                .split("T")[0]
                .replace(/-/g, ".");
            const endDate = enrollment.schedule.endDate
                .toISOString()
                .split("T")[0]
                .replace(/-/g, ".");
            trainingDate = `${startDate}~${endDate}`;
        }

        return {
            no: index + 1,
            employeeName: enrollment.user?.fullName || "Unknown",
            department: department || "N/A",
            position: "N/A",
            courseName: enrollment.course?.title || "Unknown",
            trainingDate,
            status: enrollment.status,
            certificateAvailable:
                enrollment.certificateIssued && !!enrollment.certificateUrl,
            certificateUrl: enrollment.certificateUrl || null,
        };
    });

    const summary = enrollments.reduce(
        (acc, enrollment) => {
            acc.totalEnrollments += 1;
            if (enrollment.status === "수료") acc.completed += 1;
            else if (enrollment.status === "수강중") acc.ongoing += 1;
            else if (enrollment.status === "수강예정") acc.upcoming += 1;
            else if (enrollment.status === "미수료") acc.notCompleted += 1;
            return acc;
        },
        {
            totalEnrollments: 0,
            completed: 0,
            ongoing: 0,
            upcoming: 0,
            notCompleted: 0,
        }
    );

    const uniqueEmployees = [
        ...new Set(enrollments.map((e) => e.user?._id?.toString())),
    ].filter(Boolean);

    return {
        companyInfo: {
            companyName,
            totalEmployees: uniqueEmployees.length,
            totalEnrollments: enrollments.length,
        },
        courseHistory,
        summary,
    };
};

const requestCorporateVerification = async (verificationData) => {
    const { contactEmail, companyName } = verificationData;

    const verificationCode = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    return {
        message: "Verification code sent to email",
        verificationCode,
        expiresIn: 600,
    };
};

const getCertificate = async (enrollmentId) => {
    const enrollment = await Enrollment.findById(enrollmentId).populate(
        "user",
        "fullName email"
    );

    if (!enrollment) {
        throw ApiError.notFound("Enrollment not found");
    }

    if (!enrollment.certificateIssued || !enrollment.certificateUrl) {
        throw ApiError.badRequest("Certificate not available");
    }

    return {
        certificateUrl: enrollment.certificateUrl,
        enrollment,
    };
};

module.exports = {
    getPersonalCourseHistory,
    getCorporateCourseHistory,
    requestCorporateVerification,
    getCertificate,
};
