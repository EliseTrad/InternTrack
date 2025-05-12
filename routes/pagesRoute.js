const express = require('express');
const router = express.Router();
const ResumesController = require('../controllers/resumesController');
const CoverLettersController = require('../controllers/coverlettersController');
const UsersController = require('../controllers/usersController');
const {
  validateUser,
  validateUpdate,
  validateAuthentication,
} = require('../validators/usersDTO');
const upload = require('../middleware/upload'); // Import your multer config
const UsersService = require('../services/usersService');

// Homepage (login/register page)
router.get('/', (req, res) => {
  res.render('index', {
    loginError: null,
    registerError: null,
    formData: {},
    activeTab: 'login',
  });
});

router.get('/dashboard/user', (req, res) => {
  if (req.session.user && !req.session.user.isAdmin) {
    return res.render('dashboard/user'); // views/dashboard/user.ejs
  }
  res.redirect('/');
});

// Admin dashboard page
router.get('/dashboard/admin', (req, res) => {
  if (req.session.user && !req.session.user.isAdmin) {
    return res.render('dashboard/admin'); // views/dashboard/admin.ejs
  }
  res.redirect('/');
});

// Cover Letters page
router.get('/cover-letters', (req, res) => {
  if (req.session.user && !req.session.user.isAdmin) {
    return res.render('cover-letters'); 
  }
  res.redirect('/');
});

router.get('/resumes', (req, res) => {
  if (req.session.user && !req.session.user.isAdmin) {
    return res.render('resumes'); 
  }
  res.redirect('/');
});


module.exports = router;
