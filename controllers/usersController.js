const UserService = require('../services/usersService');
const {
  NotFound,
  UserConflictError,
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  InvalidPassword,
} = require('../errors/customError');

class UsersController {
  // Create a new user
  static async registerUser(req, res) {
    try {
      const { name, email, password, profile } = req.body;
      const newUser = await UserService.createUser({
        user_name: name,
        user_email: email,
        user_password: password,
        profile_picture: profile,
      });
      res.status(201).json(newUser); // Created
    } catch (error) {
      if (
        error instanceof EmailAlreadyExistsError ||
        error instanceof NameAlreadyExistsError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  // Update user by ID
  static async updateUserById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the application
      const updatedUser =
        await UserService.updateUserById(id, updateData);

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the user.' });
      }
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users); // OK
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      res.status(200).json(user); // OK
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  // Get user by name
  static async getUserByName(req, res) {
    try {
      const { name } = req.params;
      const user = await UserService.getUserByName(name);

      res.status(200).json(user); // OK
    } catch (error) {
      console.error('Error in getUserByName controller:', error);

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  // Get user by email
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await UserService.getUserByEmail(email);

      res.status(200).json(user); // OK
    } catch (error) {
      console.error('Error in getUserByEmail controller:', error);

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  // Authenticate user
  static async authenticate(req, res) {
    try {
      const { name, password } = req.body;
      const user = await UserService.authenticate(name, password);
      res.status(200).json(user); // OK
    } catch (error) {
      if (
        error instanceof NotFound ||
        error instanceof InvalidPassword
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  // Delete user by ID
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const isDeleted = await UserService.deleteUser(id);
      if (isDeleted) {
        res.status(204).end(); // No Content
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      if (
        error instanceof NotFound ||
        error instanceof UserConflictError
      ) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }
}

module.exports = UsersController;
