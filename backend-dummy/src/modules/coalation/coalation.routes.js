const express = require("express");
const router = express.Router();
const coalitionController = require("./coalation.controller");
const { protectAdmin } = require("../../middleware/adminAuth.middleware");
const upload = require("../../middlewares/upload");

// Public route - Anyone can create a coalition application
router.post(
  "/",
  upload.single("file"),
  coalitionController.createCoalition
);

// Admin only routes
router.get(
  "/",
  protectAdmin,
  coalitionController.getAllCoalitions
);

router.get(
  "/stats",
  protectAdmin,
  coalitionController.getCoalitionStats
);

router.get(
  "/:id",
  protectAdmin,
  coalitionController.getCoalitionById
);

router.patch(
  "/:id/status",
  protectAdmin,
  coalitionController.updateCoalitionStatus
);

router.delete(
  "/:id",
  protectAdmin,
  coalitionController.deleteCoalition
);

module.exports = router;

