const { body, param, validationResult } = require('express-validator');

const validateUser = [
    body('user_name')
        .isString()
        .withMessage("Name must be a string!")
        .notEmpty()
        .withMessage("Name is required!")
        .isLength({ min: 3, max: 10 })
        .withMessage("User name must be between 3 and 10 characters."),

    body('user_email')
        .isEmail()
        .withMessage("Email must be valid!")
        .notEmpty()
        .withMessage("Email is required!"),

    body('user_password')
        .isString()
        .withMessage("Password must be a string!")
        .isStrongPassword()
        .withMessage("Password is weak!")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be between 8 and 20 characters."),

    body('profile_picture')
        .optional()
        .isURL()
        .withMessage("Invalid URL for profile picture."),
];

const validationUserId = [
    param('id')
        .isInt().withMessage('ID must be an integer')
        .custom(async (value) => {
            const user = await User.findByPk(value);
            if (!user) {
                throw new Error("User ID does not exist.");
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
    validateUser,
    validationUserId
};
