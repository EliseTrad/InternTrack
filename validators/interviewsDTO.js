const { body, param, validationResult } = require('express-validator');
const Interview = require('../models/Interview');

const validateInterview = [
    body('interview_date')
        .isDate()
        .withMessage('Deadline must be a valid date (YYYY-MM-DD HH:mm:ss).'),

    body('interviewer_name')
        .notEmpty()
        .withMessage("Interviewer name is required.")
        .isString()
        .withMessage("Interviewer name must be a string."),

    body('interviewer_email')
        .isEmail()
        .withMessage("Interviewer email must be valid!")
        .notEmpty()
        .withMessage("Interviewer email is required!"),

    body('location')
        .notEmpty()
        .withMessage("location is required.")
        .isString()
        .withMessage("location must be a string."),

    body('reminder_sent')
        .notEmpty()
        .withMessage("location is required.")
        .isBoolean()
        .withMessage("Reminder should be a boolean (true or false)."),

    body('interview_status')
        .notEmpty()
        .withMessage("Interview status is required.")
        .isIn(['scheduled', 'completed', 'cancelled', 'no_show'])
        .withMessage("Interview status must be one of: 'scheduled', 'completed', 'cancelled', 'no_show'."),

    body('application_id')
        .notEmpty()
        .withMessage("Application ID is required.")
        .isInt()
        .withMessage("Application ID must be an integer."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

]

const validationInterviewId = [
    param('id')
        .isInt().withMessage('ID must be an integer')
        .custom(async (value) => {
            const inter = await Interview.findByPk(value);
            if (!inter) {
                throw new Error("Interview ID does not exist.");
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
    validateInterview,
    validationInterviewId
};