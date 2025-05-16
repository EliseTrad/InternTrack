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


module.exports = router;
