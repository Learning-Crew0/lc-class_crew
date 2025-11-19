const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const config = require("./env");

// Helmet configuration for security headers
const helmetMiddleware = helmet({
    contentSecurityPolicy: config.env === "production",
    crossOriginEmbedderPolicy: config.env === "production",
});

// CORS configuration
const corsMiddleware = cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // List of allowed origins
        const allowedOrigins = [
            "https://classcrew.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173",
            ...config.cors.origins,
        ];

        if (
            allowedOrigins.indexOf(origin) !== -1 ||
            config.env === "development"
        ) {
            console.log("[CORS] Allowed origin:", origin);
            callback(null, true);
        } else {
            console.warn("[CORS] Blocked origin:", origin);
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

// Rate limiter
const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks, static files, and public API routes
        return (
            req.path === "/health" ||
            req.path.startsWith("/uploads/") ||
            req.path.startsWith("/api/v1/courses") ||
            req.path.startsWith("/api/v1/products") ||
            req.path.startsWith("/api/v1/categories") ||
            req.path.startsWith("/api/v1/positions") ||
            req.path.startsWith("/api/v1/announcements") ||
            req.path.startsWith("/api/v1/public")
        );
    },
});

module.exports = {
    helmet: helmetMiddleware,
    cors: corsMiddleware,
    rateLimiter,
};
