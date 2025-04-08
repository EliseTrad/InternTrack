const express = require('express');
const InterviewsController = require('../controllers/interviewsController');
const router = express.Router();
const {
  validateInterview,
  validationUpdateInterview,
  validationInterviewId,
  validationStatus,
  validationReminder,
  validateDate,
} = require('../validators/interviewsDTO');
const { validationApplicationId } = require('../validators/applicationsDTO');

// create an interview
router.post('/create', validateInterview, (req, res) =>
  InterviewsController.createInterview(req, res)
);

// update interview
router.put(
  '/update/:id',
  validationUpdateInterview,
  validationApplicationId,
  (req, res) => InterviewsController.updateInterview(req, res)
);

// get all interviews
router.get('/', (req, res) => InterviewsController.getAllInterviews(req, res));

// getInterviewById
router.get('/:id', validationInterviewId, (req, res) =>
  InterviewsController.getInterviewById(req, res)
);

// getInterviewsByDate
router.get('/date/:date', validateDate, (req, res) =>
  InterviewsController.getInterviewsByDate(req, res)
);

// getInterviewsByLocation
router.get('/location/:loc', (req, res) =>
  InterviewsController.getInterviewsByLocation(req, res)
);

// getInterviewsByReminder
router.get('/reminder/:reminder', validationReminder, (req, res) =>
  InterviewsController.getInterviewsByReminder(req, res)
);

// getInterviewsByStatus
router.get('/status/:status', validationStatus, (req, res) =>
  InterviewsController.getInterviewsByStatus(req, res)
);

// getInterviewsByApplicationId
router.get('/application/:id', validationApplicationId, (req, res) =>
  InterviewsController.getInterviewsByApplicationId(req, res)
);

// countInterviewsByStatuses
router.get('/count/status/:status', validationStatus, (req, res) =>
  InterviewsController.countInterviewsByStatus(req, res)
);

// deleteInterview
router.delete('/delete/:id', validationInterviewId, (req, res) =>
  InterviewsController.deleteInterview(req, res)
);

module.exports = router;
