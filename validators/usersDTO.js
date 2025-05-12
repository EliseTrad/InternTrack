const { body, param, validationResult, oneOf } = require('express-validator');

/**
 * Validates the user object during creation (name, email, password, and profile picture URL).
 * @returns {Array} The validation middleware for user creation.
 */
const validateUser = [
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string!')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid!')
    .notEmpty()
    .withMessage('Email is required!')
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters.'),

  body('password')
    .isString()
    .withMessage('Password must be a string!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters.')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.'
    ),

  body('profile')
    .optional()
    .isURL()
    .withMessage('Profile picture URL must be a valid URL.')
    .isLength({ max: 600 })
    .withMessage('Profile picture URL cannot exceed 600 characters.'),

  // Middleware to handle validation errors and respond accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array(); // Store errors in req.errors for rendering
      return next(); // Pass to the next middleware for rendering
    }
    next();
  },
];

/**
 * Validates the user object during updates (name, email, password, and profile picture URL).
 * Fields are optional since this is for partial updates.
 * @returns {Array} The validation middleware for user updates.
 */
const validateUpdate = [
  body('user_name')
    .optional()
    .trim()
    .isString()
    .withMessage('Name must be a string!')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('user_email')
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid!')
    .notEmpty()
    .withMessage('Email is required!')
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters.'),

  body('user_password')
    .optional()
    .isString()
    .withMessage('Password must be a string!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters.')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.'
    ),

  body('profile_picture')
    .optional()
    .isURL()
    .withMessage('Profile picture URL must be a valid URL.')
    .isLength({ max: 600 })
    .withMessage('Profile picture URL cannot exceed 600 characters.'),

  // Middleware to handle validation errors and respond accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors
        .array()
        .map((e) => e.msg)
        .join(' ');
      return next();
    }
    next();
  },
];

/**
 * Validates the user ID parameter (either 'id' or 'userId').
 * @returns {Array} The validation middleware for user ID.
 */
const validationUserId = [
  oneOf(
    [
      param('id')
        .isInt()
        .withMessage('ID must be an integer.')
        .notEmpty()
        .withMessage('ID is required.'),

      param('userId')
        .isInt()
        .withMessage('User ID must be an integer.')
        .notEmpty()
        .withMessage('User ID is required.'),
    ],
    "Either 'id' or 'userId' must be provided as a valid integer."
  ),

  // Middleware to handle validation errors and respond accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array(); // Store errors in req.errors for rendering
      return next(); // Pass to the next middleware for rendering
    }
    next();
  },
];

/**
 * Validates the user's name in the request parameters.
 * @returns {Array} The validation middleware for the user's name.
 */
const validationName = [
  param('name')
    .isString()
    .withMessage('Name must be a string!')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  // Middleware to handle validation errors and respond accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array(); // Store errors in req.errors for rendering
      return next(); // Pass to the next middleware for rendering
    }
    next();
  },
];

/**
 * Validates the user's email in the request parameters.
 * @returns {Array} The validation middleware for the user's email.
 */
const validationEmail = [
  param('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid!')
    .notEmpty()
    .withMessage('Email is required!')
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters.'),

  // Middleware to handle validation errors and respond accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array(); // Store errors in req.errors for rendering
      return next(); // Pass to the next middleware for rendering
    }
    next();
  },
];

/**
 * Validates the user login input (username and password).
 * @returns {Function} Express middleware to validate authentication body.
 */
const validateAuthentication = [
  body('name')
    .trim()
    .isString()
    .withMessage('Name must be a string!')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('password')
    .isString()
    .withMessage('Password must be a string!')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters.')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.'
    ),

  // Middleware to handle validation errors and respond accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.errors = errors.array(); // Store errors in req.errors for rendering
      return next(); // Pass to the next middleware for rendering
    }
    next();
  },
];

module.exports = {
  validateUser,
  validationUserId,
  validationEmail,
  validationName,
  validateUpdate,
  validateAuthentication,
};
