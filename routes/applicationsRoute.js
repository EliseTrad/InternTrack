const express = require('express');
const ApplicationsController = require('../controllers/applicationsController');
const router = express.Router();
const { validateApplication, validationApplicationId } = require('../validators/applicationsDTO');
const validationUserId = require('../validators/usersDTO');
const validationResumeId = require('../validators/resumesDTO');
const validationCoverletterId = require('../validators/coverLettersDTO');

// createApplication
router.post('/create', validateApplication, validationUserId, validationResumeId, validationCoverletterId,
                     ApplicationsController.createApplication);

// updateApplication
router.put('/update/:id', validateApplication, validationUserId, validationResumeId, validationCoverletterId,
                        ApplicationsController.updateApplication);

// getAllApplications
router.get('/', ApplicationsController.getAllApplications);

//  getApplicationById
router.get('/:id', validationApplicationId, ApplicationsController.getApplicationById);

// getApplicationsByUserId
router.get('/user/:id', validationUserId, ApplicationsController.getApplicationsByUserId);

// getApplicationsByCompanyName
router.get('/company/:name', ApplicationsController.getApplicationsByCompanyName);

// getApplicationsByPositionTitle
router.get('/position/:title', ApplicationsController.getApplicationsByPositionTitle);

// getApplicationsByStatus
router.get('/status/:stat', ApplicationsController.getApplicationsByStatus);

// getApplicationsByDeadline
router.get('/deadline/:d', ApplicationsController.getApplicationsByDeadline);

// getApplicationsBySource
router.get('/source/:s', ApplicationsController.getApplicationsBySource);

// getApplicationsByResumeId
router.get('/resume/:id', validationResumeId, ApplicationsController.getApplicationsByResumeId);

// getApplicationsByCoverLetterId
router.get('/cover/:id',  ApplicationsController.getApplicationsByCoverLetterId);

// countApplicationsByStatuses
router.get('/countByStatuses', validationCoverletterId, 
            ApplicationsController.countApplicationsByStatuses);

// deleteApplicationById
router.delete('/delete/:id', validationApplicationId, ApplicationsController.deleteApplicationById);

module.exports = router;
