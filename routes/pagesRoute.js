const express = require('express');
const router = express.Router();

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

module.exports = router;
