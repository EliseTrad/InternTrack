const express = require('express');
const ResumesController = require('../controllers/resumesController');
const router = express.Router();
const { validateResume, validationResumeId } = require('../validators/resumesDTO');
const { validationUserId } = require('../validators/usersDTO');

// Create a resume
router.post('/create', validateResume, validationUserId, ResumesController.createResume);

// Get all resume
router.get('/', ResumesController.getAllResumes);

// Get cover resume(s) by user id
router.get('/user/:id', validationUserId, ResumesController.getResumessByUserId);

// Get resume by id
router.get('/:id', validationResumeId, ResumesController.getResumeById);

// Delete a resume by id
router.delete('/delete/:id', validationResumeId, ResumesController.deleteResumeById);

module.exports = router;
