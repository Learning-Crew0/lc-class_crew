# LC Class Crew Backend Documentation

Welcome to the comprehensive documentation for the LC Class Crew backend system.

## 📚 Documentation Structure

### `/api/`
Complete API documentation with all endpoints, request/response formats, and examples.

- **[API_DOCUMENTATION.md](./api/API_DOCUMENTATION.md)** - Complete REST API reference
  - User Registration & Authentication
  - Admin Management
  - User Profile Operations
  - All 20+ endpoints documented
  - Request/Response examples
  - Error handling guide

### `/integration/`
Integration testing documentation and test suites.

- **[INTEGRATION_TESTING.md](./integration/INTEGRATION_TESTING.md)** - Complete testing guide
  - Test setup instructions
  - All test suites explained
  - Test data helpers
  - Running tests guide
  - CI/CD integration

## 🚀 Quick Links

### For Frontend Developers
1. [API Documentation](./api/API_DOCUMENTATION.md) - All endpoints you need
2. [Quick Start Guide](../QUICK_START.md) - Get backend running in 5 minutes
3. [Environment Setup](../ENV_SETUP.md) - Configuration guide

### For Backend Developers
1. [Integration Testing](./integration/INTEGRATION_TESTING.md) - Test suites
2. [Best Practices](../BEST_PRACTICES.md) - Code standards
3. [Implementation Summary](../IMPLEMENTATION_SUMMARY.md) - System overview

### For DevOps
1. [Environment Setup](../ENV_SETUP.md) - Deployment configuration
2. [Quick Start](../QUICK_START.md) - Installation guide

## 📖 Main Documentation Files (Root)

- `README.md` - Project overview
- `QUICK_START.md` - Installation and setup
- `ENV_SETUP.md` - Environment variables guide
- `BEST_PRACTICES.md` - Code standards and patterns
- `IMPLEMENTATION_SUMMARY.md` - System architecture
- `CHANGELOG.md` - Version history

## 🔑 Key Features Documented

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Password encryption with bcrypt
- Token refresh mechanism

### User Management
- Complete registration flow (Korean schema)
- Profile management
- Password change
- Account activation/deactivation

### Admin Operations
- Admin authentication
- User management (CRUD)
- Admin management (CRUD)
- Self-protection mechanisms

### Validation
- Comprehensive Joi validation
- Korean error messages
- Field-level validation
- Business logic validation

### Error Handling
- Centralized error middleware
- Custom ApiError class
- Standardized error responses
- Detailed error logging

## 🧪 Testing

### Test Coverage
- User Registration: 95%+
- Authentication: 95%+
- User Management: 90%+
- Admin Operations: 90%+

### Test Suites
1. **User Auth Integration Tests**
   - Registration (successful, validation, duplicates)
   - Login (email/username, success, failure)
   - Profile operations
   - Password management

2. **Admin Management Tests**
   - Admin authentication
   - Admin CRUD operations
   - User management by admin
   - Permission tests
   - Self-protection tests

### Running Tests
```bash
# All tests
npm test

# Specific suite
npm test -- user-auth.integration.test.js

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 📊 API Endpoints Summary

### Public Endpoints (3)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/settings` - Public settings

### User Protected Endpoints (3)
- `GET /api/v1/user/profile` - Get profile
- `PUT /api/v1/user/profile` - Update profile
- `POST /api/v1/user/change-password` - Change password

### Admin Protected Endpoints (14+)
- Admin auth and profile (3)
- Admin management (6)
- User management (5+)
- Plus all course, enrollment, product endpoints

## 🔧 Technologies

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: bcryptjs, helmet, express-rate-limit
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier

## 📝 Code Standards

### Best Practices Implemented
1. **AsyncHandler** - No try-catch in controllers
2. **ApiError** - Standardized error handling
3. **Validators** - Comprehensive input validation
4. **Services** - Business logic separation
5. **Clean Code** - No unnecessary comments
6. **Korean UX** - All user messages in Korean

### Architecture Pattern
```
Controllers → Services → Models
     ↓           ↓
Validators  Business Logic
     ↓
Middleware
```

## 🌍 Internationalization

All user-facing messages are in Korean:
- Validation error messages
- Success messages
- Error responses
- API response messages

## 🔒 Security Features

1. **Password Security**
   - bcrypt hashing (12 rounds)
   - Min 8 characters
   - Password strength validation

2. **JWT Security**
   - Secure token generation
   - Token expiration
   - Refresh token support

3. **Data Validation**
   - Input sanitization
   - Type checking
   - Format validation
   - Business rules enforcement

4. **Access Control**
   - Role-based permissions
   - Route protection
   - Admin-only operations
   - Self-protection for admins

## 📞 Support

For questions or issues:
1. Check the relevant documentation file
2. Review test files for examples
3. Check error messages (in Korean)
4. Review code comments (minimal, code is self-documenting)

## 🎯 Development Workflow

1. Read API documentation
2. Understand test requirements
3. Write tests first (TDD)
4. Implement features
5. Run linting and formatting
6. Verify all tests pass
7. Submit for review

## 📈 Monitoring

### Logs
- Structured logging with pino
- Request/response logging
- Error logging with stack traces
- Performance monitoring

### Health Checks
- Database connectivity
- Server status
- Memory usage

## 🚀 Deployment

See [ENV_SETUP.md](../ENV_SETUP.md) for:
- Production environment setup
- Environment variables
- Security configurations
- Platform-specific notes

## 📦 Dependencies

### Production
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT auth
- bcryptjs - Password hashing
- joi - Validation
- helmet - Security headers
- cors - CORS handling
- express-rate-limit - Rate limiting

### Development
- jest - Testing framework
- supertest - HTTP testing
- eslint - Linting
- prettier - Code formatting
- nodemon - Dev server

## 🎓 Learning Resources

1. **API Testing** - Use Postman collection in `src/docs/`
2. **Code Examples** - Check test files for usage examples
3. **Error Handling** - Review `ApiError` class
4. **Validation** - Check validator files for patterns

## ✅ Checklist for New Features

- [ ] Write integration tests first
- [ ] Implement service layer
- [ ] Create controller with asyncHandler
- [ ] Add Joi validators
- [ ] Use ApiError for errors
- [ ] Add Korean error messages
- [ ] Document API endpoint
- [ ] Run linting and formatting
- [ ] Verify test coverage
- [ ] Update CHANGELOG.md

---

**Version**: 1.0.0
**Last Updated**: November 2024
**Maintained By**: LC Class Crew Development Team

