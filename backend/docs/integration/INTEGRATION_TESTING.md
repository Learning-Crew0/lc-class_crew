# Integration Testing Guide - LC Class Crew Backend

## Overview

This guide covers comprehensive integration testing for the LC Class Crew backend API, focusing on User Registration, Authentication, and Admin Management flows.

## Test Setup

### Prerequisites

1. **Install Dependencies**
```bash
npm install --save-dev jest supertest
```

2. **Environment Setup**
Create `.env.test` file:
```env
NODE_ENV=test
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lc-class-crew-test
JWT_SECRET=test-secret-key-minimum-32-characters-long
JWT_EXPIRE=1d
JWT_REFRESH_SECRET=test-refresh-secret-key-minimum-32
JWT_REFRESH_EXPIRE=7d
```

3. **Test Database**
- Use a separate test database
- Clear database before each test suite
- Seed test data when needed

### Test Structure

```
src/test/
├── integration/
│   ├── auth.test.js          # Authentication tests
│   ├── user.test.js          # User management tests
│   ├── admin.test.js         # Admin management tests
│   └── setup.js              # Test setup and teardown
└── unit/
    └── utils.test.js         # Utility function tests
```

## Integration Test Suites

### 1. User Registration Tests

**File:** `src/test/integration/auth.test.js`

#### Test Cases

##### 1.1 Successful User Registration
```javascript
describe('POST /api/v1/auth/register', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test1234!',
      fullName: '홍길동',
      gender: '남성',
      phone: '01012345678',
      dob: '1990-01-01',
      memberType: '재직자',
      agreements: {
        termsOfService: true,
        privacyPolicy: true,
        marketingConsent: false
      }
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('회원가입이 완료되었습니다');
    expect(response.body.data.user).toHaveProperty('_id');
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.user.username).toBe(userData.username);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('refreshToken');
  });
});
```

##### 1.2 Registration Validation Errors
```javascript
it('should reject registration with missing required fields', async () => {
  const invalidData = {
    email: 'test@example.com',
    password: 'Test1234!'
    // Missing other required fields
  };

  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(invalidData)
    .expect(400);

  expect(response.body.success).toBe(false);
  expect(response.body).toHaveProperty('errors');
});

it('should reject invalid email format', async () => {
  const userData = { /* ... */ email: 'invalid-email' };
  
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(400);

  expect(response.body.message).toContain('이메일');
});

it('should reject invalid phone number', async () => {
  const userData = { /* ... */ phone: '123456' };
  
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(400);

  expect(response.body.message).toContain('휴대전화');
});

it('should reject password less than 8 characters', async () => {
  const userData = { /* ... */ password: 'Test1!' };
  
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(400);

  expect(response.body.message).toContain('비밀번호');
});
```

##### 1.3 Duplicate User Detection
```javascript
it('should reject duplicate email', async () => {
  const userData = { /* valid user data */ };
  
  // First registration
  await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(201);

  // Attempt duplicate registration
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(409);

  expect(response.body.message).toBe('이미 등록된 이메일입니다');
});

it('should reject duplicate username', async () => {
  const user1 = { /* ... */ email: 'user1@test.com', username: 'testuser' };
  const user2 = { /* ... */ email: 'user2@test.com', username: 'testuser' };
  
  await request(app).post('/api/v1/auth/register').send(user1).expect(201);
  
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(user2)
    .expect(409);

  expect(response.body.message).toBe('이미 사용 중인 사용자 ID입니다');
});

it('should reject duplicate phone number', async () => {
  const user1 = { /* ... */ phone: '01012345678' };
  const user2 = { /* ... */ phone: '01012345678', email: 'user2@test.com' };
  
  await request(app).post('/api/v1/auth/register').send(user1).expect(201);
  
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(user2)
    .expect(409);

  expect(response.body.message).toBe('이미 등록된 휴대전화 번호입니다');
});
```

##### 1.4 Agreement Validation
```javascript
it('should reject without terms of service agreement', async () => {
  const userData = {
    /* ... */
    agreements: {
      termsOfService: false,
      privacyPolicy: true
    }
  };

  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(400);

  expect(response.body.message).toContain('이용약관');
});

it('should reject without privacy policy agreement', async () => {
  const userData = {
    /* ... */
    agreements: {
      termsOfService: true,
      privacyPolicy: false
    }
  };

  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(400);

  expect(response.body.message).toContain('개인정보');
});
```

### 2. User Login Tests

##### 2.1 Successful Login
```javascript
describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    // Create test user
    await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test1234!',
      fullName: '홍길동',
      gender: '남성',
      phone: '01012345678',
      dob: new Date('1990-01-01'),
      memberType: '재직자',
      agreements: {
        termsOfService: true,
        privacyPolicy: true
      }
    });
  });

  it('should login with email successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        emailOrUsername: 'test@example.com',
        password: 'Test1234!'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('로그인 성공');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  it('should login with username successfully', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        emailOrUsername: 'testuser',
        password: 'Test1234!'
      })
      .expect(200);

    expect(response.body.data.user.username).toBe('testuser');
  });
});
```

##### 2.2 Login Failure Cases
```javascript
it('should reject invalid credentials', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      emailOrUsername: 'test@example.com',
      password: 'WrongPassword123!'
    })
    .expect(401);

  expect(response.body.message).toBe('사용자 ID 또는 비밀번호가 올바르지 않습니다');
});

it('should reject non-existent user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      emailOrUsername: 'nonexistent@example.com',
      password: 'Test1234!'
    })
    .expect(401);
});

it('should reject login for inactive user', async () => {
  await User.findOneAndUpdate(
    { email: 'test@example.com' },
    { isActive: false }
  );

  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      emailOrUsername: 'test@example.com',
      password: 'Test1234!'
    })
    .expect(403);

  expect(response.body.message).toBe('비활성화된 계정입니다');
});
```

### 3. User Profile Tests

##### 3.1 Get Profile
```javascript
describe('GET /api/v1/user/profile', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Register and login user
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send(validUserData);
    
    authToken = registerRes.body.data.token;
    userId = registerRes.body.data.user._id;
  });

  it('should get user profile with valid token', async () => {
    const response = await request(app)
      .get('/api/v1/user/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('email');
    expect(response.body.data).toHaveProperty('fullName');
    expect(response.body.data.agreements).toBeDefined();
  });

  it('should reject without token', async () => {
    await request(app)
      .get('/api/v1/user/profile')
      .expect(401);
  });

  it('should reject with invalid token', async () => {
    await request(app)
      .get('/api/v1/user/profile')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});
```

##### 3.2 Update Profile
```javascript
describe('PUT /api/v1/user/profile', () => {
  it('should update allowed fields', async () => {
    const updates = {
      fullName: '김철수',
      phone: '01098765432',
      profilePicture: 'https://example.com/profile.jpg'
    };

    const response = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updates)
      .expect(200);

    expect(response.body.data.fullName).toBe(updates.fullName);
    expect(response.body.data.phone).toBe(updates.phone);
  });

  it('should not update restricted fields', async () => {
    const updates = {
      email: 'newemail@example.com',
      role: 'admin',
      memberType: 'admin'
    };

    const response = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updates)
      .expect(200);

    // Verify restricted fields were not updated
    const user = await User.findById(userId);
    expect(user.email).not.toBe(updates.email);
    expect(user.role).not.toBe(updates.role);
  });
});
```

### 4. Password Change Tests

```javascript
describe('POST /api/v1/user/change-password', () => {
  it('should change password successfully', async () => {
    const response = await request(app)
      .post('/api/v1/user/change-password')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentPassword: 'Test1234!',
        newPassword: 'NewPass456!'
      })
      .expect(200);

    expect(response.body.message).toBe('비밀번호 변경 성공');

    // Verify can login with new password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        emailOrUsername: 'test@example.com',
        password: 'NewPass456!'
      })
      .expect(200);

    expect(loginRes.body.success).toBe(true);
  });

  it('should reject wrong current password', async () => {
    const response = await request(app)
      .post('/api/v1/user/change-password')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentPassword: 'WrongPassword!',
        newPassword: 'NewPass456!'
      })
      .expect(400);

    expect(response.body.message).toBe('현재 비밀번호가 올바르지 않습니다');
  });

  it('should reject same password', async () => {
    const response = await request(app)
      .post('/api/v1/user/change-password')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        currentPassword: 'Test1234!',
        newPassword: 'Test1234!'
      })
      .expect(400);

    expect(response.body.message).toBe('새 비밀번호는 현재 비밀번호와 달라야 합니다');
  });
});
```

### 5. Admin Login Tests

```javascript
describe('POST /api/v1/admin/login', () => {
  beforeEach(async () => {
    // Create test admin
    await Admin.create({
      email: 'admin@classcrew.com',
      username: 'admin',
      password: 'Admin1234!',
      fullName: '관리자',
      role: 'admin'
    });
  });

  it('should login admin with username', async () => {
    const response = await request(app)
      .post('/api/v1/admin/login')
      .send({
        username: 'admin',
        password: 'Admin1234!'
      })
      .expect(200);

    expect(response.body.message).toBe('관리자 로그인 성공');
    expect(response.body.data.admin.role).toBe('admin');
  });

  it('should login admin with email', async () => {
    const response = await request(app)
      .post('/api/v1/admin/login')
      .send({
        email: 'admin@classcrew.com',
        password: 'Admin1234!'
      })
      .expect(200);

    expect(response.body.data.admin.email).toBe('admin@classcrew.com');
  });

  it('should reject invalid admin credentials', async () => {
    const response = await request(app)
      .post('/api/v1/admin/login')
      .send({
        username: 'admin',
        password: 'WrongPassword!'
      })
      .expect(401);

    expect(response.body.message).toBe('관리자 정보가 올바르지 않습니다');
  });
});
```

### 6. Admin User Management Tests

```javascript
describe('Admin User Management', () => {
  let adminToken;

  beforeEach(async () => {
    // Create and login admin
    await Admin.create(adminData);
    const loginRes = await request(app)
      .post('/api/v1/admin/login')
      .send({ username: 'admin', password: 'Admin1234!' });
    adminToken = loginRes.body.data.token;
  });

  describe('GET /api/v1/admin/users', () => {
    it('should get all users with pagination', async () => {
      // Create test users
      await User.create([userData1, userData2, userData3]);

      const response = await request(app)
        .get('/api/v1/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
    });

    it('should filter users by member type', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users?memberType=재직자')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      response.body.data.users.forEach(user => {
        expect(user.memberType).toBe('재직자');
      });
    });

    it('should search users by name, email, phone', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users?search=홍길동')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.users.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/v1/admin/users/:id/toggle-status', () => {
    it('should deactivate user', async () => {
      const user = await User.create(validUserData);

      const response = await request(app)
        .patch(`/api/v1/admin/users/${user._id}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false })
        .expect(200);

      expect(response.body.message).toContain('비활성화');
      expect(response.body.data.user.isActive).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/users/:id', () => {
    it('should delete user', async () => {
      const user = await User.create(validUserData);

      await request(app)
        .delete(`/api/v1/admin/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
  });
});
```

### 7. Admin Management Tests

```javascript
describe('Admin Management', () => {
  it('should create new admin', async () => {
    const newAdmin = {
      email: 'newadmin@classcrew.com',
      username: 'newadmin',
      password: 'Admin1234!',
      fullName: '신규 관리자',
      role: 'admin'
    };

    const response = await request(app)
      .post('/api/v1/admin/admins')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAdmin)
      .expect(201);

    expect(response.body.data.admin.username).toBe(newAdmin.username);
  });

  it('should not allow admin to delete themselves', async () => {
    const response = await request(app)
      .delete(`/api/v1/admin/admins/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    expect(response.body.message).toBe('자신의 계정을 삭제할 수 없습니다');
  });

  it('should not allow admin to deactivate themselves', async () => {
    const response = await request(app)
      .patch(`/api/v1/admin/admins/${adminId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false })
      .expect(400);

    expect(response.body.message).toBe('자신의 계정 상태를 변경할 수 없습니다');
  });
});
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- auth.test.js
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Watch Mode
```bash
npm test -- --watch
```

## Test Data Helpers

### Create Test User
```javascript
const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'Test1234!',
    fullName: '홍길동',
    gender: '남성',
    phone: '01012345678',
    dob: new Date('1990-01-01'),
    memberType: '재직자',
    agreements: {
      termsOfService: true,
      privacyPolicy: true
    }
  };

  return await User.create({ ...defaultUser, ...overrides });
};
```

### Get Auth Token
```javascript
const getAuthToken = async (user) => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      emailOrUsername: user.email,
      password: 'Test1234!'
    });

  return response.body.data.token;
};
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clear database between test suites
3. **Realistic Data**: Use Korean names and valid phone formats
4. **Error Cases**: Test both success and failure scenarios
5. **Authentication**: Test with and without tokens
6. **Validation**: Test all validation rules
7. **Duplicates**: Test uniqueness constraints
8. **Permissions**: Test admin vs user access

## Expected Test Coverage

- **User Registration**: 95%+
- **Authentication**: 95%+
- **User Management**: 90%+
- **Admin Operations**: 90%+
- **Validation**: 100%

## Common Test Issues

### Issue 1: Database Connection
**Solution**: Ensure test database is running and connection string is correct

### Issue 2: Tokens Expiring
**Solution**: Use longer expiration times in test environment

### Issue 3: Async Timeout
**Solution**: Increase Jest timeout for slow operations
```javascript
jest.setTimeout(10000);
```

### Issue 4: Port Already in Use
**Solution**: Use different port for test environment

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install
        run: npm install
      - name: Run Tests
        run: npm test
```

## Test Maintenance

1. Update tests when API changes
2. Keep test data realistic
3. Review coverage reports
4. Fix failing tests immediately
5. Add tests for bug fixes

