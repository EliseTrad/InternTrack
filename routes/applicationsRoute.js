const express = require('express');
const ApplicationsController = require('../controllers/applicationsController');
const router = express.Router();
const {
  validateApplication,
  validationApplicationId,
  validationStatus,
  validationDate,
  validationUpdate
} = require('../validators/applicationsDTO');
const { validationUserId } = require('../validators/usersDTO');
const { validationResumeId } = require('../validators/resumesDTO');
const { validationCoverLetterId } = require('../validators/coverLettersDTO');

// create application
router.post('/create', validateApplication, (req, res) =>
  ApplicationsController.createApplication(req, res)
);

// update application
router.put(
  '/update/:id', validationUpdate,
  (req, res) => ApplicationsController.updateApplicationById(req, res)
);

// get all applications
router.get('/', (req, res) =>
  ApplicationsController.getAllApplications(req, res)
);

//  get application by id
router.get('/:id', validationApplicationId, (req, res) =>
  ApplicationsController.getApplicationById(req, res)
);

// get applications by user id
router.get('/user/:id', validationUserId, (req, res) =>
  ApplicationsController.getApplicationsByUserId(req, res)
);

// get applications by company name
router.get('/company/:name', (req, res) =>
  ApplicationsController.getApplicationsByCompanyName(req, res)
);

// get applications by position title
router.get('/position/:title', (req, res) =>
  ApplicationsController.getApplicationsByPositionTitle(req, res)
);

// get applications by status
router.get('/status/:status', validationStatus, (req, res) =>
  ApplicationsController.getApplicationsByStatus(req, res)
);

// get applications by deadline
router.get('/deadline/:deadline', validationDate, (req, res) =>
  ApplicationsController.getApplicationsByDeadline(req, res)
);

// get applications by the date 
router.get('/date/:date', validationDate, (req, res) =>
  ApplicationsController.getApplicationsByDate(req, res)
);

// get applications by source
router.get('/source/:source', (req, res) =>
  ApplicationsController.getApplicationsBySource(req, res)
);

// get applications by resume id
router.get('/resume/:resumeId', validationResumeId, (req, res) =>
  ApplicationsController.getApplicationsByResumeId(req, res)
);

// get applications by cover letter id
router.get('/cover/:coverId', validationCoverLetterId, (req, res) =>
  ApplicationsController.getApplicationsByCoverLetterId(req, res)
);

// get count of applications for user
router.get('/count/:userId', validationUserId, (req, res) =>
  ApplicationsController.countApplicationsForUser(req, res)
);

// export applications to Excel
router.get('/export/excel/:userId', validationUserId, (req, res) =>
  ApplicationsController.exportApplicationsToExcel(req, res)
);

// delete application by id
router.delete('/delete/:id', validationApplicationId, (req, res) =>
  ApplicationsController.deleteApplicationById(req, res)
);

module.exports = router;
