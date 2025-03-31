const express = require('express');
const InterviewController = require('../controllers/interviewsController');
const router = express.Router();
const { validateInterview, validationInterviewId } = require('../validators/interviewsDTO');
const validationApplicationId = require('../validators/applicationsDTO');

// createInterview
router.post('/create', validateInterview, validationApplicationId, InterviewController.createInterview);

// updateInterview
router.put('/update', validationInterviewId , validateInterview, validationApplicationId, 
            InterviewController.updateInterview);

// getAllInterviews
router.get('/', InterviewController.getAllInterviews);

// getInterviewById
router.get('/:id', InterviewController.getInterviewById);

// getInterviewsByDate
router.get('/date/:date', InterviewController.getInterviewsByDate);

// getInterviewsByLocation
router.get('/location/:loc', InterviewController.getInterviewsByLocation);

// getInterviewsByReminder
router.get('/reminder/:reminder', InterviewController.getInterviewsByReminder);

// getInterviewsByStatus
router.get('/status/:status', InterviewController.getInterviewsByStatus);

// getInterviewsByApplicationId
router.get('/application/:id', InterviewController.getInterviewsByApplicationId);

// countInterviewsByStatuses
router.get('/statuses/:id', InterviewController.countInterviewsByStatuses);

// deleteInterview
router.get('/delete/:id', InterviewController.deleteInterview);

module.exports = router;


