const express = require('express');
const UserController = require('../controllers/usersController');
const router = express.Router();
const {
  validateUser,
  validationUserId,
  validationName,
  validateUpdate,
} = require('../validators/usersDTO');

// Register user
router.post('/register', validateUser, (req, res) =>
  UserController.registerUser(req, res)
);

// Authenticate user
router.post('/authenticate', validationName, (req, res) =>
  UserController.authenticate(req, res)
);

// Update user
router.put('/update/:id', validateUpdate, validationUserId, (req, res) =>
  UserController.updateUserById(req, res)
);

// Get all users
router.get('/', (req, res) => UserController.getAllUsers(req, res));

// Get user by ID
router.get('/:id', validationUserId, (req, res) =>
  UserController.getUserById(req, res)
);

// Get user by name
router.get('/name/:name', validationName, (req, res) =>
  UserController.getUserByName(req, res)
);

// Get user by email
router.get('/email/:email', (req, res) =>
  UserController.getUserByEmail(req, res)
);

// Delete user by ID
router.delete('/delete/:id', validationUserId, (req, res) =>
  UserController.deleteUser(req, res)
);

module.exports = router;
