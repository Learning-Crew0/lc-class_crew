const express = require("express");
const path = require("path");
const helmet = require("helmet");
const config = require("./config/env");
const logger = require("./config/logger");
const pinoHttp = require("pino-http");
const { cors, rateLimiter } = require("./config/security");
const errorMiddleware = require("./middlewares/error.middleware");
const routes = require("./routes");
const { BASE_UPLOAD_PATH, initializeStorage } = require("./config/fileStorage");

const app = express();

// Initialize file storage directories
initializeStorage();

// Serve uploaded files FIRST with proper CORS headers (before other middleware)
app.use(
    "/uploads",
    (req, res, next) => {
        // Handle OPTIONS preflight request
        if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Access-Control-Max-Age", "86400");
            return res.status(204).end();
        }

        // Add CORS headers for all requests
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "*");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

        // Cache control for better performance
        res.setHeader("Cache-Control", "public, max-age=31536000");

        next();
    },
    express.static(BASE_UPLOAD_PATH, {
        setHeaders: (res, filePath) => {
            // Set proper content type based on file extension
            if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
                res.setHeader("Content-Type", "image/jpeg");
            } else if (filePath.endsWith(".png")) {
                res.setHeader("Content-Type", "image/png");
            } else if (filePath.endsWith(".gif")) {
                res.setHeader("Content-Type", "image/gif");
            } else if (filePath.endsWith(".webp")) {
                res.setHeader("Content-Type", "image/webp");
            } else if (filePath.endsWith(".pdf")) {
                res.setHeader("Content-Type", "application/pdf");
            }
        },
    })
);

// Security middleware - allow images to be loaded from any origin
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false, // Disable CSP for now to allow images
    })
);
app.use(cors);

// Request logging
app.use(pinoHttp({ logger }));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: config.env,
    });
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;
