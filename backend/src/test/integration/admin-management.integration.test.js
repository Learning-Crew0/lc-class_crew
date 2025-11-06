const request = require("supertest");
const app = require("../../app");
const Admin = require("../../models/admin.model");
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

describe("Admin Management Integration Tests", () => {
    const validAdminData = {
        email: "admin@classcrew.com",
        username: "admin",
        password: "Admin1234!",
        fullName: "관리자",
        role: "admin",
    };

    const validUserData = {
        email: "user@example.com",
        username: "testuser",
        password: "Test1234!",
        fullName: "홍길동",
        gender: "남성",
        phone: "01012345678",
        dob: new Date("1990-01-01"),
        memberType: "재직자",
        agreements: {
            termsOfService: true,
            privacyPolicy: true,
        },
    };

    describe("POST /api/v1/admin/login", () => {
        beforeEach(async () => {
            await Admin.create(validAdminData);
        });

        it("should login admin with username", async () => {
            const response = await request(app)
                .post("/api/v1/admin/login")
                .send({
                    username: validAdminData.username,
                    password: validAdminData.password,
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("관리자 로그인 성공");
            expect(response.body.data.admin.username).toBe(
                validAdminData.username
            );
            expect(response.body.data.admin.role).toBe("admin");
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data).toHaveProperty("refreshToken");
        });

        it("should login admin with email", async () => {
            const response = await request(app)
                .post("/api/v1/admin/login")
                .send({
                    email: validAdminData.email,
                    password: validAdminData.password,
                })
                .expect(200);

            expect(response.body.data.admin.email).toBe(validAdminData.email);
        });

        it("should reject invalid admin credentials", async () => {
            const response = await request(app)
                .post("/api/v1/admin/login")
                .send({
                    username: validAdminData.username,
                    password: "WrongPassword!",
                })
                .expect(401);

            expect(response.body.message).toBe(
                "관리자 정보가 올바르지 않습니다"
            );
        });

        it("should reject inactive admin", async () => {
            await Admin.findOneAndUpdate(
                { username: validAdminData.username },
                { isActive: false }
            );

            const response = await request(app)
                .post("/api/v1/admin/login")
                .send({
                    username: validAdminData.username,
                    password: validAdminData.password,
                })
                .expect(403);

            expect(response.body.message).toBe("비활성화된 계정입니다");
        });
    });

    describe("Admin Protected Routes", () => {
        let adminToken;
        let adminId;

        beforeEach(async () => {
            const admin = await Admin.create(validAdminData);
            adminId = admin._id.toString();

            const loginRes = await request(app)
                .post("/api/v1/admin/login")
                .send({
                    username: validAdminData.username,
                    password: validAdminData.password,
                });

            adminToken = loginRes.body.data.token;
        });

        describe("GET /api/v1/admin/profile", () => {
            it("should get admin profile", async () => {
                const response = await request(app)
                    .get("/api/v1/admin/profile")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("관리자 프로필 조회 성공");
                expect(response.body.data.admin.username).toBe(
                    validAdminData.username
                );
            });

            it("should reject without token", async () => {
                await request(app).get("/api/v1/admin/profile").expect(401);
            });
        });

        describe("PUT /api/v1/admin/password", () => {
            it("should change admin password", async () => {
                const response = await request(app)
                    .put("/api/v1/admin/password")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({
                        currentPassword: validAdminData.password,
                        newPassword: "NewAdmin456!",
                    })
                    .expect(200);

                expect(response.body.message).toBe("비밀번호 변경 성공");

                const loginRes = await request(app)
                    .post("/api/v1/admin/login")
                    .send({
                        username: validAdminData.username,
                        password: "NewAdmin456!",
                    })
                    .expect(200);

                expect(loginRes.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/admin/admins", () => {
            it("should get all admins with pagination", async () => {
                await Admin.create({
                    email: "admin2@classcrew.com",
                    username: "admin2",
                    password: "Admin1234!",
                    fullName: "관리자2",
                    role: "admin",
                });

                const response = await request(app)
                    .get("/api/v1/admin/admins?page=1&limit=10")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body.data.admins).toBeInstanceOf(Array);
                expect(response.body.data.admins.length).toBe(2);
                expect(response.body.data.pagination).toBeDefined();
                expect(response.body.data.pagination.currentPage).toBe(1);
                expect(response.body.data.pagination.totalAdmins).toBe(2);
            });
        });

        describe("POST /api/v1/admin/admins", () => {
            it("should create new admin", async () => {
                const newAdmin = {
                    email: "newadmin@classcrew.com",
                    username: "newadmin",
                    password: "Admin1234!",
                    fullName: "신규 관리자",
                    role: "admin",
                };

                const response = await request(app)
                    .post("/api/v1/admin/admins")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(newAdmin)
                    .expect(201);

                expect(response.body.data.admin.username).toBe(
                    newAdmin.username
                );
                expect(response.body.data.admin.email).toBe(newAdmin.email);

                const admin = await Admin.findOne({
                    username: newAdmin.username,
                });
                expect(admin).toBeTruthy();
            });

            it("should reject duplicate admin email", async () => {
                const response = await request(app)
                    .post("/api/v1/admin/admins")
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send(validAdminData)
                    .expect(409);

                expect(response.body.message).toBe("이미 등록된 이메일입니다");
            });
        });

        describe("DELETE /api/v1/admin/admins/:id", () => {
            it("should delete admin", async () => {
                const admin2 = await Admin.create({
                    email: "admin2@classcrew.com",
                    username: "admin2",
                    password: "Admin1234!",
                    fullName: "관리자2",
                    role: "admin",
                });

                await request(app)
                    .delete(`/api/v1/admin/admins/${admin2._id}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(200);

                const deletedAdmin = await Admin.findById(admin2._id);
                expect(deletedAdmin).toBeNull();
            });

            it("should not allow admin to delete themselves", async () => {
                const response = await request(app)
                    .delete(`/api/v1/admin/admins/${adminId}`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .expect(400);

                expect(response.body.message).toBe(
                    "자신의 계정을 삭제할 수 없습니다"
                );
            });
        });

        describe("PATCH /api/v1/admin/admins/:id/status", () => {
            it("should toggle admin status", async () => {
                const admin2 = await Admin.create({
                    email: "admin2@classcrew.com",
                    username: "admin2",
                    password: "Admin1234!",
                    fullName: "관리자2",
                    role: "admin",
                });

                const response = await request(app)
                    .patch(`/api/v1/admin/admins/${admin2._id}/status`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({ isActive: false })
                    .expect(200);

                expect(response.body.message).toContain("비활성화");
                expect(response.body.data.admin.isActive).toBe(false);
            });

            it("should not allow admin to deactivate themselves", async () => {
                const response = await request(app)
                    .patch(`/api/v1/admin/admins/${adminId}/status`)
                    .set("Authorization", `Bearer ${adminToken}`)
                    .send({ isActive: false })
                    .expect(400);

                expect(response.body.message).toBe(
                    "자신의 계정 상태를 변경할 수 없습니다"
                );
            });
        });

        describe("User Management by Admin", () => {
            describe("GET /api/v1/admin/users", () => {
                beforeEach(async () => {
                    await User.create([
                        {
                            ...validUserData,
                            email: "user1@test.com",
                            username: "user1",
                        },
                        {
                            ...validUserData,
                            email: "user2@test.com",
                            username: "user2",
                            phone: "01098765432",
                        },
                        {
                            ...validUserData,
                            email: "user3@test.com",
                            username: "user3",
                            phone: "01087654321",
                            memberType: "취업준비생",
                        },
                    ]);
                });

                it("should get all users with pagination", async () => {
                    const response = await request(app)
                        .get("/api/v1/admin/users?page=1&limit=10")
                        .set("Authorization", `Bearer ${adminToken}`)
                        .expect(200);

                    expect(response.body.data.users).toBeInstanceOf(Array);
                    expect(response.body.data.users.length).toBe(3);
                    expect(response.body.data.pagination).toBeDefined();
                });

                it("should filter users by member type", async () => {
                    const response = await request(app)
                        .get("/api/v1/admin/users?memberType=취업준비생")
                        .set("Authorization", `Bearer ${adminToken}`)
                        .expect(200);

                    expect(response.body.data.users.length).toBe(1);
                    expect(response.body.data.users[0].memberType).toBe(
                        "취업준비생"
                    );
                });

                it("should search users", async () => {
                    const response = await request(app)
                        .get("/api/v1/admin/users?search=user1@test.com")
                        .set("Authorization", `Bearer ${adminToken}`)
                        .expect(200);

                    expect(response.body.data.users.length).toBeGreaterThan(0);
                });
            });

            describe("PATCH /api/v1/admin/users/:id/toggle-status", () => {
                it("should deactivate user", async () => {
                    const user = await User.create(validUserData);

                    const response = await request(app)
                        .patch(`/api/v1/admin/users/${user._id}/toggle-status`)
                        .set("Authorization", `Bearer ${adminToken}`)
                        .send({ isActive: false })
                        .expect(200);

                    expect(response.body.message).toContain("비활성화");
                    expect(response.body.data.user.isActive).toBe(false);
                });
            });

            describe("DELETE /api/v1/admin/users/:id", () => {
                it("should delete user", async () => {
                    const user = await User.create(validUserData);

                    await request(app)
                        .delete(`/api/v1/admin/users/${user._id}`)
                        .set("Authorization", `Bearer ${adminToken}`)
                        .expect(200);

                    const deletedUser = await User.findById(user._id);
                    expect(deletedUser).toBeNull();
                });
            });
        });
    });
});
