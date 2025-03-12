const {body, param, validationResult} = require('express-validator');
const validateUser= [
    body('user_name')
    .isString()
    .withMessage("Name must be a string!")
    .notEmpty()
    .withMessage("Name is required!"),
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
    .isLength(11)
    .withMessage("Paswword is too short!"),

]