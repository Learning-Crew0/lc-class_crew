const Promotion = require("../models/promotion.model");
const Course = require("../models/course.model");
const ApiError = require("../utils/apiError.util");
const { getFileUrl, deleteFileByUrl } = require("../config/fileStorage");

const getPromotionsByCourse = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    const promotions = await Promotion.find({
        course: courseId,
        isActive: true,
    }).sort({ displayOrder: 1, createdAt: -1 });

    return promotions;
};

const createPromotion = async (courseId, promotionData, files) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw ApiError.notFound("코스를 찾을 수 없습니다");
    }

    if (!files || files.length === 0) {
        throw ApiError.badRequest("프로모션 이미지를 업로드해주세요");
    }

    const images = files.map((file) => getFileUrl("PROMOTIONS", file.filename));

    const promotion = await Promotion.create({
        ...promotionData,
        course: courseId,
        images,
    });

    return promotion;
};

const updatePromotion = async (promotionId, updates) => {
    const promotion = await Promotion.findByIdAndUpdate(promotionId, updates, {
        new: true,
        runValidators: true,
    });

    if (!promotion) {
        throw ApiError.notFound("프로모션을 찾을 수 없습니다");
    }

    return promotion;
};

const deletePromotion = async (promotionId, imageUrl) => {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
        throw ApiError.notFound("프로모션을 찾을 수 없습니다");
    }

    if (imageUrl) {
        promotion.images = promotion.images.filter((img) => img !== imageUrl);
        deleteFileByUrl(imageUrl);

        if (promotion.images.length === 0) {
            await Promotion.findByIdAndDelete(promotionId);
            return { message: "프로모션이 성공적으로 삭제되었습니다" };
        }

        await promotion.save();
        return { message: "이미지가 성공적으로 삭제되었습니다" };
    }

    promotion.images.forEach((img) => deleteFileByUrl(img));
    await Promotion.findByIdAndDelete(promotionId);
    return { message: "프로모션이 성공적으로 삭제되었습니다" };
};

module.exports = {
    getPromotionsByCourse,
    createPromotion,
    updatePromotion,
    deletePromotion,
};
