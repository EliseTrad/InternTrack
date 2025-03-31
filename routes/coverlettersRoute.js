const express = require('express');
const CoverLettersController = require('../controllers/coverlettersController');
const router = express.Router();
const { validateCoverLetter, validationCoverLetterId } = require('../validators/coverLettersDTO');
const { validationUserId } = require('../validators/usersDTO');

// Create a cover letter
router.post('/create', validateCoverLetter, validationUserId, CoverLettersController.createCoverLetter);

// Get all cover letters
router.get('/', CoverLettersController.getAllCoverLetters);

// Get cover letter(s) by user id
router.get('/user/:id', validationUserId, CoverLettersController.getCoverLettersByUserId);

// Get cover letter by id
router.get('/:id', validationCoverLetterId, CoverLettersController.getCoverLetterById);

// Delete a cover letter by id
router.delete('/delete/:id', validationCoverLetterId, CoverLettersController.deleteCoverLetter);

module.exports = router;
