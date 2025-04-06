const sequelize = require('../config/db-sequelize');
const User = require('../models/User');

class UsersRepository {
  /**
   * Create a new user in the database.
   * Hashes the password and checks for existing users before inserting into the database.
   * @param {Object} user - The user object.
   * @param {string} user.name - The name of the user.
   * @param {string} user.email - The email of the user.
   * @param {string} user.password - The password of the user account.
   * @param {string|null} user.profile_picture - Optional profile picture path.
   * @returns {Promise<User>} The created user object.
   */
  static async createUser(user) {
    try {
      return await User.create(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Updates the user by their ID.
   * @static
   * @param {number} id - The ID of the user to update.
   * @param {Object} data - The user data to update.
   * @param {string} data.email - The new email to set for the user.
   * @param {string} data.password - The new password to set for the user.
   * @param {string} data.profile - The new profile to set for the user.
   * @returns {Promise<[number, User[]]>} Result of the update operation.
   * @throws {Error} If there is an issue updating the user's details.
   */
  static async updateUserById(id, updateData) {
    try {
      const [updatedRowsCount] = await User.update(updateData, {
        where: { user_id: id },
      });

      if (updatedRowsCount === 0) return null;

      const updatedUser = await User.findByPk(id);
      return updatedUser;
    } catch (error) {
      console.error('Error in UsersRepository while updating:', error);
      throw error;
    }
  }

  /**
   * Retrieves all users from the database.
   * @static
   * @returns {Promise<User[]>} List of users.
   * @throws {Error} If there is an issue fetching users.
   */
  static async getAllUsers() {
    try {
      return await User.findAll();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Retrieves a user by their unique ID.
   * @param {number} id - The unique ID of the user.
   * @returns {Promise<User|null>} The user object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the user.
   */
  static async getUserById(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      console.error('Error fetching the user:', error);
      throw error;
    }
  }

  /**
   * Retrieves a user by their username.
   * @param {string} name - The username of the user.
   * @returns {Promise<User|null>} The user object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the user.
   */
  static async getUserByName(name) {
    try {
      return await User.findOne({ where: { user_name: name } });
    } catch (error) {
      console.error('Error fetching the user:', error);
      throw error;
    }
  }

  /**
   * Retrieves a user by their email address.
   * @param {string} email - The email address of the user.
   * @returns {Promise<User|null>} The user object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the user.
   */
  static async getUserByEmail(email) {
    try {
      return await User.findOne({ where: { user_email: email } });
    } catch (error) {
      console.error('Error fetching the user:', error);
      throw error;
    }
  }

  /**
   * Deletes a user by their unique ID.
   * @param {number} id - The unique ID of the user.
   * @returns {Promise<boolean>} True if the user was deleted, false if not found.
   * @throws {Error} If a database error occurs or user not found.
   */
  static async deleteUser(id) {
    try {
      const deletedCount = await User.destroy({ where: { user_id: id } });
      return deletedCount > 0; // Return true if a record was deleted
    } catch (error) {
      console.error('Error in repository while deleting user:', error);
      throw error; // Let the service handle the error
    }
  }
}

module.exports = UsersRepository;
