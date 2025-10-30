const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");
const thumbnailController = require("./thumbnail.controller");

// single file field for thumbnail image
const uploadSingle = upload.single("image");

// Get thumbnails by category (query parameter)
router.get("/", thumbnailController.getThumbnailsByCategory);

// Create a new thumbnail
router.post("/", uploadSingle, thumbnailController.createThumbnail);

// Update a thumbnail
router.put("/:id", uploadSingle, thumbnailController.updateThumbnail);

// Delete a thumbnail
router.delete("/:id", thumbnailController.deleteThumbnail);

module.exports = router;
