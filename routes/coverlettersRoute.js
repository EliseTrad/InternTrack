const express = require('express');
const CoverLettersController = require('../controllers/coverlettersController');
const router = express.Router();
const { validateCoverLetter, validationCoverLetterId } = require('../validators/coverLettersDTO');
const { validationUserId } = require('../validators/usersDTO');

// Create a cover letter
router.post('/create', validateCoverLetter, validationUserId, 
    (req, res) => CoverLettersController.createCoverLetter(req, res));

// Get all cover letters
router.get('/', (req, res) => CoverLettersController.getAllCoverLetters(req, res));

// Get cover letter(s) by user id
router.get('/user/:id', validationUserId, (req, res) => 
    CoverLettersController.getCoverLettersByUserId(req, res));

// Get cover letter by id
router.get('/:id', validationCoverLetterId, (req, res) => 
    CoverLettersController.getCoverLetterById(req, res));

// Delete a cover letter by id
router.delete('/delete/:id', validationCoverLetterId, 
    (req, res) => CoverLettersController.deleteCoverLetter(req, res));

module.exports = router;
