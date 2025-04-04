const { body, param, validationResult } = require('express-validator');
const Resume = require('../models/Resume');

const validateResume = [
    body('resume_file_path')
        .isString()
        .isLength({ max: 200 })
        .withMessage('Invalid file path')
        .notEmpty()
        .withMessage("URL is required!"),

    body('resume_file_name')
        .isString()
        .isLength({ max: 45 })
        .withMessage('Invalid file name'),

    body('user_id')
        .notEmpty()
        .withMessage("User ID is required.")
        .isInt()
        .withMessage("User ID must be an integer."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validationResumeId = [
    param('id')
        .isInt().withMessage('ID must be an integer')
        .custom(async (value) => {
            const resume = await Resume.findByPk(value);
            if (!resume) {
                throw new Error("Resume ID does not exist.");
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
    validateResume,
    validationResumeId
};
