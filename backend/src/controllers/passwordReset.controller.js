const User = require("../models/user.model");
const PasswordResetToken = require("../models/passwordResetToken.model");
const smsService = require("../services/sms.service");
const tokenService = require("../utils/tokenService.util");
const asyncHandler = require("../utils/asyncHandler.util");
const { successResponse } = require("../utils/response.util");
const ApiError = require("../utils/apiError.util");
const bcrypt = require("bcryptjs");

/**
 * Step 1: Initiate password reset
 * POST /api/v1/auth/password-reset/initiate
 */
const initiatePasswordReset = asyncHandler(async (req, res) => {
    const { name, phoneNumber } = req.body;

    // Format phone number (remove spaces, dashes)
    const formattedPhone = phoneNumber.replace(/[\s-]/g, "");

    // Find user by name and phone
    const user = await User.findOne({
        fullName: name,
        phone: formattedPhone,
    });

    if (!user) {
        throw ApiError.notFound(
            "아이디 정보를 찾을 수 없습니다. 다시 한번 확인해주세요"
        );
    }

    // Generate 6-digit verification code
    const verificationCode = tokenService.generateVerificationCode();

    // Create or update password reset token
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    const resetToken = await PasswordResetToken.create({
        userId: user._id,
        verificationCode: verificationCode,
        phoneNumber: formattedPhone,
        expiresAt: expiresAt,
        isUsed: false,
        attempts: 0,
    });

    // Send SMS
    await smsService.sendVerificationCode(formattedPhone, verificationCode);

    return successResponse(
        res,
        {
            sessionId: resetToken._id,
            expiresIn: 900, // 15 minutes in seconds
        },
        "인증번호가 발송되었습니다"
    );
});

/**
 * Step 2: Verify code
 * POST /api/v1/auth/password-reset/verify-code
 */
const verifyCode = asyncHandler(async (req, res) => {
    const { sessionId, verificationCode } = req.body;

    // Find reset token
    const resetToken = await PasswordResetToken.findById(sessionId).populate(
        "userId"
    );

    if (!resetToken) {
        throw ApiError.badRequest("유효하지 않은 세션입니다");
    }

    // Check if expired
    if (new Date() > resetToken.expiresAt) {
        throw ApiError.badRequest(
            "인증번호가 만료되었습니다. 다시 요청해주세요"
        );
    }

    // Check if already used
    if (resetToken.isUsed) {
        throw ApiError.badRequest("이미 사용된 인증번호입니다");
    }

    // Check attempts limit
    if (resetToken.attempts >= 5) {
        throw ApiError.tooManyRequests(
            "인증 시도 횟수를 초과했습니다. 다시 시도해주세요"
        );
    }

    // Verify code
    if (resetToken.verificationCode !== verificationCode) {
        // Increment attempts
        resetToken.attempts += 1;
        await resetToken.save();

        throw ApiError.badRequest(
            "인증번호가 일치하지 않습니다. 다시 확인해주세요",
            null,
            {
                attemptsRemaining: 5 - resetToken.attempts,
            }
        );
    }

    // Success - generate password reset token
    const passwordResetToken = tokenService.generateResetToken(
        resetToken.userId._id
    );

    // Update reset token
    resetToken.isVerified = true;
    resetToken.token = passwordResetToken;
    await resetToken.save();

    return successResponse(
        res,
        {
            resetToken: passwordResetToken,
            userId: resetToken.userId._id,
            username: resetToken.userId.username,
        },
        "인증이 완료되었습니다"
    );
});

/**
 * Step 3: Reset password
 * POST /api/v1/auth/password-reset/reset
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body;

    // Validate password strength
    if (newPassword.length < 8) {
        throw ApiError.badRequest("비밀번호는 8자 이상이어야 합니다");
    }

    // Find and validate reset token
    const tokenRecord = await PasswordResetToken.findOne({
        token: resetToken,
        isUsed: false,
        isVerified: true,
    }).populate("userId");

    if (!tokenRecord) {
        throw ApiError.badRequest("유효하지 않은 요청입니다");
    }

    // Check if expired
    if (new Date() > tokenRecord.expiresAt) {
        throw ApiError.badRequest(
            "인증 시간이 만료되었습니다. 다시 시도해주세요"
        );
    }

    // Verify JWT token
    try {
        tokenService.verifyResetToken(resetToken);
    } catch (error) {
        throw ApiError.badRequest("유효하지 않은 토큰입니다");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.findByIdAndUpdate(tokenRecord.userId._id, {
        password: hashedPassword,
        updatedAt: new Date(),
    });

    // Mark token as used
    tokenRecord.isUsed = true;
    await tokenRecord.save();

    return successResponse(
        res,
        null,
        "비밀번호가 성공적으로 변경되었습니다"
    );
});

/**
 * Find user ID by name and phone
 * POST /api/v1/auth/find-id
 */
const findUserId = asyncHandler(async (req, res) => {
    const { name, phoneNumber } = req.body;

    // Format phone number
    const formattedPhone = phoneNumber.replace(/[\s-]/g, "");

    // Find users by name and phone
    const users = await User.find({
        fullName: name,
        phone: formattedPhone,
    }).select("username");

    if (!users || users.length === 0) {
        throw ApiError.notFound("일치하는 아이디를 찾을 수 없습니다");
    }

    // Extract usernames
    const userIds = users.map((user) => user.username);

    return successResponse(
        res,
        {
            userIds: userIds,
        },
        "고객님의 정보와 일치하는 아이디 목록입니다"
    );
});

module.exports = {
    initiatePasswordReset,
    verifyCode,
    resetPassword,
    findUserId,
};

