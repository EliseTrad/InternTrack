const { body, param, validationResult, oneOf } = require('express-validator');

/**
 * Middleware to validate resume creation input.
 * Ensures that the `path`, `name`, and `userId` fields meet specific criteria.
 */
const validateResume = [
  // Validate the 'path' field (URL of the resume file)
  body('path')
    .isURL()
    .withMessage('Invalid file path URL')
    .isLength({ max: 600 })
    .withMessage('File path URL is too long!')
    .notEmpty()
    .withMessage('File path URL is required!'),

  // Validate the 'name' field (file name of the resume)
  body('name')
    .isString()
    .withMessage('File name must be a string!')
    .notEmpty()
    .withMessage('File name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('File name must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ), // Ensure the name contains only allowed characters

  // Validate the 'userId' field (ID of the user associated with the resume)
  body('userId')
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

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
 * Middleware to validate resume updates.
 * Validates optional fields (`path`, `name`, and `userId`) during updates.
 */
const validateUpdate = [
  // Validate the optional 'path' field
  body('resume_file_path')
    .optional() // Field is not required
    .isURL()
    .withMessage('Invalid file path URL')
    .isLength({ max: 600 })
    .withMessage('File path URL is too long!')
    .notEmpty()
    .withMessage('File path URL is required!'),

  // Validate the optional 'name' field
  body('resume_file_name')
    .optional() // Field is not required
    .isString()
    .withMessage('File name must be a string!')
    .notEmpty()
    .withMessage('File name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('File name must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ),

  // Validate the optional 'userId' field
  body('user_id')
    .optional()
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

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
 * Middleware to validate resume ID in URL parameters.
 * Ensures that either `id` or `resumeId` is provided as a valid integer.
 */
const validationResumeId = [
  // Validate either 'id' or 'resumeId' in route parameters
  oneOf(
    [
      param('id')
        .isInt()
        .withMessage('ID must be an integer.')
        .notEmpty()
        .withMessage('ID is required.'),

      param('resumeId')
        .isInt()
        .withMessage('Resume ID must be an integer.')
        .notEmpty()
        .withMessage('Resume ID is required.'),
    ],
    "Either 'id' or 'resumeId' must be provided as a valid integer."
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
 * Middleware to validate file name in req parameters.
 */
const validationName = [
  // Validate the 'name' field (file name of the resume)
  param('name')
    .isString()
    .withMessage('File name must be a string!')
    .notEmpty()
    .withMessage('File name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('File name must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ), // Ensure the name contains only allowed characters

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
  validateResume,
  validationResumeId,
  validateUpdate,
  validationName,
};
