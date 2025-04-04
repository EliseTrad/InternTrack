const { body, param, validationResult } = require('express-validator');
const Application = require('../models/Application');

const validateApplication = [
    body('company_name')
        .notEmpty()
        .withMessage("Company name is required.")
        .isString()
        .withMessage("Company name must be a string."),

    body('position_title')
        .notEmpty()
        .withMessage("Position title is required.")
        .isString()
        .withMessage("Position title must be a string."),

    body('status')
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(['waitlist', 'rejected', 'not answered', 'accepted'])
        .withMessage("Status must be one of: 'waitlist', 'rejected', 'not answered', 'accepted'."),

    body('deadline')
        .optional()
        .isISO8601()
        .withMessage("Deadline must be a valid date (YYYY-MM-DD)."),

    body('notes')
        .optional()
        .isString()
        .withMessage("Notes must be a string."),

    body('application_source')
        .notEmpty()
        .withMessage("Application source is required.")
        .isString()
        .withMessage("Application source must be a string."),

    body('user_id')
        .notEmpty()
        .withMessage("User ID is required.")
        .isInt()
        .withMessage("User ID must be an integer."),

    body('resume_id')
        .notEmpty()
        .withMessage("Resume ID is required.")
        .isInt()
        .withMessage("Resume ID must be an integer."),

    body('cover_letter_id')
        .optional()
        .isInt()
        .withMessage("Cover letter ID must be an integer."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ errors: errors.array() });
        }
        next();
    }
];

const validationApplicationId = [
    param('id')
        .isInt().withMessage('ID must be an integer')
        .custom(async (value) => {
            const application = await Application.findByPk(value);
            if (!application) {
                throw new Error("Application ID does not exist.");
            }
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateApplication,
    validationApplicationId
}
