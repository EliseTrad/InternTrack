const { body, param, validationResult, oneOf } = require('express-validator');

const validateCoverLetter = [
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
    .withMessage('Path name must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdate = [
  body('cover_file_path')
    .optional()
    .isURL()
    .withMessage('Invalid file path URL')
    .isLength({ max: 600 })
    .notEmpty()
    .withMessage('URL is required!'),

  body('cover_file_name')
    .optional()
    .isString()
    .withMessage('File name must be a string!')
    .notEmpty()
    .withMessage('File name is required!')
    .isLength({ min: 3, max: 50 })
    .withMessage('Path name must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ),

  body('user_id')
    .optional()
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validationCoverLetterId = [
  // Validate either 'id' or 'coverId' in route parameters
  oneOf(
    [
      param('id')
        .isInt()
        .withMessage('ID must be an integer.')
        .notEmpty()
        .withMessage('ID is required.'),

      param('coverId')
        .isInt()
        .withMessage('Cover ID must be an integer.')
        .notEmpty()
        .withMessage('Cover ID is required.'),
    ],
    "Either 'id' or 'coverId' must be provided as a valid integer."
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
  validateCoverLetter,
  validationCoverLetterId,
  validateUpdate,
};
