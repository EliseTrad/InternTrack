const express = require('express');
const ResumesController = require('../controllers/resumesController');
const router = express.Router();
const {
  validateResume,
  validationResumeId,
} = require('../validators/resumesDTO');

// Create a resume
router.post('/create', validateResume, (req, res) =>
  ResumesController.createResume(req, res)
);

// Update a resume by its id
router.put('/update/:id', validationResumeId, (req, res) =>
  ResumesController.updateResumeById(req, res)
);

// Get all resume
router.get('/', (req, res) => ResumesController.getAllResumes(req, res));

// Get cover resume(s) by user id
router.get('/user/:userId', (req, res) =>
  ResumesController.getResumesByUserId(req, res)
);

// Get resume by id
router.get('/:id', validationResumeId, (req, res) =>
  ResumesController.getResumeById(req, res)
);

// Delete a resume by id
router.delete('/delete/:id', validationResumeId, (req, res) =>
  ResumesController.deleteResumeById(req, res)
);

module.exports = router;
