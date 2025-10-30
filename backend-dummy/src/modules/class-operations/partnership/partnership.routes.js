const express = require("express");
const router = express.Router();
const controller = require("./partnership.controller");

router.get("/", controller.getPartnerships);
router.get("/:id", controller.getPartnershipById);
router.post("/", controller.createPartnership);
router.put("/:id", controller.updatePartnership);
router.delete("/:id", controller.deletePartnership);


module.exports = router;