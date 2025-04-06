const { body, param, validationResult, oneOf } = require('express-validator');

// Middleware to validate resume creation input
const validateResume = [
  body('path')
    .isURL()
    .withMessage('Invalid file path URL')
    .isLength({ max: 600 })
    .notEmpty()
    .withMessage('URL is required!'),

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
    ),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

  // Final validation handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdate = [
  body('path')
    .optional()
    .isURL()
    .withMessage('Invalid file path URL')
    .isLength({ max: 600 })
    .notEmpty()
    .withMessage('URL is required!'),

  body('name')
    .optional()
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

  body('userId')
    .optional()
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

  // Final validation handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware to validate resume ID in URL params
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

module.exports = {
  validateResume,
  validationResumeId,
  validateUpdate,
};
