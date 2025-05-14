const express = require('express');
const CoverLettersController = require('../controllers/coverlettersController');
const router = express.Router();
const {
  validateCoverLetter,
  validationCoverLetterId,
  validationFileName,
  validateUpdate,
} = require('../validators/coverLettersDTO');
const { validationUserId } = require('../validators/usersDTO');

// Create a cover letter
router.post('/create', validateCoverLetter, (req, res) =>
  CoverLettersController.createCoverLetter(req, res)
);

// Update cover letter
router.put('/update/:id', validateUpdate, validationCoverLetterId, (req, res) =>
  CoverLettersController.updateCoverLetterById(req, res)
);

// Get all cover letters
router.get('/', (req, res) =>
  CoverLettersController.getAllCoverLetters(req, res)
);

// Get cover letter(s) by user id
router.get('/user/:userId', validationUserId, (req, res) =>
  CoverLettersController.getCoverLettersByUserId(req, res)
);

// Get cover letter by id
router.get('/:id', validationCoverLetterId, (req, res) =>
  CoverLettersController.getCoverLetterById(req, res)
);

// Get cover letter by id
router.get('/name/:name', validationFileName, (req, res) =>
  CoverLettersController.getCoverLettersByName(req, res)
);

// Get cover letters by name and user id
router.get('/nameAndUserId/:name', validationFileName, (req, res) =>
  CoverLettersController.getCoverLettersByNameAndUserId(req, res)
);

// Delete a cover letter by id
router.delete('/delete/:id', validationCoverLetterId, (req, res) =>
  CoverLettersController.deleteCoverLetter(req, res)
);

// Delete cover letters
router.delete('/deleteCoverLetters', (req, res) =>
  CoverLettersController.deleteCoverLettersByUser(req, res)
);


module.exports = router;
