const sequelize = require('../config/db-sequelize');
const User = require('../models/User');

/**
 * UsersRepository class provides methods to interact with the 'users' table in the database.
 * Each method handles a specific operation related to user data (create, read, update, delete).
 */
class UsersRepository {
  /**
   * Create a new user in the database.
   * Hashes the password and checks for existing users before inserting into the database.
   *
   * @param {Object} user - The user object containing user details.
   * @param {string} user.name - The name of the user.
   * @param {string} user.email - The email of the user.
   * @param {string} user.password - The password of the user account (will be hashed automatically).
   * @param {string|null} user.profile_picture - Optional profile picture path.
   * @returns {Promise<User>} The created user object.
   * @throws {Error} If there is an issue creating the user (e.g., duplicate email or invalid data).
   */
  static async createUser(user) {
    try {
      return await User.create(user); // Automatically hashes the password via Sequelize hooks
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Updates a user's details by their ID.
   * Only updates the fields that are provided in the `updateData` object.
   *
   * @param {number} id - The unique ID of the user to update.
   * @param {Object} updateData - The user data to update.
   * @param {string} [updateData.email] - The new email to set for the user (optional).
   * @param {string} [updateData.password] - The new password to set for the user (optional).
   * @param {string} [updateData.profile_picture] - The new profile picture path for the user (optional).
   * @returns {Promise<User|null>} The updated user object if successful, or null if no rows were updated.
   * @throws {Error} If there is an issue updating the user's details.
   */
  static async updateUserById(id, updateData) {
    try {
      const [updatedRowsCount] = await User.update(updateData, {
        where: { user_id: id },
      });

      if (updatedRowsCount === 0) return null; // No rows were updated

      const updatedUser = await User.findByPk(id); // Fetch the updated user
      return updatedUser;
    } catch (error) {
      console.error('Error in UsersRepository while updating user:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<User[]>} A list of all users in the database.
   * @throws {Error} If there is an issue fetching users.
   */
  static async getAllUsers() {
    try {
      return await User.findAll(); // Fetch all users
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves a user by their unique ID.
   *
   * @param {number} id - The unique ID of the user.
   * @returns {Promise<User|null>} The user object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the user.
   */
  static async getUserById(id) {
    try {
      return await User.findByPk(id); // Find user by primary key
    } catch (error) {
      console.error('Error fetching the user by ID:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves a user by their username.
   *
   * @param {string} name - The username of the user.
   * @returns {Promise<User|null>} The user object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the user.
   */
  static async getUserByName(name) {
    try {
      return await User.findOne({ where: { user_name: name } }); // Find user by username
    } catch (error) {
      console.error('Error fetching the user by username:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param {string} email - The email address of the user.
   * @returns {Promise<User|null>} The user object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the user.
   */
  static async getUserByEmail(email) {
    try {
      return await User.findOne({ where: { user_email: email } }); // Find user by email
    } catch (error) {
      console.error('Error fetching the user by email:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Deletes a user by their unique ID.
   *
   * @param {number} id - The unique ID of the user to delete.
   * @returns {Promise<boolean>} True if the user was deleted, false if not found.
   * @throws {Error} If a database error occurs or the user is not found.
   */
  static async deleteUser(id) {
    try {
      const deletedCount = await User.destroy({ where: { user_id: id } });
      return deletedCount > 0; // Return true if at least one row was deleted
    } catch (error) {
      console.error('Error in repository while deleting user:', error);
      throw error; // Propagate the error to the service layer
    }
  }
}

module.exports = UsersRepository;