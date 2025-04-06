const { body, param, validationResult, oneOf } = require('express-validator');

/**
 * Validates the user object during creation (name, email, password, and profile picture URL).
 * @returns {Array} The validation middleware for user creation.
 */
const validateUser = [
  // Validate the 'name' field
  body('name')
    .trim() // Remove leading/trailing whitespace
    .isString()
    .withMessage('Name must be a string!')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  // Validate the 'email' field
  body('email')
    .trim() // Remove leading/trailing whitespace
    .normalizeEmail() // Normalize email format (e.g., convert to lowercase)
    .isEmail()
    .withMessage('Email must be valid!')
    .notEmpty()
    .withMessage('Email is required!')
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters.'),

  // Validate the 'password' field
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

  // Validate the optional 'profile' field
  body('profile')
    .optional() // Field is not required
    .isURL()
    .withMessage('Profile picture URL must be a valid URL.')
    .isLength({ max: 600 })
    .withMessage('Profile picture URL cannot exceed 600 characters.'),

  /**
   * Middleware to check for validation errors and respond accordingly.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
  // Validate the optional 'user_name' field
  body('user_name')
    .optional() // Field is not required
    .trim()
    .isString()
    .withMessage('Name must be a string!')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  // Validate the optional 'user_email' field
  body('user_email')
    .optional() // Field is not required
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid!')
    .notEmpty()
    .withMessage('Email is required!')
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters.'),

  // Validate the optional 'user_password' field
  body('user_password')
    .optional() // Field is not required
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

  // Validate the optional 'profile_picture' field
  body('profile_picture')
    .optional() // Field is not required
    .isURL()
    .withMessage('Profile picture URL must be a valid URL.')
    .isLength({ max: 600 })
    .withMessage('Profile picture URL cannot exceed 600 characters.'),

  /**
   * Middleware to check for validation errors and respond accordingly.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validates the user ID parameter (either 'id' or 'userId').
 * @returns {Array} The validation middleware for user ID.
 */
const validationUserId = [
  // Validate either 'id' or 'userId' in route parameters
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

  /**
   * Middleware to check for validation errors and respond accordingly.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validates the user's name in the request body or parameters.
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

  /**
   * Middleware to check for validation errors and respond accordingly.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validates the user's email in the request body or parameters.
 * @returns {Array} The validation middleware for the user's email.
 */
const validationEmail = [
  param('email')
    .normalizeEmail() // Normalize email format (e.g., convert to lowercase)
    .isEmail()
    .withMessage('Email must be valid!')
    .notEmpty()
    .withMessage('Email is required!')
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters.'),

  /**
   * Middleware to check for validation errors and respond accordingly.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
};