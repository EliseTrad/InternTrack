const express = require('express');
const ResumesController = require('../controllers/resumesController');
const router = express.Router();
const { validateResume, validationResumeId } = require('../validators/resumesDTO');
const { validationUserId } = require('../validators/usersDTO');

// Create a resume
router.post('/create', validateResume, validationUserId, 
    (req, res) => ResumesController.createResume(req, res));

// Get all resume
router.get('/', (req, res) => ResumesController.getAllResumes(req, res));

// Get cover resume(s) by user id
router.get('/user/:id', validationUserId, (req, res) => ResumesController.getResumessByUserId(req, res));

// Get resume by id
router.get('/:id', validationResumeId, (req, res) => ResumesController.getResumeById(req, res));

// Delete a resume by id
router.delete('/delete/:id', validationResumeId, 
    (req, res) => ResumesController.deleteResumeById(req, res));

module.exports = router;
