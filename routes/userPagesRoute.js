const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const {
  validateUser,
  validateUpdate,
  validateAuthentication,
} = require('../validators/usersDTO');
const upload = require('../middleware/upload'); // Import your multer config
const UsersService = require('../services/usersService');

// POST route for user registration (register)
router.post('/register', validateUser, async (req, res) => {
  // Block reserved admin name
  if (req.body.name === process.env.ADMIN_NAME) {
    return res.render('index', {
      loginError: null,
      registerError:
        'This username is not allowed. Please choose a different one.',
      formData: req.body,
      activeTab: 'register',
    });
  }

  // Handle validation errors
  if (req.errors) {
    return res.render('index', {
      loginError: null,
      registerError: req.errors.map((err) => err.msg).join(' '),
      formData: req.body,
      activeTab: 'register',
    });
  }

  try {
    const _res = {
      status: () => _res,
      json: (data) => {
        if (!data.success) {
          return res.render('index', {
            loginError: null,
            registerError: data.message || 'Registration failed',
            formData: req.body,
            activeTab: 'register',
          });
        }

        // Success: save session and redirect
        req.session.user = {
          id: data.user.user_id,
          name: data.user.user_name,
          email: data.user.user_email,
          isAdmin: false,
        };

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).send('Session save failed');
          }
          return res.redirect('/dashboard/user');
        });
      },
    };

    await UsersController.registerUser(req, _res);
  } catch (err) {
    res.render('index', {
      loginError: null,
      registerError: err.message || 'An unexpected error occurred.',
      formData: req.body,
      activeTab: 'register',
    });
  }
});

// POST route for user authentication (login)
router.post('/authenticate', validateAuthentication, async (req, res) => {
  try {
    // If there are validation errors, render the page with the error messages
    if (req.errors) {
      return res.render('index', {
        loginError: req.errors.map((err) => err.msg).join(' '),
        registerError: null,
        formData: req.body,
        activeTab: 'login',
      });
    }

    // Check if the entered name is admin from .env
    if (
      req.body.name === process.env.ADMIN_NAME &&
      req.body.password === process.env.ADMIN_PASSWORD
    ) {
      // Admin login is valid, redirect to the admin dashboard
      req.session.user = {
        name: req.body.name,
        isAdmin: true,
      };
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).send('Session save failed');
        }
        return res.redirect('/dashboard/admin');
      });
      return;
    }

    const _res = {
      status: () => _res,
      json: (data) => {
        if (!data.success) {
          return res.render('index', {
            loginError: data.message || 'Login failed',
            registerError: null,
            formData: { name: req.body.name },
            activeTab: 'login',
          });
        }

        // Success: save session and redirect
        req.session.user = {
          id: data.user.user_id,
          name: data.user.user_name,
          email: data.user.user_email,
          isAdmin: false,
        };

        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.status(500).send('Session save failed');
          }
          return res.redirect('/dashboard/user');
        });
      },
    };

    await UsersController.authenticate(req, _res);
  } catch (err) {
    res.render('index', {
      loginError: err.message || 'An unexpected error occurred.',
      registerError: null,
      formData: { name: req.body.name },
      activeTab: 'login',
    });
  }
});

// GET edit profile
router.get('/edit-profile', async (req, res) => {
  try {
    const sessionUser = req.session.user;

    if (!sessionUser || !sessionUser.id) {
      return res.redirect('/');
    }

    // Fetch full user from DB using the session user ID
    const fullUser = await UsersService.getUserById(sessionUser.id);

    if (!fullUser) {
      return res.redirect('/');
    }

    const profilePicture =
      fullUser.profile_picture || '/uploads/users/default-avatar.png';

    res.render('edit-profile', {
      user: fullUser,
      profilePicture,
      error: null,
      message: req.query.success ? 'Profile updated successfully.' : null,
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.render('edit-profile', {
      user: null,
      profilePicture: '/uploads/users/default-avatar.png',
      error: 'Failed to load profile data',
      message: null,
    });
  }
});

router.post(
  '/edit',
  upload.single('profile_picture'),
  validateUpdate,
  async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.id) {
        return res.redirect('/'); // session expired
      }

      const userId = req.session.user.id;

      // Prepare update data
      const updateData = {
        ...req.body,
      };

      // Handle profile picture upload
      if (req.file) {
        updateData.profile_picture = `/uploads/users/${req.file.filename}`;
      }

      // Call UserService directly (bypass controller)
      await UsersService.updateUserById(userId, updateData);

      // Fetch updated user to refresh session
      const updatedUser = await UsersService.getUserById(userId);
      req.session.user = {
        id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_email: updatedUser.user_email,
        profile_picture: updatedUser.profile_picture,
        isAdmin: req.session.user.isAdmin || false,
      };

      // Redirect to GET route with success query param
      return res.redirect('/edit-profile?success=1');
    } catch (error) {
      console.error('Error updating profile:', error);

      // Fallback user data
      const fallbackUser = {
        ...req.body,
        user_name: req.body.user_name || req.session.user.user_name,
        user_email: req.body.user_email || req.session.user.user_email,
        profile_picture:
          req.session?.user?.profile_picture ||
          '/uploads/users/default-avatar.png',
      };

      const errorMessage =
        error.message || 'An error occurred while updating your profile.';

      return res.render('edit-profile', {
        user: fallbackUser,
        profilePicture: fallbackUser.profile_picture,
        error: errorMessage,
        message: null,
      });
    }
  }
);

module.exports = router;
