const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Validates the user object (name, email, password, and profile picture URL).
 * @returns {Array} The validation middleware for user creation.
 */
const validateUser = [
    body('user_name')
        .trim()
        .isString().withMessage("Name must be a string!")
        .notEmpty().withMessage("Name is required!")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),

    body('user_email')
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Email must be valid!")
        .notEmpty().withMessage("Email is required!")
        .isLength({ max: 100 }).withMessage("Email too long!"),

    body('user_password')
        .isString().withMessage("Password must be a string!")
        .isLength({ min: 8, max: 20 }).withMessage("Password must be between 8-20 characters")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage("Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol"),

    body('profile_pic')
        .optional()
        .isURL().withMessage("Invalid profile picture URL")
        .isLength({ max: 600 }).withMessage("URL too long!"),

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
    }
];

/**
 * Validates the user ID parameter.
 * @returns {Array} The validation middleware for user ID.
 */
const validationUserId = [
    param('id')
        .isInt().withMessage('User ID must be an integer.')
        .notEmpty().withMessage('User ID is required.'),

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
    }
];

/**
 * Validates the user's name in the request body or parameters.
 * @returns {Array} The validation middleware for the user's name.
 */
const validationName = [
    param('name')
        .optional()
        .isString().withMessage("Name must be a string!")
        .notEmpty().withMessage("Name is required!")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),

    body('user_name')
        .optional()
        .isString().withMessage("Name must be a string!")
        .notEmpty().withMessage("Name is required!")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),

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
    }
];

/**
 * Validates the user's email in the request body or parameters.
 * @returns {Array} The validation middleware for the user's email.
 */
const validationEmail = [
    param('email')
        .optional()
        .normalizeEmail()
        .isEmail().withMessage("Email must be valid!")
        .notEmpty().withMessage("Email is required!")
        .isLength({ max: 100 }).withMessage("Email too long!"),

    body('user_email')
        .optional()
        .normalizeEmail()
        .isEmail().withMessage("Email must be valid!")
        .notEmpty().withMessage("Email is required!")
        .isLength({ max: 100 }).withMessage("Email too long!"),

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
    }
];

/**
 * Validates the user's password in the request body.
 * @returns {Array} The validation middleware for the user's password.
 */
const validationPassword = [
    body('user_password')
        .isString().withMessage("Password must be a string!")
        .isLength({ min: 8, max: 20 }).withMessage("Password must be between 8-20 characters")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage("Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol"),

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
    }
];

/**
 * Validates the user's profile URL in the request body or parameters.
 * @returns {Array} The validation middleware for the user's profile.
 */
const validationProfile = [
    param('profile')
        .isURL().withMessage("Invalid profile picture URL")
        .isLength({ max: 600 }).withMessage("URL too long!"),

    body('profile_picture')
        .isURL().withMessage("Invalid profile picture URL")
        .isLength({ max: 600 }).withMessage("URL too long!"),

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
    }
];

module.exports = {
    validateUser,
    validationUserId,
    validationEmail,
    validationName,
    validationPassword,
    validationProfile
};
