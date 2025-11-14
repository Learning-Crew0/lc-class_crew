const ClassApplication = require("../models/classApplication.model");
const StudentEnrollment = require("../models/studentEnrollment.model");
const Course = require("../models/course.model");
const TrainingSchedule = require("../models/trainingSchedule.model");
const studentValidationService = require("./studentValidation.service");
const cartService = require("./cart.service");
const ApiError = require("../utils/apiError.util");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Business rules
const INDIVIDUAL_STUDENT_LIMIT = 5;
const BULK_UPLOAD_MINIMUM = 6;

/**
 * Create draft application from selected courses
 * 
 * @param {String} userId 
 * @param {Array<String>} courseIds - Selected course IDs from cart
 * @returns {Promise<ClassApplication>}
 */
const createDraftApplication = async (userId, courseIds) => {
    if (!courseIds || courseIds.length === 0) {
        throw ApiError.badRequest("At least one course must be selected");
    }

    // Check if there's already a draft for this user
    const existingDraft = await ClassApplication.findOne({
        user: userId,
        status: "draft"
    }).sort({ createdAt: -1 }); // Get most recent draft

    if (existingDraft) {
        // Update the existing draft with new courses
        const selectedCourses = await cartService.getSelectedCoursesForApplication(
            userId,
            courseIds
        );

        existingDraft.courses = selectedCourses.map((item) => ({
            course: item._id,
            trainingSchedule: item.trainingSchedule._id,
            courseName: item.name,
            period: formatPeriod(
                item.trainingSchedule.startDate,
                item.trainingSchedule.endDate
            ),
            price: item.price,
            discountedPrice: item.discountedPrice,
            students: [],
        }));

        existingDraft.paymentInfo.totalAmount = existingDraft.courses.reduce(
            (sum, c) => sum + c.discountedPrice,
            0
        );

        await existingDraft.save();
        await existingDraft.populate("courses.course courses.trainingSchedule");
        return existingDraft;
    }

    // Get selected courses from cart
    const selectedCourses = await cartService.getSelectedCoursesForApplication(
        userId,
        courseIds
    );

    // Build courses array for application
    const courses = selectedCourses.map((item) => ({
        course: item._id,
        trainingSchedule: item.trainingSchedule._id,
        courseName: item.name,
        period: formatPeriod(
            item.trainingSchedule.startDate,
            item.trainingSchedule.endDate
        ),
        price: item.price,
        discountedPrice: item.discountedPrice,
        students: [],
    }));

    // Create draft application
    const application = new ClassApplication({
        user: userId,
        courses,
        status: "draft",
        paymentInfo: {
            totalAmount: courses.reduce(
                (sum, c) => sum + c.discountedPrice,
                0
            ),
            paymentMethod: "간편결제", // Default
            paymentStatus: "pending",
        },
        // invoiceManager and agreements not required for draft
    });

    await application.save();

    // Populate course details
    await application.populate("courses.course courses.trainingSchedule");

    return application;
};

/**
 * Get application by ID
 * 
 * @param {String} applicationId 
 * @param {String} userId - Optional: for ownership verification
 * @returns {Promise<ClassApplication>}
 */
const getApplicationById = async (applicationId, userId = null) => {
    const application = await ClassApplication.findById(applicationId)
        .populate("courses.course", "title description mainImage price")
        .populate(
            "courses.trainingSchedule",
            "scheduleName startDate endDate availableSeats"
        )
        .populate("courses.students.userId", "fullName email phone")
        .populate("user", "fullName email phone");

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    // Verify ownership if userId provided
    if (userId && application.user._id.toString() !== userId) {
        throw ApiError.forbidden("You do not have permission to access this application");
    }

    return application;
};

/**
 * Add student to a specific course in application
 * 
 * @param {String} applicationId 
 * @param {String} courseId 
 * @param {Object} studentData 
 * @returns {Promise<ClassApplication>}
 */
const addStudentToCourse = async (applicationId, courseId, studentData) => {
    const application = await ClassApplication.findById(applicationId);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    if (application.status !== "draft") {
        throw ApiError.badRequest("Cannot modify submitted application");
    }

    // Find the course in application
    const courseApp = application.courses.find(
        (c) => c.course.toString() === courseId
    );

    if (!courseApp) {
        throw ApiError.notFound("Course not found in application");
    }

    // Check if bulkUploadFile exists
    if (courseApp.bulkUploadFile) {
        throw ApiError.badRequest(
            "Cannot add individual students when bulk upload file exists. Please remove the file first."
        );
    }

    // Check student limit
    if (courseApp.students.length >= INDIVIDUAL_STUDENT_LIMIT) {
        throw ApiError.badRequest(
            `Cannot add more than ${INDIVIDUAL_STUDENT_LIMIT} students individually. Please use bulk upload for 6+ students.`
        );
    }

    // Validate student
    const validation = await studentValidationService.validateStudent(studentData);

    if (!validation.valid) {
        throw ApiError.badRequest(validation.error);
    }

    // Check enrollment eligibility
    const eligibility = await studentValidationService.validateEnrollmentEligibility(
        validation.userId,
        courseId,
        courseApp.trainingSchedule.toString()
    );

    if (!eligibility.eligible) {
        throw ApiError.badRequest(eligibility.error);
    }

    // Add student
    courseApp.students.push({
        userId: validation.userId,
        name: studentData.name,
        phone: studentData.phone,
        email: studentData.email,
        company: studentData.company,
        position: studentData.position,
    });

    await application.save();

    return application;
};

/**
 * Upload bulk students file for a course
 * 
 * @param {String} applicationId 
 * @param {String} courseId 
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>}
 */
const uploadBulkStudents = async (applicationId, courseId, file) => {
    const application = await ClassApplication.findById(applicationId);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    if (application.status !== "draft") {
        throw ApiError.badRequest("Cannot modify submitted application");
    }

    // Find the course in application
    const courseApp = application.courses.find(
        (c) => c.course.toString() === courseId
    );

    if (!courseApp) {
        throw ApiError.notFound("Course not found in application");
    }

    // Check if individual students exist
    if (courseApp.students.length > 0) {
        throw ApiError.badRequest(
            "Cannot upload bulk file when individual students exist. Please remove individual students first."
        );
    }

    // Parse Excel file
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const studentsData = XLSX.utils.sheet_to_json(sheet);

    if (studentsData.length < BULK_UPLOAD_MINIMUM) {
        throw ApiError.badRequest(
            `Bulk upload requires at least ${BULK_UPLOAD_MINIMUM} students. For ${INDIVIDUAL_STUDENT_LIMIT} or fewer students, please add them individually.`
        );
    }

    // Validate all students
    const validationResults = await Promise.all(
        studentsData.map(async (row) => {
            const studentData = {
                name: row.Name || row.name || row["이름"],
                email: parseEmail(row.Email || row.email || row["이메일"]),
                phone: parsePhone(row.Phone || row.phone || row["전화번호"]),
                company: row.Company || row.company || row["회사"],
                position: row.Position || row.position || row["직급"],
            };

            const validation = await studentValidationService.validateStudent(
                studentData
            );

            return {
                ...studentData,
                userId: validation.userId,
                valid: validation.valid,
                error: validation.error,
            };
        })
    );

    // Check if all students are valid
    const invalidStudents = validationResults.filter((s) => !s.valid);

    if (invalidStudents.length > 0) {
        throw ApiError.badRequest({
            message: "Some students have invalid credentials",
            invalidStudents: invalidStudents.map((s) => ({
                name: s.name,
                email: `${s.email.username}@${s.email.domain}`,
                error: s.error,
            })),
        });
    }

    // Store file path
    courseApp.bulkUploadFile = file.path;

    await application.save();

    return {
        filePath: file.path,
        studentsCount: validationResults.length,
        validatedStudents: validationResults,
    };
};

/**
 * Update payment information
 * 
 * @param {String} applicationId 
 * @param {Object} paymentData 
 * @returns {Promise<ClassApplication>}
 */
const updatePaymentInfo = async (applicationId, paymentData) => {
    const application = await ClassApplication.findById(applicationId);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    if (application.status !== "draft") {
        throw ApiError.badRequest("Cannot modify submitted application");
    }

    // Update payment info
    if (paymentData.paymentMethod) {
        application.paymentInfo.paymentMethod = paymentData.paymentMethod;
    }
    if (paymentData.taxInvoiceRequired !== undefined) {
        application.paymentInfo.taxInvoiceRequired = paymentData.taxInvoiceRequired;
    }

    // Update invoice manager
    if (paymentData.invoiceManager) {
        application.invoiceManager = paymentData.invoiceManager;
    }

    await application.save();

    return application;
};

/**
 * Submit application
 * 
 * @param {String} applicationId 
 * @param {Object} agreements 
 * @returns {Promise<ClassApplication>}
 */
const submitApplication = async (applicationId, agreements) => {
    const application = await ClassApplication.findById(applicationId);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    if (application.status !== "draft") {
        throw ApiError.badRequest("Application already submitted");
    }

    // Validate all courses have students
    for (const courseApp of application.courses) {
        if (
            courseApp.students.length === 0 &&
            !courseApp.bulkUploadFile
        ) {
            throw ApiError.badRequest(
                `Course "${courseApp.courseName}" has no students. Please add at least one student.`
            );
        }
    }

    // Validate agreements
    if (!agreements.paymentAndRefundPolicy || !agreements.refundPolicy) {
        throw ApiError.badRequest("All agreements must be accepted");
    }

    // Update agreements
    application.agreements = agreements;

    // Update status
    application.status = "submitted";
    application.submittedAt = new Date();

    await application.save();

    // Create student enrollments
    await createEnrollmentsFromApplication(application._id);

    // Remove courses from cart
    const courseIds = application.courses.map((c) => c.course.toString());
    await cartService.removeCoursesAfterApplication(
        application.user.toString(),
        courseIds
    );

    return application;
};

/**
 * Create student enrollments from submitted application
 * 
 * @param {String} applicationId 
 * @returns {Promise<Array<StudentEnrollment>>}
 */
const createEnrollmentsFromApplication = async (applicationId) => {
    const application = await ClassApplication.findById(applicationId);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    const enrollments = [];

    for (const courseApp of application.courses) {
        let students = courseApp.students;

        // If bulk upload file exists, parse it
        if (courseApp.bulkUploadFile) {
            const workbook = XLSX.readFile(courseApp.bulkUploadFile);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const studentsData = XLSX.utils.sheet_to_json(sheet);

            students = await Promise.all(
                studentsData.map(async (row) => {
                    const studentData = {
                        name: row.Name || row.name,
                        email: parseEmail(row.Email || row.email),
                        phone: parsePhone(row.Phone || row.phone),
                    };

                    const validation = await studentValidationService.validateStudent(
                        studentData
                    );

                    return {
                        userId: validation.userId,
                        name: studentData.name,
                        phone: studentData.phone,
                        email: studentData.email,
                    };
                })
            );
        }

        // Create enrollments for each student
        for (const student of students) {
            const enrollment = await StudentEnrollment.create({
                classApplication: applicationId,
                course: courseApp.course,
                trainingSchedule: courseApp.trainingSchedule,
                student: student.userId,
                enrollmentStatus: "enrolled",
            });

            enrollments.push(enrollment);
        }
    }

    return enrollments;
};

/**
 * Get user's applications
 * 
 * @param {String} userId 
 * @param {Object} filters - { status, page, limit }
 * @returns {Promise<Object>}
 */
const getUserApplications = async (userId, filters = {}) => {
    const { status, page = 1, limit = 10 } = filters;

    const query = { user: userId };

    if (status) {
        query.status = status;
    }

    const total = await ClassApplication.countDocuments(query);
    const applications = await ClassApplication.find(query)
        .populate("courses.course", "title mainImage")
        .populate("courses.trainingSchedule", "scheduleName startDate endDate")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        applications,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Cancel application
 * 
 * @param {String} applicationId 
 * @param {String} reason 
 * @returns {Promise<ClassApplication>}
 */
const cancelApplication = async (applicationId, reason) => {
    const application = await ClassApplication.findById(applicationId);

    if (!application) {
        throw ApiError.notFound("Application not found");
    }

    if (application.status === "cancelled") {
        throw ApiError.badRequest("Application already cancelled");
    }

    if (application.status === "completed") {
        throw ApiError.badRequest("Cannot cancel completed application");
    }

    application.status = "cancelled";
    application.cancellationReason = reason;

    await application.save();

    // Cancel related enrollments
    await StudentEnrollment.updateMany(
        { classApplication: applicationId },
        {
            enrollmentStatus: "cancelled",
            cancellationReason: reason,
            cancelledAt: new Date(),
        }
    );

    return application;
};

/**
 * Download bulk upload template
 * 
 * @returns {Object} - Template structure
 */
const generateBulkUploadTemplate = () => {
    return {
        filename: "students_bulk_upload_template.xlsx",
        headers: ["Name", "Email", "Phone", "Company", "Position"],
        instructions: [
            "Fill in student information row by row",
            "Name, Email, and Phone are REQUIRED fields",
            "Phone format: 01012345678 (11 digits, no hyphens)",
            "Email format: example@domain.com",
            "Company and Position are optional",
            `At least ${BULK_UPLOAD_MINIMUM} students required for bulk upload`,
            "All students MUST have existing user accounts",
        ],
        sampleData: [
            {
                Name: "홍길동",
                Email: "hong@example.com",
                Phone: "01012345678",
                Company: "ABC Company",
                Position: "Manager",
            },
            {
                Name: "김영희",
                Email: "kim@example.com",
                Phone: "01087654321",
                Company: "XYZ Corp",
                Position: "Developer",
            },
        ],
    };
};

// Helper functions

function formatPeriod(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };

    return `${formatDate(start)}~${formatDate(end)}`;
}

function parseEmail(emailString) {
    if (!emailString) {
        throw new Error("Email is required");
    }

    const parts = emailString.split("@");
    if (parts.length !== 2) {
        throw new Error("Invalid email format");
    }

    return {
        username: parts[0],
        domain: parts[1],
    };
}

function parsePhone(phoneString) {
    if (!phoneString) {
        throw new Error("Phone is required");
    }

    // Remove all non-digit characters
    const digits = phoneString.replace(/\D/g, "");

    if (digits.length !== 11) {
        throw new Error("Phone must be 11 digits");
    }

    return {
        prefix: digits.substring(0, 3),
        middle: digits.substring(3, 7),
        last: digits.substring(7, 11),
    };
}

module.exports = {
    createDraftApplication,
    getApplicationById,
    addStudentToCourse,
    uploadBulkStudents,
    updatePaymentInfo,
    submitApplication,
    createEnrollmentsFromApplication,
    getUserApplications,
    cancelApplication,
    generateBulkUploadTemplate,
};
