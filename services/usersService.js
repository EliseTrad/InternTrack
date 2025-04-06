const UsersRepository = require('../repositories/usersRepository');
const {
  NotFound,
  UserConflictError,
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  InvalidPassword,
} = require('../errors/customError');

/**
 * UserService class provides business logic for user-related operations.
 * Each method interacts with the UsersRepository to perform CRUD operations on users.
 */
class UserService {
  /**
   * Creates a new user in the database.
   * Validates that the email and username are unique before creating the user.
   *
   * @param {Object} userData - The user data to create.
   * @param {string} userData.user_name - The username of the user.
   * @param {string} userData.user_email - The email of the user.
   * @param {string} userData.user_password - The password of the user (will be hashed automatically).
   * @param {string|null} [userData.profile_picture] - Optional profile picture URL.
   * @param {Date} [userData.account_created_date] - Optional creation date (defaults to current date).
   * @returns {Promise<User>} The created user object.
   * @throws {EmailAlreadyExistsError} If the email is already in use.
   * @throws {NameAlreadyExistsError} If the username is already in use.
   */
  static async createUser({
    user_name,
    user_email,
    user_password,
    profile_picture = null,
    account_created_date = new Date(),
  }) {
    try {
      // Check if the email is already in use
      const existingUserByEmail = await UsersRepository.getUserByEmail(user_email);
      if (existingUserByEmail) throw new EmailAlreadyExistsError();

      // Check if the username is already in use
      const existingUserByName = await UsersRepository.getUserByName(user_name);
      if (existingUserByName) throw new NameAlreadyExistsError();

      // Create the user in the repository
      return await UsersRepository.createUser({
        user_name,
        user_email,
        user_password,
        profile_picture,
        account_created_date,
      });
    } catch (error) {
      console.error('Error in usersService while creating user:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Updates the details of a user by their ID.
   *
   * @param {number} id - The ID of the user to update.
   * @param {Object} updateData - The fields to update.
   * @returns {Promise<User>} The updated user object.
   * @throws {NotFound} If the user with the given ID is not found.
   */
  static async updateUserById(id, updateData) {
    try {
      // Check if the user exists
      const existingUser = await UsersRepository.getUserById(id);
      if (!existingUser) throw new NotFound(`User with ID ${id} not found.`);

      // Update the user in the repository
      return await UsersRepository.updateUserById(id, updateData);
    } catch (error) {
      console.error('Error in UsersService while updating user:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<User[]>} A list of all users.
   * @throws {Error} If there is an issue fetching users.
   */
  static async getAllUsers() {
    try {
      return await UsersRepository.getAllUsers();
    } catch (error) {
      console.error('Error in usersService while fetching all users:', error);
      throw new Error('Unable to fetch users. Please try again later.');
    }
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<User>} The user object if found.
   * @throws {NotFound} If the user with the given ID is not found.
   */
  static async getUserById(id) {
    try {
      const user = await UsersRepository.getUserById(id);
      if (!user) throw new NotFound(`User with ID ${id} not found.`);
      return user;
    } catch (error) {
      console.error('Error in usersService while fetching user by ID:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves a user by their username.
   *
   * @param {string} name - The username of the user to retrieve.
   * @returns {Promise<User>} The user object if found.
   * @throws {NotFound} If the user with the given username is not found.
   */
  static async getUserByName(name) {
    try {
      const user = await UsersRepository.getUserByName(name);
      if (!user) throw new NotFound(`User with name "${name}" not found.`);
      return user;
    } catch (error) {
      console.error('Error in usersService while fetching user by name:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<User>} The user object if found.
   * @throws {NotFound} If the user with the given email is not found.
   */
  static async getUserByEmail(email) {
    try {
      const user = await UsersRepository.getUserByEmail(email);
      if (!user) throw new NotFound(`User with email "${email}" not found.`);
      return user;
    } catch (error) {
      console.error('Error in usersService while fetching user by email:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Authenticates a user by their username and password.
   *
   * @param {string} name - The username of the user.
   * @param {string} password - The password to validate.
   * @returns {Promise<User>} The authenticated user object if successful.
   * @throws {NotFound} If the user with the given username is not found.
   * @throws {InvalidPassword} If the provided password is incorrect.
   */
  static async authenticate(name, password) {
    try {
      // Fetch the user by username
      const user = await UsersRepository.getUserByName(name);
      if (!user) throw new NotFound(`User with name "${name}" not found.`);

      // Validate the password
      const isPasswordValid = await user.validPassword(password);
      if (!isPasswordValid) throw new InvalidPassword();

      return user; // Return the authenticated user
    } catch (error) {
      console.error('Error in usersService while authenticating user:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<boolean>} True if the user was successfully deleted.
   * @throws {NotFound} If the user with the given ID is not found.
   * @throws {UserConflictError} If the user is referenced in other records.
   */
  static async deleteUser(id) {
    try {
      // Check if the user exists
      const found = await UsersRepository.getUserById(id);
      if (!found) throw new NotFound(`User with ID ${id} not found.`);

      // Delete the user from the repository
      await UsersRepository.deleteUser(id);

      return true; // Indicate successful deletion
    } catch (error) {
      console.error('Error in usersService while deleting user:', error);

      // Handle foreign key constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new UserConflictError();
      }

      throw error; // Propagate other errors to the controller
    }
  }
}

module.exports = UserService;