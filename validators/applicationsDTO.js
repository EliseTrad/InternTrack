const { body, param, validationResult, oneOf } = require('express-validator');

/**
 * Middleware to validate application creation input.
 * Ensures that required fields meet specific criteria.
 */
const validateApplication = [
  // Validate the 'companyName' field (required)
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required.') 
    .isString()
    .withMessage('Company name must be a string.'), 

  // Validate the 'positionTitle' field (required)
  body('positionTitle')
    .notEmpty()
    .withMessage('Position title is required.') 
    .isString()
    .withMessage('Position title must be a string.'), 

  // Validate the 'status' field (required)
  body('status')
    .notEmpty()
    .withMessage('Status is required.') 
    .isIn(['waitlist', 'rejected', 'not_answered', 'accepted'])
    .withMessage(
      "Status must be one of: 'waitlist', 'rejected', 'not_answered', 'accepted'."
    ), // Ensure the status is one of the allowed values

  // Validate the optional 'deadline' field
  body('deadline')
    .optional() 
    .isISO8601()
    .withMessage('Deadline must be a valid date (YYYY-MM-DD).'), 

  // Validate the optional 'notes' field
  body('notes')
    .optional() 
    .isString()
    .withMessage('Notes must be a string.'), 

  // Validate the 'applicationSource' field (required)
  body('source')
    .notEmpty()
    .withMessage('Application source is required.') 
    .isString()
    .withMessage('Application source must be a string.'), 

  // Validate the 'userId' field (required)
  body('userId')
    .notEmpty()
    .withMessage('User ID is required.') 
    .isInt()
    .withMessage('User ID must be an integer.'), 

  // Validate the 'resumeId' field (required)
  body('resumeId')
    .notEmpty()
    .withMessage('Resume ID is required.') 
    .isInt()
    .withMessage('Resume ID must be an integer.'), 

  // Validate the optional 'coverId' field
  body('coverId')
    .optional() // Field is not required
    .isInt()
    .withMessage('Cover letter ID must be an integer.'), 

  // Validate the optional 'date' field
  body('date')
    .optional() // Default is now
    .isISO8601()
    .withMessage('Application date must be a valid date (YYYY-MM-DD).'), 

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
 * Middleware to validate application ID in URL parameters.
 * Ensures that the 'id' parameter is a valid integer.
 */
const validationApplicationId = [
  // Validate that 'id' is an integer and not empty
  param('id')
    .isInt()
    .withMessage('ID must be an integer.') // Ensure the ID is a valid integer
    .notEmpty()
    .withMessage('ID is required.'), // Ensure the ID is provided

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
 * Middleware to validate application updates.
 * Only validates fields that are provided in the update data.
 */
const validationUpdate = [
  body('company_name')
    .optional() // Field is not required
    .isString()
    .trim(), // Ensure the company name is a trimmed string

  body('position_title')
    .optional() // Field is not required
    .isString()
    .trim(), // Ensure the position title is a trimmed string

  body('status')
    .optional() // Field is not required
    .isIn(['waitlist', 'rejected', 'not_answered', 'accepted']), // Ensure the status is one of 
                                                                 // the allowed values

  body('deadline')
    .optional() // Field is not required
    .isISO8601()
    .toDate(), // Ensure the deadline is a valid date

  body('notes')
    .optional() // Field is not required
    .isString()
    .trim(), // Ensure the notes are a trimmed string

  body('application_source')
    .optional() // Field is not required
    .isString()
    .trim(), // Ensure the application source is a trimmed string

  body('user_id')
    .optional() // Field is not required
    .isInt({ min: 1 }), // Ensure the user ID is a positive integer

  body('resume_id')
    .optional() // Field is not required
    .isInt({ min: 1 }), // Ensure the resume ID is a positive integer

  body('cover_letter_id')
    .optional() // Field is not required
    .isInt({ min: 1 }), // Ensure the cover letter ID is a positive integer
];

/**
 * Middleware to validate application status in URL parameters.
 * Ensures that the 'status' parameter is one of the allowed values.
 */
const validationStatus = [
  param('status')
    .notEmpty()
    .withMessage('Status is required.') // Ensure the status is provided
    .isIn(['waitlist', 'rejected', 'not_answered', 'accepted'])
    .withMessage(
      "Status must be one of: 'waitlist', 'rejected', 'not_answered', 'accepted'."
    ), // Ensure the status is one of the allowed values

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
 * Middleware to validate application date or deadline in URL parameters.
 * Ensures that either 'date' or 'deadline' is a valid ISO 8601 date.
 */
const validationDate = [
  oneOf(
    [
      param('date')
        .notEmpty()
        .withMessage('Application date is required.') // Ensure the application date is provided
        .isISO8601()
        .withMessage('Application date must be a valid date (YYYY-MM-DD).'), // Ensure the application 
                                                                             // date is a valid date

      param('deadline')
        .notEmpty()
        .withMessage('Application deadline is required.') // Ensure the application deadline is provided
        .isISO8601()
        // Ensure the application deadline is a valid date
        .withMessage('Application deadline must be a valid date (YYYY-MM-DD).'),
    ],
    'Date and deadline must be valid.'
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
  validateApplication,
  validationApplicationId,
  validationStatus,
  validationDate,
  validationUpdate,
};