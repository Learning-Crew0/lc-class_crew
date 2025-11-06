const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user.model");
const { connectDB, closeDB, clearDB } = require("../setup");

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await closeDB();
});

beforeEach(async () => {
    await clearDB();
});

describe("User Registration & Authentication Integration Tests", () => {
    const validUserData = {
        email: "test@example.com",
        username: "testuser",
        password: "Test1234!",
        fullName: "홍길동",
        gender: "남성",
        phone: "01012345678",
        dob: "1990-01-01",
        memberType: "재직자",
        agreements: {
            termsOfService: true,
            privacyPolicy: true,
            marketingConsent: false,
        },
    };

    describe("POST /api/v1/auth/register", () => {
        it("should register a new user successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("회원가입이 완료되었습니다");
            expect(response.body.data.user).toHaveProperty("_id");
            expect(response.body.data.user.email).toBe(validUserData.email);
            expect(response.body.data.user.username).toBe(
                validUserData.username
            );
            expect(response.body.data.user.fullName).toBe(
                validUserData.fullName
            );
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data).toHaveProperty("refreshToken");

            const user = await User.findOne({ email: validUserData.email });
            expect(user).toBeTruthy();
            expect(user.isActive).toBe(true);
            expect(user.isVerified).toBe(false);
        });

        it("should reject registration with missing required fields", async () => {
            const invalidData = {
                email: "test@example.com",
                password: "Test1234!",
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should reject invalid email format", async () => {
            const userData = { ...validUserData, email: "invalid-email" };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should reject invalid phone number format", async () => {
            const userData = { ...validUserData, phone: "123456" };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should reject password less than 8 characters", async () => {
            const userData = { ...validUserData, password: "Test1!" };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should reject duplicate email", async () => {
            await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData)
                .expect(201);

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData)
                .expect(409);

            expect(response.body.message).toBe("이미 등록된 이메일입니다");
        });

        it("should reject duplicate username", async () => {
            await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData)
                .expect(201);

            const userData2 = {
                ...validUserData,
                email: "another@example.com",
                phone: "01098765432",
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData2)
                .expect(409);

            expect(response.body.message).toBe(
                "이미 사용 중인 사용자 ID입니다"
            );
        });

        it("should reject duplicate phone number", async () => {
            await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData)
                .expect(201);

            const userData2 = {
                ...validUserData,
                email: "another@example.com",
                username: "anotheruser",
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData2)
                .expect(409);

            expect(response.body.message).toBe(
                "이미 등록된 휴대전화 번호입니다"
            );
        });

        it("should reject without terms of service agreement", async () => {
            const userData = {
                ...validUserData,
                agreements: {
                    termsOfService: false,
                    privacyPolicy: true,
                },
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should reject without privacy policy agreement", async () => {
            const userData = {
                ...validUserData,
                agreements: {
                    termsOfService: true,
                    privacyPolicy: false,
                },
            };

            const response = await request(app)
                .post("/api/v1/auth/register")
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe("POST /api/v1/auth/login", () => {
        beforeEach(async () => {
            await User.create({
                ...validUserData,
                dob: new Date(validUserData.dob),
            });
        });

        it("should login with email successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: validUserData.email,
                    password: validUserData.password,
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("로그인 성공");
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data).toHaveProperty("refreshToken");
            expect(response.body.data.user.email).toBe(validUserData.email);
        });

        it("should login with username successfully", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: validUserData.username,
                    password: validUserData.password,
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.username).toBe(
                validUserData.username
            );
        });

        it("should reject invalid password", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: validUserData.email,
                    password: "WrongPassword123!",
                })
                .expect(401);

            expect(response.body.message).toBe(
                "사용자 ID 또는 비밀번호가 올바르지 않습니다"
            );
        });

        it("should reject non-existent user", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: "nonexistent@example.com",
                    password: "Test1234!",
                })
                .expect(401);

            expect(response.body.message).toBe(
                "사용자 ID 또는 비밀번호가 올바르지 않습니다"
            );
        });

        it("should reject login for inactive user", async () => {
            await User.findOneAndUpdate(
                { email: validUserData.email },
                { isActive: false }
            );

            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: validUserData.email,
                    password: validUserData.password,
                })
                .expect(403);

            expect(response.body.message).toBe("비활성화된 계정입니다");
        });

        it("should update lastLogin timestamp on successful login", async () => {
            const beforeLogin = await User.findOne({
                email: validUserData.email,
            });
            expect(beforeLogin.lastLogin).toBeUndefined();

            await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: validUserData.email,
                    password: validUserData.password,
                })
                .expect(200);

            const afterLogin = await User.findOne({
                email: validUserData.email,
            });
            expect(afterLogin.lastLogin).toBeTruthy();
        });
    });

    describe("GET /api/v1/user/profile", () => {
        let authToken;
        let userId;

        beforeEach(async () => {
            const registerRes = await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData);

            authToken = registerRes.body.data.token;
            userId = registerRes.body.data.user._id;
        });

        it("should get user profile with valid token", async () => {
            const response = await request(app)
                .get("/api/v1/user/profile")
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("프로필 조회 성공");
            expect(response.body.data._id).toBe(userId);
            expect(response.body.data.email).toBe(validUserData.email);
            expect(response.body.data.agreements).toBeDefined();
        });

        it("should reject without token", async () => {
            const response = await request(app)
                .get("/api/v1/user/profile")
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it("should reject with invalid token", async () => {
            const response = await request(app)
                .get("/api/v1/user/profile")
                .set("Authorization", "Bearer invalid-token")
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe("PUT /api/v1/user/profile", () => {
        let authToken;

        beforeEach(async () => {
            const registerRes = await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData);

            authToken = registerRes.body.data.token;
        });

        it("should update allowed fields", async () => {
            const updates = {
                fullName: "김철수",
                phone: "01098765432",
                profilePicture: "https://example.com/profile.jpg",
            };

            const response = await request(app)
                .put("/api/v1/user/profile")
                .set("Authorization", `Bearer ${authToken}`)
                .send(updates)
                .expect(200);

            expect(response.body.data.fullName).toBe(updates.fullName);
            expect(response.body.data.phone).toBe(updates.phone);
            expect(response.body.data.profilePicture).toBe(
                updates.profilePicture
            );
        });

        it("should not update restricted fields", async () => {
            const originalEmail = validUserData.email;
            const updates = {
                email: "newemail@example.com",
                role: "admin",
                memberType: "admin",
            };

            await request(app)
                .put("/api/v1/user/profile")
                .set("Authorization", `Bearer ${authToken}`)
                .send(updates)
                .expect(200);

            const user = await User.findOne({ email: originalEmail });
            expect(user.email).toBe(originalEmail);
            expect(user.role).toBe("user");
            expect(user.memberType).toBe(validUserData.memberType);
        });
    });

    describe("POST /api/v1/user/change-password", () => {
        let authToken;

        beforeEach(async () => {
            const registerRes = await request(app)
                .post("/api/v1/auth/register")
                .send(validUserData);

            authToken = registerRes.body.data.token;
        });

        it("should change password successfully", async () => {
            const response = await request(app)
                .post("/api/v1/user/change-password")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    currentPassword: validUserData.password,
                    newPassword: "NewPass456!",
                })
                .expect(200);

            expect(response.body.message).toBe("비밀번호 변경 성공");

            const loginRes = await request(app)
                .post("/api/v1/auth/login")
                .send({
                    emailOrUsername: validUserData.email,
                    password: "NewPass456!",
                })
                .expect(200);

            expect(loginRes.body.success).toBe(true);
        });

        it("should reject wrong current password", async () => {
            const response = await request(app)
                .post("/api/v1/user/change-password")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    currentPassword: "WrongPassword!",
                    newPassword: "NewPass456!",
                })
                .expect(400);

            expect(response.body.message).toBe(
                "현재 비밀번호가 올바르지 않습니다"
            );
        });

        it("should reject same password", async () => {
            const response = await request(app)
                .post("/api/v1/user/change-password")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    currentPassword: validUserData.password,
                    newPassword: validUserData.password,
                })
                .expect(400);

            expect(response.body.message).toBe(
                "새 비밀번호는 현재 비밀번호와 달라야 합니다"
            );
        });

        it("should reject new password less than 8 characters", async () => {
            const response = await request(app)
                .post("/api/v1/user/change-password")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    currentPassword: validUserData.password,
                    newPassword: "New1!",
                })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });
});
