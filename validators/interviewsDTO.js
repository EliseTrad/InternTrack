const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to validate the creation or update of an interview.
 */
const validateInterview = [
  body('interview_date')
    .isISO8601()
    .withMessage(
      'Interview date must be a valid datetime in ISO 8601 format (YYYY-MM-DDTHH:mm:ss).'
    )
    .toDate(),

  body('interviewer_name')
    .notEmpty()
    .withMessage('Interviewer name is required.')
    .isString()
    .withMessage('Interviewer name must be a string.'),

  body('interviewer_email')
    .isEmail()
    .withMessage('Interviewer email must be a valid email address.')
    .notEmpty()
    .withMessage('Interviewer email is required.'),

  body('location')
    .notEmpty()
    .withMessage('Location is required.')
    .isString()
    .withMessage('Location must be a string.'),

  body('reminder_sent')
    .notEmpty()
    .withMessage('Reminder status is required.')
    .isBoolean()
    .withMessage('Reminder status must be a boolean value (true or false).'),

  body('interview_status')
    .notEmpty()
    .withMessage('Interview status is required.')
    .isIn(['scheduled', 'completed', 'cancelled', 'no_show'])
    .withMessage(
      "Interview status must be one of: 'scheduled', 'completed', 'cancelled', 'no_show'."
    ),

  body('application_id')
    .notEmpty()
    .withMessage('Application ID is required.')
    .isInt()
    .withMessage('Application ID must be an integer.'),

  /**
   * Middleware to handle validation errors.
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
 * Middleware to validate the interview ID parameter.
 */
const validationInterviewId = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer.')
    .notEmpty()
    .withMessage('ID is required.'),

  /**
   * Middleware to handle validation errors.
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
 * Middleware to validate the reminder status parameter.
 */
const validationReminder = [
  param('reminder')
    .notEmpty()
    .withMessage('Reminder status is required.')
    .isBoolean()
    .withMessage('Reminder status must be a boolean value (true or false).'),

  /**
   * Middleware to handle validation errors.
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
 * Middleware to validate the interview status parameter.
 */
const validationStatus = [
  param('status')
    .notEmpty()
    .withMessage('Interview status is required.')
    .isIn(['scheduled', 'completed', 'cancelled', 'no_show'])
    .withMessage(
      "Interview status must be one of: 'scheduled', 'completed', 'cancelled', 'no_show'."
    ),

  /**
   * Middleware to handle validation errors.
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
 * Middleware to validate the partial update of an interview.
 */
const validationUpdateInterview = [
  body('interview_date')
    .optional()
    .isISO8601()
    .withMessage(
      'Interview date must be a valid datetime in ISO 8601 format (YYYY-MM-DDTHH:mm:ss).'
    )
    .toDate(),

  body('interviewer_name')
    .optional()
    .isString()
    .withMessage('Interviewer name must be a string.'),

  body('interviewer_email')
    .optional()
    .isEmail()
    .withMessage('Interviewer email must be a valid email address.'),

  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string.'),

  body('reminder_sent')
    .optional()
    .isBoolean()
    .withMessage('Reminder status must be a boolean value (true or false).'),

  body('interview_status')
    .optional()
    .isIn(['scheduled', 'completed', 'cancelled', 'no_show'])
    .withMessage(
      "Interview status must be one of: 'scheduled', 'completed', 'cancelled', 'no_show'."
    ),

  body('application_id')
    .optional()
    .isInt()
    .withMessage('Application ID must be an integer.'),

  /**
   * Middleware to handle validation errors.
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
 * Middleware to validate a date parameter.
 */
const validateDate = [
  param('date')
    .isISO8601()
    .withMessage('Date must be a valid datetime in ISO 8601 format (YYYY-MM-DDTHH:mm:ss).')
    .toDate(),

  /**
   * Middleware to handle validation errors.
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
  validateInterview,
  validationInterviewId,
  validationUpdateInterview,
  validationStatus,
  validationReminder,
  validateDate,
};