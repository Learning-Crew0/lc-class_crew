# LC Class Crew - Backend API

Backend API for the LC Class Crew platform - a comprehensive learning management and e-commerce system.

## ✨ Latest Updates

**Best Practices Implemented:**
- ✅ **Async Handler Pattern** - Clean controllers without try-catch blocks
- ✅ **API Error Class** - Semantic HTTP error responses
- ✅ **Prettier** - Automatic code formatting
- ✅ **ESLint** - Code quality and consistency

See [BEST_PRACTICES.md](./BEST_PRACTICES.md) for detailed guide.

## Features

- **User Management**: Authentication, registration, profile management
- **Course Management**: Course catalog, enrollments, session scheduling
- **E-commerce**: Products, shopping cart, checkout
- **Admin Panel**: Complete CRUD operations for all resources
- **Content Management**: FAQs, notices, banners, inquiries
- **Evaluation System**: Certificate eligibility computation
- **Calendar System**: Automated course session generation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Pino
- **File Upload**: Multer
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or pnpm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

4. Create environment file:

   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration

6. Seed the database with admin user:
   ```bash
   npm run seed
   ```

### Running the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The API will be available at `http://localhost:5000` (or your configured PORT)

## Project Structure

```
backend/
├── src/
│   ├── app.js                  # Express application setup
│   ├── server.js               # HTTP server entry point
│   ├── config/                 # Configuration files
│   ├── models/                 # Mongoose schemas
│   ├── services/               # Business logic layer
│   ├── controllers/            # Route handlers
│   ├── routes/                 # API routes
│   ├── middlewares/            # Custom middlewares
│   ├── validators/             # Request validation schemas
│   ├── utils/                  # Utility functions
│   ├── constants/              # Application constants
│   ├── docs/                   # API documentation
│   ├── seeds/                  # Database seeders
│   ├── scripts/                # Utility scripts
│   └── test/                   # Test files
├── .env                        # Environment variables
├── .env.example                # Example environment file
└── package.json                # Project dependencies
```

## API Documentation

API documentation is available in:

- Postman Collection: `src/docs/api.postman_collection.json`
- OpenAPI/Swagger: `src/docs/openapi.yaml` (if configured)

## Code Quality

**Format code with Prettier:**

```bash
npm run format
npm run format:check
```

**Lint code with ESLint:**

```bash
npm run lint
npm run lint:fix
```

## Testing

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC
