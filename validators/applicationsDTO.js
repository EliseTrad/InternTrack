const { body, param, validationResult, oneOf } = require('express-validator');

const validateApplication = [
  body('companyName')
    .notEmpty()
    .withMessage('Company name is required.')
    .isString()
    .withMessage('Company name must be a string.'),

  body('positionTitle')
    .notEmpty()
    .withMessage('Position title is required.')
    .isString()
    .withMessage('Position title must be a string.'),

  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(['waitlist', 'rejected', 'not_answered', 'accepted'])
    .withMessage(
      "Status must be one of: 'waitlist', 'rejected', 'not_answered', 'accepted'."
    ),

  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date (YYYY-MM-DD).'),

  body('notes').optional().isString().withMessage('Notes must be a string.'),

  body('applicationSource')
    .notEmpty()
    .withMessage('Application source is required.')
    .isString()
    .withMessage('Application source must be a string.'),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required.')
    .isInt()
    .withMessage('User ID must be an integer.'),

  body('resumeId')
    .notEmpty()
    .withMessage('Resume ID is required.')
    .isInt()
    .withMessage('Resume ID must be an integer.'),

  body('coverId')
    .optional()
    .isInt()
    .withMessage('Cover letter ID must be an integer.'),

  body('date')
    .optional() // Default is now
    .isISO8601()
    .withMessage('Application date must be a valid date (YYYY-MM-DD).'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    next();
  },
];

const validationApplicationId = [
  // Validate that 'id' is an integer and not empty
  param('id')
    .isInt()
    .withMessage('ID must be an integer.')
    .notEmpty()
    .withMessage('ID is required.'),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validationUpdate = [
  body('company_name').optional().isString().trim(),
  body('position_title').optional().isString().trim(),
  body('status')
    .optional()
    .isIn(['waitlist', 'rejected', 'not_answered', 'accepted']),
  body('deadline').optional().isISO8601().toDate(),
  body('notes').optional().isString().trim(),
  body('application_source').optional().isString().trim(),
  body('user_id').optional().isInt({ min: 1 }),
  body('resume_id').optional().isInt({ min: 1 }),
  body('cover_letter_id').optional().isInt({ min: 1 }),
];

const validationStatus = [
  param('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(['waitlist', 'rejected', 'not_answered', 'accepted'])
    .withMessage(
      "Status must be one of: 'waitlist', 'rejected', 'not_answered', 'accepted'."
    ),
  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validationDate = [
  oneOf(
    [
      param('date')
        .notEmpty()
        .withMessage('Application date is required.')
        .isISO8601()
        .withMessage('Application date must be a valid date (YYYY-MM-DD).'),

      param('deadline')
        .notEmpty()
        .withMessage('Application date is required.')
        .isISO8601()
        .withMessage('Application date must be a valid date (YYYY-MM-DD).'),
    ],
    'Date and deadline must be valid.'
  ),
  // Middleware to check for validation errors
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
