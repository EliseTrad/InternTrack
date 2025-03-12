const express = require(`express`);

const UserController = require("../controllers/usersController");

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/create/', UserController.createUser);
router.post('/authenticate', UserController.authenticate);

router.put('/update/:id', UserController.updateUser);

router.get('/', UserController.getAllUsers);
router.get('/user/:id', UserController.getUserById);
router.get('/user/name/:name', UserController.getUserByName);
router.get('/user/email/:email', UserController.getUserByEmail);
router.get('/user/created/:date', UserController.getUserByAccountCreationDate);
router.get('/user/exists/:name', UserController.userExists);

router.delete('/user/:id', UserController.deleteUser);

module.exports = router;
