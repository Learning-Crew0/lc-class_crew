const express = require("express");
const router = express.Router();

const controller = require("./applicant.controller");

// List + filters
router.get('/', controller.getApplicants);

// Export (CSV)
router.get('/export', controller.exportApplicants);

// Get by id
router.get('/:id', controller.getApplicantById);

// Create
router.post('/', controller.createApplicant);

// Update
router.put('/:id', controller.updateApplicant);

// Delete
router.delete('/:id', controller.deleteApplicant);

module.exports = router;