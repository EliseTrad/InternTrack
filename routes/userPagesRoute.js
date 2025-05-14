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

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 * @middleware validateUser - validates user input data
 * @param   {string} req.body.name - Username input
 * @param   {string} req.body.email - Email input
 * @param   {string} req.body.password - Password input
 */
router.post('/register', validateUser, async (req, res) => {
  // Prevent registration with reserved admin name
  if (req.body.name === process.env.ADMIN_NAME) {
    return res.render('index', {
      loginError: null,
      registerError:
        'This username is not allowed. Please choose a different one.',
      formData: req.body,
      activeTab: 'register',
    });
  }

  // Handle validation errors from DTO
  if (req.errors) {
    return res.render('index', {
      loginError: null,
      registerError: req.errors.map((error) => error.msg).join(' '),
      formData: req.body,
      activeTab: 'register',
    });
  }

  try {
    // Call service layer to register user
    const data = await UsersService.registerUser({
      user_name: req.body.name,
      user_email: req.body.email,
      user_password: req.body.password,
    });

    // Initialize session for the new user
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
      // Redirect to user dashboard on successful registration
      return res.redirect('/dashboard/user');
    });
  } catch (error) {
    console.error('Error in userPagesRoute while registering the user', error);
    let registerError = 'An unexpected error occurred.';

    // Handle known errors for duplicate name or email
    if (
      error instanceof NameAlreadyExistsError ||
      error instanceof EmailAlreadyExistsError
    ) {
      registerError = error.message;
    }

    // Re-render registration form with error message
    return res.render('index', {
      loginError: null,
      registerError,
      formData: req.body,
      activeTab: 'register',
    });
  }
});

/**
 * @route   POST /authenticate
 * @desc    Authenticate existing user (login)
 * @access  Public
 * @middleware validateAuthentication - validates login input data
 * @param   {string} req.body.name - Username input
 * @param   {string} req.body.password - Password input
 */
router.post('/authenticate', validateAuthentication, async (req, res) => {
  // Handle validation errors
  if (req.errors) {
    return res.render('index', {
      loginError: req.errors.map((error) => error.msg).join(' '),
      registerError: null,
      formData: req.body,
      activeTab: 'login',
    });
  }

  // Check for admin credentials
  if (
    req.body.name === process.env.ADMIN_NAME &&
    req.body.password === process.env.ADMIN_PASSWORD
  ) {
    // Initialize session for admin user
    req.session.user = {
      name: req.body.name,
      isAdmin: true,
    };
    req.session.save((error) => {
      if (error) {
        console.error('Session save error:', error);
        return res.status(500).send('Session save failed');
      }
      // Redirect to admin dashboard on successful login
      return res.redirect('/dashboard/admin');
    });
    return;
  }

  try {
    // Authenticate through UsersService
    const data = await UsersService.authenticate(
      req.body.name,
      req.body.password
    );

    // Initialize session for authenticated user
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
      // Redirect to user dashboard on successful login
      return res.redirect('/dashboard/user');
    });
  } catch (error) {
    console.error(
      'Error in userPagesRoute while authenticating the user:',
      error
    );
    let loginError = 'An unexpected error occurred.';

    // Handle invalid password or user not found errors
    if (error instanceof InvalidPassword || error instanceof NotFound) {
      loginError = error.message;
    }

    // Re-render login form with error message
    return res.render('index', {
      loginError,
      registerError: null,
      formData: req.body,
      activeTab: 'login',
    });
  }
});

/**
 * @route   GET /edit-profile
 * @desc    Render edit profile page for authenticated user
 * @access  Private (requires session)
 */
router.get('/edit-profile', async (req, res) => {
  console.log('Query:', req.query);
  try {
    const sessionUser = req.session.user;

    // Redirect if session is missing or expired
    if (!sessionUser || !sessionUser.id) {
      return res.redirect('/');
    }

    // Fetch user data from database
    const fullUser = await UsersService.getUserById(sessionUser.id);

    // Redirect to home if user not found
    if (!fullUser) {
      return res.redirect('/');
    }

    // Choose default avatar if none is set
    const profilePicture =
      fullUser.profile_picture || '/uploads/users/default-avatar.png';

    // Render edit-profile view with user data
    res.render('edit-profile', {
      user: fullUser,
      profilePicture,
      error: null,
      message: req.query.success ? 'Profile updated successfully.' : null,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    // Render page with error message if fetch fails
    res.render('edit-profile', {
      user: null,
      profilePicture: '/uploads/users/default-avatar.png',
      error: 'Failed to load profile data',
      message: null,
    });
  }
});

/**
 * @route   POST /edit
 * @desc    Handle profile update, including optional picture upload
 * @access  Private (requires session)
 * @middleware uploadProfilePicture - handles file upload for profile picture
 * @middleware validateUpdate - validates update input data
 */
router.post('/edit', uploadProfilePicture, validateUpdate, async (req, res) => {
  try {
    // Redirect if session is missing or expired
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/'); // session expired
    }

    const userId = req.session.user.id;

    // Re-render form if upload middleware reported an error
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

    // Build update payload from form data
    const updateData = {
      ...req.body,
    };

    // Attach picture path if a new file was uploaded
    if (req.file) {
      updateData.profile_picture = `/uploads/users/${req.file.filename}`;
    }

    // Perform update in service layer
    await UsersService.updateUserById(userId, updateData);

    // Refresh session data with updated user
    const updatedUser = await UsersService.getUserById(userId);
    req.session.user = {
      id: updatedUser.user_id,
      user_name: updatedUser.user_name,
      user_email: updatedUser.user_email,
      profile_picture: updatedUser.profile_picture,
      isAdmin: req.session.user.isAdmin || false,
    };

    // Redirect back to GET route with success flag
    return res.redirect('/userPage/edit-profile?success=1');
  } catch (error) {
    console.error('Error updating profile:', error);

    let message = 'An error occurred while updating your profile.';

    // Handle known validation or conflict errors
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

    // Re-render form with appropriate error message
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
