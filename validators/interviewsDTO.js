const { body, param, validationResult } = require('express-validator');

const validateInterview = [
  body('interview_date')
    .isISO8601()
    .withMessage(
      'Interview date must be a valid datetime (YYYY-MM-DDTHH:mm:ss).'
    )
    .toDate(),

  body('interviewer_name')
    .notEmpty()
    .withMessage('Interviewer name is required.')
    .isString()
    .withMessage('Interviewer name must be a string.'),

  body('interviewer_email')
    .isEmail()
    .withMessage('Interviewer email must be valid!')
    .notEmpty()
    .withMessage('Interviewer email is required!'),

  body('location')
    .notEmpty()
    .withMessage('location is required.')
    .isString()
    .withMessage('location must be a string.'),

  body('reminder_sent')
    .notEmpty()
    .withMessage('location is required.')
    .isBoolean()
    .withMessage('Reminder should be a boolean (true or false).'),

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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validationInterviewId = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer.')
    .notEmpty()
    .withMessage('ID is required.'),

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

const validationReminder = [
  param('reminder')
    .notEmpty()
    .withMessage('location is required.')
    .isBoolean()
    .withMessage('Reminder should be a boolean (true or false).'),

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

const validationStatus = [
  param('status')
    .notEmpty()
    .withMessage('Interview status is required.')
    .isIn(['scheduled', 'completed', 'cancelled', 'no_show'])
    .withMessage(
      "Interview status must be one of: 'scheduled', 'completed', 'cancelled', 'no_show'."
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

const validationUpdateInterview = [
  body('interview_date')
    .optional()
    .isISO8601()
    .withMessage(
      'Interview date must be a valid datetime (YYYY-MM-DDTHH:mm:ss).'
    )
    .toDate(),

  body('interviewer_name')
    .optional()
    .isString()
    .withMessage('Interviewer name must be a string.'),

  body('interviewer_email')
    .optional()
    .isEmail()
    .withMessage('Interviewer email must be valid!'),

  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string.'),

  body('reminder_sent')
    .optional()
    .isBoolean()
    .withMessage('Reminder should be a boolean (true or false).'),

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

  // Middleware to return errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateDate = [
  param('date')
    .isISO8601()
    .withMessage('Date must be a valid datetime (YYYY-MM-DDTHH:mm:ss).')
    .toDate(), // Converts the validated string to a JavaScript Date object

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the next middleware/controller
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
