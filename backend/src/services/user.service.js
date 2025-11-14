const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");

const getAllUsers = async (_filters = {}, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        memberType,
        isActive,
    } = options;

    const query = {};

    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }

    if (memberType) {
        query.memberType = memberType;
    }

    if (typeof isActive === "boolean") {
        query.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [users, total] = await Promise.all([
        User.find(query).sort(sort).skip(skip).limit(limit).lean(),
        User.countDocuments(query),
    ]);

    return {
        users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user; // Return null if not found (no error throw)
};

const createUser = async (userData) => {
    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) {
        throw ApiError.conflict("이미 등록된 이메일입니다");
    }

    const existingUsername = await User.findOne({
        username: userData.username,
    });
    if (existingUsername) {
        throw ApiError.conflict("이미 사용 중인 사용자 ID입니다");
    }

    const existingPhone = await User.findOne({ phone: userData.phone });
    if (existingPhone) {
        throw ApiError.conflict("이미 등록된 휴대전화 번호입니다");
    }

    const user = await User.create(userData);
    return user;
};

const updateUser = async (userId, updates) => {
    const restrictedFields = ["password", "role"];
    restrictedFields.forEach((field) => delete updates[field]);

    if (updates.email) {
        const existingEmail = await User.findOne({
            email: updates.email,
            _id: { $ne: userId },
        });
        if (existingEmail) {
            throw ApiError.conflict("이미 등록된 이메일입니다");
        }
    }

    if (updates.username) {
        const existingUsername = await User.findOne({
            username: updates.username,
            _id: { $ne: userId },
        });
        if (existingUsername) {
            throw ApiError.conflict("이미 사용 중인 사용자 ID입니다");
        }
    }

    if (updates.phone) {
        const existingPhone = await User.findOne({
            phone: updates.phone,
            _id: { $ne: userId },
        });
        if (existingPhone) {
            throw ApiError.conflict("이미 등록된 휴대전화 번호입니다");
        }
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    return user;
};

const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    return { message: "사용자가 성공적으로 삭제되었습니다" };
};

const toggleUserStatus = async (userId, isActive) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
    );

    if (!user) {
        throw ApiError.notFound("사용자를 찾을 수 없습니다");
    }

    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
};
