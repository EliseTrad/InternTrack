const express = require('express');
const router = express.Router();
const {
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  InvalidPassword,
  NotFound,
} = require('../errors/customError');
const {
  validateUser,
  validateUpdate,
  validateAuthentication,
} = require('../validators/usersDTO');
const uploadProfilePicture = require('../middleware/upload');
const UsersService = require('../services/usersService');

// POST route for user registration (register)
router.post('/register', validateUser, async (req, res) => {
  if (req.body.name === process.env.ADMIN_NAME) {
    return res.render('index', {
      loginError: null,
      registerError:
        'This username is not allowed. Please choose a different one.',
      formData: req.body,
      activeTab: 'register',
    });
  }

  if (req.errors) {
    return res.render('index', {
      loginError: null,
      registerError: req.errors.map((error) => error.msg).join(' '),
      formData: req.body,
      activeTab: 'register',
    });
  }

  try {
    const data = await UsersService.registerUser({
      user_name: req.body.name,
      user_email: req.body.email,
      user_password: req.body.password,
    });

    req.session.user = {
      id: data.user.user_id,
      name: data.user.user_name,
      email: data.user.user_email,
      isAdmin: false,
    };

    req.session.save((error) => {
      if (error) {
        console.error('Session save error:', error);
        return res.status(500).send('Session save failed');
      }
      return res.redirect('/dashboard/user');
    });
  } catch (error) {
    console.error('Error in userPagesRoute while registering the user', error);
    let registerError = 'An unexpected error occurred.';

    if (
      error instanceof NameAlreadyExistsError ||
      error instanceof EmailAlreadyExistsError
    ) {
      registerError = error.message;
    }

    return res.render('index', {
      loginError: null,
      registerError,
      formData: req.body,
      activeTab: 'register',
    });
  }
});

// POST route for user authentication (login)
router.post('/authenticate', validateAuthentication, async (req, res) => {
  if (req.errors) {
    return res.render('index', {
      loginError: req.errors.map((error) => error.msg).join(' '),
      registerError: null,
      formData: req.body,
      activeTab: 'login',
    });
  }

  if (
    req.body.name === process.env.ADMIN_NAME &&
    req.body.password === process.env.ADMIN_PASSWORD
  ) {
    req.session.user = {
      name: req.body.name,
      isAdmin: true,
    };
    req.session.save((error) => {
      if (error) {
        console.error('Session save error:', error);
        return res.status(500).send('Session save failed');
      }
      return res.redirect('/dashboard/admin');
    });
    return;
  }

  try {
    const data = await UsersService.authenticate(
      req.body.name,
      req.body.password
    );

    req.session.user = {
      id: data.user_id,
      name: data.user_name,
      email: data.user_email,
      isAdmin: false,
    };

    req.session.save((error) => {
      if (error) {
        console.error('Session save error:', error);
        return res.status(500).send('Session save failed');
      }
      return res.redirect('/dashboard/user');
    });
  } catch (error) {
    console.error(
      'Error in userPagesRoute while authenticating the user:',
      error
    );
    let loginError = 'An unexpected error occurred.';

    if (error instanceof InvalidPassword || error instanceof NotFound) {
      loginError = error.message;
    }

    return res.render('index', {
      loginError,
      registerError: null,
      formData: req.body,
      activeTab: 'login',
    });
  }
});

// GET edit profile
router.get('/edit-profile', async (req, res) => {
  console.log('Query:', req.query);
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
  } catch (error) {
    console.error('Error fetching user:', error);
    res.render('edit-profile', {
      user: null,
      profilePicture: '/uploads/users/default-avatar.png',
      error: 'Failed to load profile data',
      message: null,
    });
  }
});

router.post('/edit', uploadProfilePicture, validateUpdate, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/'); // session expired
    }

    const userId = req.session.user.id;

    // If upload failed, re-render form with error
    if (req.uploadError) {
      const fallbackUser = await UsersService.getUserById(userId);
      return res.render('edit-profile', {
        user: fallbackUser,
        profilePicture:
          fallbackUser.profile_picture || '/uploads/users/default-avatar.png',
        error: req.uploadError,
        message: null,
      });
    }

    // Prepare update data
    const updateData = {
      ...req.body,
    };

    // Handle profile picture upload
    if (req.file) {
      updateData.profile_picture = `/uploads/users/${req.file.filename}`;
    }

    // Call UserService directly
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
    return res.redirect('/userPage/edit-profile?success=1');
  } catch (error) {
    console.error('Error updating profile:', error);

    let message = 'An error occurred while updating your profile.';

    if (
      error instanceof NameAlreadyExistsError ||
      error instanceof EmailAlreadyExistsError ||
      error instanceof InvalidPassword
    ) {
      message = error.message;
    }

    try {
      fallbackUser = await UsersService.getUserById(req.session.user.id);
    } catch (innerError) {
      console.error('Failed to fetch fallback user:', innerError);
    }

    return res.render('edit-profile', {
      user: fallbackUser,
      profilePicture:
        fallbackUser.profile_picture || '/uploads/users/default-avatar.png',
      error: message,
      message: null,
    });
  }
});

module.exports = router;
