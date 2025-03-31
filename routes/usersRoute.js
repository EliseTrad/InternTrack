const express = require('express');
const UserController = require('../controllers/usersController');
const router = express.Router();
const { validateUser, validationUserId } = require('../validators/usersDTO');

// Register user
router.post('/register', validateUser, UserController.registerUser);

// Authenticate user
router.post('/authenticate', validateUser, UserController.authenticate);

// Update user
router.put('/update/:id', validationUserId, validateUser, UserController.updateUser);

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', validationUserId, UserController.getUserById);  

// Get user by name
router.get('/name/:name', UserController.getUserByName); 

// Get user by email
router.get('/email/:email', UserController.getUserByEmail);  

// Get users by account creation date
router.get('/created/:date', UserController.getUserByAccountCreationDate); 

// Delete user by ID
router.delete('/delete/:id', validationUserId, UserController.deleteUser);  

module.exports = router;
