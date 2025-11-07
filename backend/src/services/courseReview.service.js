const CourseReview = require("../models/courseReview.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

const getReviewsByCourse = async (courseId, includeUnapproved = false) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const filter = { course: courseId };
    if (!includeUnapproved) {
        filter.isApproved = true;
    }

    const reviews = await CourseReview.find(filter)
        .sort({ createdAt: -1 })
        .populate("user", "fullName");

    return reviews;
};

const createReview = async (courseId, reviewData, userId, file) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    if (file) {
        reviewData.avatar = getFileUrl("REVIEWS", file.filename);
    }

    const review = await CourseReview.create({
        ...reviewData,
        course: courseId,
        user: userId,
    });

    if (reviewData.rating) {
        const reviews = await CourseReview.find({ course: courseId, rating: { $exists: true } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Course.findByIdAndUpdate(courseId, { averageRating });
    }

    return review;
};

const updateReview = async (reviewId, updates) => {
    const review = await CourseReview.findByIdAndUpdate(reviewId, updates, {
        new: true,
        runValidators: true,
    });

    if (!review) {
        throw ApiError.notFound("리뷰를 찾을 수 없습니다");
    }

    if (updates.rating) {
        const reviews = await CourseReview.find({ course: review.course, rating: { $exists: true } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        await Course.findByIdAndUpdate(review.course, { averageRating });
    }

    return review;
};

const deleteReview = async (reviewId) => {
    const review = await CourseReview.findById(reviewId);
    if (!review) {
        throw ApiError.notFound("리뷰를 찾을 수 없습니다");
    }

    if (review.avatar) {
        deleteFileByUrl(review.avatar);
    }

    const courseId = review.course;
    await CourseReview.findByIdAndDelete(reviewId);

    const reviews = await CourseReview.find({ course: courseId, rating: { $exists: true } });
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    
    await Course.findByIdAndUpdate(courseId, { averageRating });

    return { message: "리뷰가 성공적으로 삭제되었습니다" };
};

module.exports = {
    getReviewsByCourse,
    createReview,
    updateReview,
    deleteReview,
};

