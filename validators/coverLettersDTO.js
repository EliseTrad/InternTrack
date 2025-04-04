const { body, param, validationResult } = require('express-validator');
const CoverLetter = require('../models/CoverLetter');

const validateCoverLetter = [
    body('cover_file_path')
        .isString()
        .isLength({ max: 200 })
        .withMessage('Invalid file path')
        .notEmpty()
        .withMessage("URL is required!"),

    body('cover_file_name')
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

const validationCoverLetterId = [
    param('id')
        .isInt().withMessage('ID must be an integer')
        .custom(async (value) => {
            const cover = await CoverLetter.findByPk(value);
            if (!cover) {
                throw new Error("Cover letter ID does not exist.");
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
    validateCoverLetter,
    validationCoverLetterId
};
