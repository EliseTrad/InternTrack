const UserService = require('../services/usersService');
const {
  NotFound,
  UserConflictError,
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  InvalidPassword,
} = require('../errors/customError');

/**
 * UsersController class provides methods to handle HTTP requests related to users.
 * Each method interacts with the UserService to perform CRUD operations on users.
 */
class UsersController {
  /**
   * Registers a new user in the system.
   * Validates that the email and username are unique before creating the user.
   *
   * @param {Object} req - The request object containing user data in the body.
   * @param {string} req.body.name - The username of the user.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {string|null} [req.body.profile] - Optional profile picture URL.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the created user or an error message.
   */
  static async registerUser(req, res) {
    try {
      const { name, email, password, profile } = req.body;

      // Call the service to create the user
      const newUser = await UserService.createUser({
        user_name: name,
        user_email: email,
        user_password: password,
        profile_picture: profile,
      });

      res.status(201).json(newUser); // Created
    } catch (error) {
      // Handle specific errors and return appropriate status codes
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

  /**
   * Updates a user's details by their ID.
   *
   * @param {Object} req - The request object containing the user ID in params and update data in the body.
   * @param {string} req.params.id - The ID of the user to update.
   * @param {Object} req.body - The fields to update.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the updated user or an error message.
   */
  static async updateUserById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the user
      const updatedUser = await UserService.updateUserById(id, updateData);

      res.status(200).json(updatedUser); // OK
    } catch (error) {
      // Handle specific errors and return appropriate status codes
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the user.' });
      }
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @param {Object} _req - The request object (unused).
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the list of users or an error message.
   */
  static async getAllUsers(_req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users); // OK
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {Object} req - The request object containing the user ID in params.
   * @param {string} req.params.id - The ID of the user to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the user or an error message.
   */
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      // Call the service to fetch the user
      const user = await UserService.getUserById(id);

      res.status(200).json(user); // OK
    } catch (error) {
      // Handle specific errors and return appropriate status codes
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Retrieves a user by their username.
   *
   * @param {Object} req - The request object containing the username in params.
   * @param {string} req.params.name - The username of the user to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the user or an error message.
   */
  static async getUserByName(req, res) {
    try {
      const { name } = req.params;

      // Call the service to fetch the user
      const user = await UserService.getUserByName(name);

      res.status(200).json(user); // OK
    } catch (error) {
      console.error('Error in getUserByName controller:', error);

      // Handle specific errors and return appropriate status codes
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param {Object} req - The request object containing the email address in params.
   * @param {string} req.params.email - The email address of the user to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the user or an error message.
   */
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;

      // Call the service to fetch the user
      const user = await UserService.getUserByEmail(email);

      res.status(200).json(user); // OK
    } catch (error) {
      console.error('Error in getUserByEmail controller:', error);

      // Handle specific errors and return appropriate status codes
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Authenticates a user by their username and password.
   *
   * @param {Object} req - The request object containing the username and password in the body.
   * @param {string} req.body.name - The username of the user.
   * @param {string} req.body.password - The password to validate.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the authenticated user or an error message.
   */
  static async authenticate(req, res) {
    try {
      const { name, password } = req.body;

      // Call the service to authenticate the user
      const user = await UserService.authenticate(name, password);

      res.status(200).json(user); // OK
    } catch (error) {
      // Handle specific errors and return appropriate status codes
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

  /**
   * Deletes a user by their ID.
   *
   * @param {Object} req - The request object containing the user ID in params.
   * @param {string} req.params.id - The ID of the user to delete.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response indicating success or failure.
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Call the service to delete the user
      const isDeleted = await UserService.deleteUser(id);

      if (isDeleted) {
        res.status(204).end(); // No Content
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      // Handle specific errors and return appropriate status codes
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