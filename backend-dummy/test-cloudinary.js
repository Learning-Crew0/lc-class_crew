const dotenv = require("dotenv");
dotenv.config({ path: ".env.dev" });

console.log("🔍 Checking Cloudinary Configuration...\n");

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT SET");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ NOT SET");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ SET (hidden)" : "❌ NOT SET");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.log("\n❌ Cloudinary is NOT properly configured!");
  console.log("Please add these to your .env.dev file:");
  console.log(`
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
  `);
} else {
  console.log("\n✅ Cloudinary credentials are set!");
  console.log("Run this to test upload:");
  console.log("const cloudinary = require('./src/config/cloudinary');");
}

