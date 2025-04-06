const { body, param, validationResult, oneOf } = require('express-validator');

/**
 * Middleware to validate cover letter creation input.
 * Ensures that the `path`, `name`, and `userId` fields meet specific criteria.
 */
const validateCoverLetter = [
  // Validate the 'path' field (URL of the cover letter file)
  body('path')
    .isURL()
    .withMessage('Invalid file path URL') // Ensure the URL is valid
    .isLength({ max: 600 })
    .withMessage('File path URL is too long!') // Ensure the URL is not excessively long
    .notEmpty()
    .withMessage('File path URL is required!'), // Ensure the URL is provided

  // Validate the 'name' field (file name of the cover letter)
  body('name')
    .isString()
    .withMessage('File name must be a string!') // Ensure the name is a string
    .notEmpty()
    .withMessage('File name is required!') // Ensure the name is provided
    .isLength({ min: 3, max: 50 })
    .withMessage('File name must be between 3 and 50 characters.') // Ensure the name length is within limits
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ), // Ensure the name contains only allowed characters

  // Validate the 'userId' field (ID of the user associated with the cover letter)
  body('userId')
    .notEmpty()
    .withMessage('User ID is required.') // Ensure the user ID is provided
    .isInt()
    .withMessage('User ID must be an integer.'), // Ensure the user ID is a valid integer

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
 * Middleware to validate cover letter updates.
 * Validates optional fields (`cover_file_path`, `cover_file_name`, and `user_id`) during updates.
 */
const validateUpdate = [
  // Validate the optional 'cover_file_path' field
  body('cover_file_path')
    .optional() // Field is not required
    .isURL()
    .withMessage('Invalid file path URL') // Ensure the URL is valid
    .isLength({ max: 600 })
    .withMessage('File path URL is too long!') // Ensure the URL is not excessively long
    .notEmpty()
    .withMessage('File path URL is required!'), // Ensure the URL is provided if present

  // Validate the optional 'cover_file_name' field
  body('cover_file_name')
    .optional() // Field is not required
    .isString()
    .withMessage('File name must be a string!') // Ensure the name is a string
    .notEmpty()
    .withMessage('File name is required!') // Ensure the name is provided if present
    .isLength({ min: 3, max: 50 })
    .withMessage('File name must be between 3 and 50 characters.') // Ensure the name length is within limits
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'File name can only contain letters, numbers, and underscores'
    ), // Ensure the name contains only allowed characters

  // Validate the optional 'user_id' field
  body('user_id')
    .optional() // Field is not required
    .notEmpty()
    .withMessage('User ID is required.') // Ensure the user ID is provided if present
    .isInt()
    .withMessage('User ID must be an integer.'), // Ensure the user ID is a valid integer

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
 * Middleware to validate cover letter ID in URL parameters.
 * Ensures that either `id` or `coverId` is provided as a valid integer.
 */
const validationCoverLetterId = [
  // Validate either 'id' or 'coverId' in route parameters
  oneOf(
    [
      param('id')
        .isInt()
        .withMessage('ID must be an integer.') // Ensure 'id' is a valid integer
        .notEmpty()
        .withMessage('ID is required.'), // Ensure 'id' is provided

      param('coverId')
        .isInt()
        .withMessage('Cover ID must be an integer.') // Ensure 'coverId' is a valid integer
        .notEmpty()
        .withMessage('Cover ID is required.'), // Ensure 'coverId' is provided
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
