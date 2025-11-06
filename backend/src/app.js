const express = require("express");
const config = require("./config/env");
const logger = require("./config/logger");
const pinoHttp = require("pino-http");
const { helmet, cors, rateLimiter } = require("./config/security");
const errorMiddleware = require("./middlewares/error.middleware");
const routes = require("./routes");

const app = express();

// Security middleware
app.use(helmet);
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
