const express = require('express');
const UserController = require('../controllers/usersController');
const router = express.Router();
const { validateUser,
    validationUserId,
    validationName,
    validationPassword,
    validationEmail,
    validationProfile } = require('../validators/usersDTO');

// Register user
router.post('/register', validateUser, (req, res) => UserController.registerUser(req, res));

// Authenticate user
router.post('/authenticate', validationName, validationPassword,
    (req, res) => UserController.authenticate(req, res));

// Update user's name
router.put('/update/name/:id', validationName, validationUserId,
    (req, res) => UserController.updateNameById(req, res));

// Update user's email
router.put('/update/email/:id', validationEmail, validationUserId,
    (req, res) => UserController.updateEmailById(req, res));

// Update user's password
router.put('/update/password/:id', validationPassword, validationUserId,
    (req, res) => UserController.updatePasswordById(req, res));

// Update user's profile picture
router.put('/update/profile/:id', validationProfile, validationUserId,
    (req, res) => UserController.updateProfileById(req, res));

// Update user 
router.put('/update/:id', validateUser, validationUserId,
    (req, res) => UserController.updateUserById(req, res));

// Get all users
router.get('/', (req, res) => UserController.getAllUsers(req, res));

// Get user by ID
router.get('/:id', validationUserId, (req, res) => UserController.getUserById(req, res));

// Get user by name
router.get('/name/:name', validationName, (req, res) => UserController.getUserByName(req, res));

// Get user by email
router.get('/email/:email', validationEmail, (req, res) => UserController.getUserByEmail(req, res));

// Get users by account creation date
router.get('/created/:date', (req, res) => UserController.getUserByAccountCreationDate(req, res));

// Delete user by ID
router.delete('/delete/:id', validationUserId, (req, res) => UserController.deleteUser(req, res));


module.exports = router;
