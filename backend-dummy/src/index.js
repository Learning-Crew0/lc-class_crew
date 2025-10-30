const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config({ path: ".env.dev" });
connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://classcrew.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const bannerRoutes = require("./modules/banner/banner.routes");
const thumbnailRoutes = require("./modules/thumbnail/thumbnail.routes");
const categoryRoutes = require("./modules/category/category.routes");
const courseRoutes = require("./modules/course/course.routes");
const applicantRoutes = require("./modules/class-operations/applicant/applicant.routes");
// Bulk upload routes
const categoryBulkUploadRoutes = require("./modules/category/categoryBulkUpload.routes");
const courseBulkUploadRoutes = require("./modules/course/courseBulkUpload.routes");
const curriculumBulkUploadRoutes = require("./modules/course/curriculumBulkUpload.routes");
const instructorBulkUploadRoutes = require("./modules/course/instructorBulkUpload.routes");
const promotionBulkUploadRoutes = require("./modules/course/promotionBulkUpload.routes");
const noticeBulkUploadRoutes = require("./modules/course/noticeBulkUpload.routes");
const reviewBulkUploadRoutes = require("./modules/course/reviewBulkUpload.routes");
const trainingScheduleBulkUploadRoutes = require("./modules/course/trainingScheduleBulkUpload.routes");

// Product and Cart/Order routes
const productCategoryRoutes = require("./modules/productCategory/productCategory.routes");
const productRoutes = require("./modules/product/product.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const orderRoutes = require("./modules/order/order.routes");

// User routes
const userRoutes = require("./modules/user/user.routes");

// Admin routes
const adminRoutes = require("./modules/admin/admin.routes");

// Coalition routes
const coalitionRoutes = require("./modules/coalation/coalation.routes");

// Enquiry routes
const enquiryRoutes = require("./modules/Enquiry/enquiry.routes");

// Auth & Core routes
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/admin", adminRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/thumbnail", thumbnailRoutes);

// Course routes
app.use("/api/category", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/applicants", applicantRoutes);

// Course bulk upload routes
app.use("/api/categories", categoryBulkUploadRoutes);
app.use("/api/courses", courseBulkUploadRoutes);
app.use("/api/curriculums", curriculumBulkUploadRoutes);
app.use("/api/instructors", instructorBulkUploadRoutes);
app.use("/api/promotions", promotionBulkUploadRoutes);
app.use("/api/notices", noticeBulkUploadRoutes);
app.use("/api/reviews", reviewBulkUploadRoutes);
app.use("/api/training-schedules", trainingScheduleBulkUploadRoutes);

// Product routes
app.use("/api/product-categories", productCategoryRoutes);
app.use("/api/products", productRoutes);

// Cart & Order routes
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// User routes
app.use("/api/users", userRoutes);

// Coalition routes
app.use("/api/coalitions", coalitionRoutes);

// Enquiry routes
app.use("/api/enquiries", enquiryRoutes);

app.get("/", (req, res) => {
  res.send("class crew backend change");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
