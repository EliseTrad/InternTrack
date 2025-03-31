const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
            console.error("Error creating user:", error);
            throw new Error('Unable to create the user at the moment. Please try again later.');
        }
    }

    /**
     * Updates a user's details by their ID.
     * Only updates the fields that are provided (e.g., name, email, password).
     * @param {number} id - The unique ID of the user to update.
     * @param {Object} user - The user object containing the fields to update.
     * @param {string} user.name - The name of the user.
     * @param {string} user.email - The email of the user.
     * @param {string} user.password - The password of the user (optional).
     * @param {string|null} user.profile_picture - The profile picture path (optional).
     * @returns {number} The number of affected rows in the database.
     */
    static async updateUser(id, updatedFields) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error("User not found");

            await user.update(updatedFields);
            return user;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error('Unable to update the user at the moment. Please try again later.');
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
            console.error("Error fetching users:", error);
            throw new Error('Unable to display the users at the moment. Please try again later.');
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
            console.error("Error fetching the user:", error);
            throw new Error(`Unable to display the user with ID ${id}. Please try again later.`);
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
            console.error("Error fetching the user:", error);
            throw new Error(`Unable to display the user with name ${name}. Please try again later.`);
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
            console.error("Error fetching the user:", error);
            throw new Error(`Unable to display the user with email ${email}. Please try again later.`);
        }
    }

    /**
    * Retrieves all users created on a specific date.
    * @param {string} date - The account creation date to search for users ('YYYY-MM-DD').
    * @returns {Promise<User[]>} A list of users created on the given date.
    * @throws {Error} If there is an issue fetching users by the account creation date.
    */
    static async getUsersByAccountCreationDate(date) {
        try {
            return await User.findAll({ where: { account_created_date: date } });
        } catch (error) {
            console.error("Error fetching the user(s) by creation date:", error);
            throw new Error(`Unable to display the user(s) with account creation date ${date}. 
                Please try again later.`);
        }
    }


    /**
     * Authenticates a user by their username and password.
     * Compares the plaintext password with the stored hashed password.
     * @param {string} name - The username of the user.
     * @param {string} password - The plaintext password of the user.
     * @returns {Promise<User|null>} The authenticated user object if successful, or null 
     * if authentication fails.
     * @throws {Error} If there is an issue during authentication or password mismatch.
     */
    static async authenticate(name, password) {
        try {
            const user = await User.findOne({ where: { user_name: name } });
            if (!user) {
                throw new Error(`User with name ${name} not found.`);
            }

            const isMatch = await bcrypt.compare(password, user.user_password);
            if (!isMatch) {
                throw new Error('Invalid password.');
            }

            return user; // Return the authenticated user
        } catch (error) {
            console.error("Error authenticating the user:", error);
            throw new Error(`Unable to authenticate the user with name ${name}. Please try again later.`);
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
            const deletedUser = await User.destroy({
                where: { user_id: id }
            });

            return deletedUser > 0; // Return true if a record was deleted
        } catch (error) {
            console.error("Error deleting the user:", error);
            throw new Error(`Unable to delete the user with ID ${id}. Please try again later.`);
        }
    }
}

module.exports = UsersRepository;
