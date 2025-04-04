const express = require('express');
const ApplicationsController = require('../controllers/applicationsController');
const router = express.Router();
const { validateApplication, validationApplicationId } = require('../validators/applicationsDTO');
const { validationUserId } = require('../validators/usersDTO');
const { validationResumeId } = require('../validators/resumesDTO');
const { validationCoverLetterId } = require('../validators/coverLettersDTO');

// createApplication
router.post('/create', validateApplication, validationUserId, validationResumeId, validationCoverLetterId,
    (req, res) => ApplicationsController.createApplication(req, res));

// updateApplication
router.put('/update/:id', validateApplication, validationUserId, validationResumeId, validationCoverLetterId,
    (req, res) => ApplicationsController.updateApplication(req, res));

// getAllApplications
router.get('/', (req, res) => ApplicationsController.getAllApplications(req, res));

//  getApplicationById
router.get('/:id', validationApplicationId, (req, res) =>
    ApplicationsController.getApplicationById(req, res));

// getApplicationsByUserId
router.get('/user/:id', validationUserId, (req, res) => 
    ApplicationsController.getApplicationsByUserId(req, res));

// getApplicationsByCompanyName
router.get('/company/:name', (req, res) => ApplicationsController.getApplicationsByCompanyName(req, res));

// getApplicationsByPositionTitle
router.get('/position/:title', (req, res) => 
    ApplicationsController.getApplicationsByPositionTitle(req, res));

// getApplicationsByStatus
router.get('/status/:stat', (req, res) => ApplicationsController.getApplicationsByStatus(req, res));

// getApplicationsByDeadline
router.get('/deadline/:d', (req, res) => ApplicationsController.getApplicationsByDeadline(req, res));

// getApplicationsBySource
router.get('/source/:s', (req, res) => ApplicationsController.getApplicationsBySource(req, res));

// getApplicationsByResumeId
router.get('/resume/:id', validationResumeId, (req, res) =>
    ApplicationsController.getApplicationsByResumeId(req, res));

// getApplicationsByCoverLetterId
router.get('/cover/:id', (req, res) => ApplicationsController.getApplicationsByCoverLetterId(req, res));

// countApplicationsByStatuses
router.get('/countByStatuses/:s',
    (req, res) => ApplicationsController.countApplicationsByStatuses(req, res));

// deleteApplicationById
router.delete('/delete/:id', validationApplicationId, 
    (req, res) => ApplicationsController.deleteApplicationById(req, res));

// countApplicationsByStatuses
router.get('/countByUserId/:id', validationUserId,
    (req, res) => ApplicationsController.countApplicationsByUserId(req, res));

// Route to export applications to Excel
router.get('/export/excel/:userId', validationUserId, 
    (req, res) => ApplicationsController.exportApplicationsToExcel(req, res));

// Route to export applications to PDF
router.get('/export/pdf/:userId', validationUserId, 
    (req, res) => ApplicationsController.exportApplicationsToPDF(req, res));

module.exports = router;