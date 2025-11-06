const mongoose = require("mongoose");
const config = require("../config/env");
const logger = require("../config/logger");

// Import models
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Product = require("../models/product.model");
const FAQ = require("../models/faq.model");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedSampleData = async () => {
  try {
    await connectDB();

    // Create admin if doesn't exist
    let admin = await Admin.findOne({ email: config.admin.email });
    if (!admin) {
      admin = await Admin.create({
        email: config.admin.email,
        password: config.admin.password,
        name: "System Administrator",
        role: "admin",
        isActive: true,
      });
      logger.info("Admin user created");
    }

    // Create sample users
    const sampleUsers = [
      {
        email: "john.doe@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        phone: "+1 555-0101",
        membershipType: "job_seeker",
      },
      {
        email: "jane.smith@example.com",
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
        phone: "+1 555-0102",
        membershipType: "employed",
        companyName: "Tech Corp",
      },
    ];

    for (const userData of sampleUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        logger.info(`Created user: ${userData.email}`);
      }
    }

    // Create sample courses
    const sampleCourses = [
      {
        title: "Introduction to Web Development",
        description:
          "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
        shortDescription: "Learn web development basics",
        instructor: "John Smith",
        duration: { value: 8, unit: "weeks" },
        price: 299,
        category: "Web Development",
        level: "beginner",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Advanced JavaScript Programming",
        description:
          "Master advanced JavaScript concepts and modern frameworks.",
        shortDescription: "Advanced JS concepts",
        instructor: "Sarah Johnson",
        duration: { value: 10, unit: "weeks" },
        price: 399,
        category: "Programming",
        level: "advanced",
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000),
        isPublished: true,
      },
    ];

    for (const courseData of sampleCourses) {
      const exists = await Course.findOne({ title: courseData.title });
      if (!exists) {
        await Course.create(courseData);
        logger.info(`Created course: ${courseData.title}`);
      }
    }

    // Create sample products
    const sampleProducts = [
      {
        name: "Programming Textbook",
        description: "Comprehensive guide to programming fundamentals",
        shortDescription: "Programming guide",
        price: 49.99,
        compareAtPrice: 69.99,
        category: "Books",
        stock: { quantity: 100, trackInventory: true },
        isPublished: true,
        isFeatured: true,
      },
      {
        name: "Coding T-Shirt",
        description: "Comfortable t-shirt for developers",
        shortDescription: "Developer t-shirt",
        price: 24.99,
        category: "Apparel",
        stock: { quantity: 50, trackInventory: true },
        isPublished: true,
      },
    ];

    for (const productData of sampleProducts) {
      const exists = await Product.findOne({ name: productData.name });
      if (!exists) {
        await Product.create(productData);
        logger.info(`Created product: ${productData.name}`);
      }
    }

    // Create sample FAQs
    const sampleFAQs = [
      {
        question: "How do I enroll in a course?",
        answer:
          'You can enroll in a course by clicking the "Enroll Now" button on the course page.',
        category: "enrollment",
        order: 1,
        isPublished: true,
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and bank transfers.",
        category: "payments",
        order: 1,
        isPublished: true,
      },
      {
        question: "Can I get a refund?",
        answer: "Yes, we offer a 30-day money-back guarantee for all courses.",
        category: "payments",
        order: 2,
        isPublished: true,
      },
    ];

    for (const faqData of sampleFAQs) {
      const exists = await FAQ.findOne({ question: faqData.question });
      if (!exists) {
        await FAQ.create(faqData);
        logger.info(`Created FAQ: ${faqData.question}`);
      }
    }

    logger.info("✅ Sample data seeded successfully");
    logger.info("");
    logger.info("Test Accounts:");
    logger.info(`Admin: ${config.admin.email} / ${config.admin.password}`);
    logger.info("User: john.doe@example.com / password123");
    logger.info("User: jane.smith@example.com / password123");
    logger.info("");
    logger.info("⚠️  Please change these passwords in production!");

    process.exit(0);
  } catch (error) {
    logger.error("Error seeding sample data:", error.message);
    process.exit(1);
  }
};

seedSampleData();
