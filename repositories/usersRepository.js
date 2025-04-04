const sequelize = require('../config/db-sequelize');
const { fn, col } = require('sequelize');
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
            console.error("Error creating user:", error);
            throw error;
        }
    }

    /**
    * Updates the user's name by their ID.
    * @static
    * @param {string} name - The new name to set for the user.
    * @param {number} id - The ID of the user to update.
    * @returns {Promise<[number, User[]]>} Result of the update operation.
    * @throws {Error} If there is an issue updating the user's name.
    */
    static async updateNameById(name, id) {
        try {
            await User.update({ user_name: name }, { where: { user_id: id } });
            const updatedUser = await User.findByPk(id);
            return updatedUser;
        } catch (error) {
            console.error("Error updating user's name:", error);
            throw error;
        }
    }

    /**
     * Updates the user's email by their ID.
     * @static
     * @param {string} email - The new email to set for the user.
     * @param {number} id - The ID of the user to update.
     * @returns {Promise<[number, User[]]>} Result of the update operation.
     * @throws {Error} If there is an issue updating the user's email.
     */
    static async updateEmailById(email, id) {
        try {
            await User.update({ user_email: email }, { where: { user_id: id } });
            const updatedUser = await User.findByPk(id);
            return updatedUser;
        } catch (error) {
            console.error("Error updating user's email:", error);
            throw error;
        }
    }

    /**
     * Updates the user's password by their ID.
     * @static
     * @param {string} password - The new password to set for the user.
     * @param {number} id - The ID of the user to update.
     * @returns {Promise<[number, User[]]>} Result of the update operation.
     * @throws {Error} If there is an issue updating the user's password.
     */
    static async updatePasswordById(password, id) {
        try {
            await User.update({ user_password: password },
                { where: { user_id: id }, individualHooks: true });
            const updatedUser = User.findByPk(id);
            return updatedUser;
        } catch (error) {
            console.error("Error updating user's password:", error);
            throw error;
        }
    }

    /**
     * Updates the user's profile by their ID.
     * @static
     * @param {string} profile - The new profile to set for the user.
     * @param {number} id - The ID of the user to update.
     * @returns {Promise<[number, User[]]>} Result of the update operation.
     * @throws {Error} If there is an issue updating the user's profile.
     */
    static async updateProfileById(profile, id) {
        try {
            await User.update({ profile_picture: profile }, { where: { user_id: id } });
            const updatedUser = User.findByPk(id);
            return updatedUser;
        } catch (error) {
            console.error("Error updating user's profile:", error);
            throw error;
        }
    }

    /**
     * Updates the user's email, password, and profile by their ID.
     * @static
     * @param {number} id - The ID of the user to update.
     * @param {Object} data - The user data to update.
     * @param {string} data.email - The new email to set for the user.
     * @param {string} data.password - The new password to set for the user.
     * @param {string} data.profile - The new profile to set for the user.
     * @returns {Promise<[number, User[]]>} Result of the update operation.
     * @throws {Error} If there is an issue updating the user's details.
     */
    static async updateUserById(id, { name, email, password, profile }) {
        try {
            await User.update(
                {
                    user_name: name,
                    user_email: email,
                    user_password: password,
                    profile_picture: profile // optional
                },
                { where: { user_id: id } }
            );
            const updatedUser = User.findByPk(id);
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
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
            console.error("Error fetching users:", error);
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
            console.error("Error fetching the user:", error);
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
            console.error("Error fetching the user:", error);
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
            console.error("Error fetching the user:", error);
            throw error;
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
            return await User.findAll({
                where: sequelize.where(
                    fn('DATE', col('account_created_date')), // Extract the date part from DATETIME
                    date  // Match it with the provided date
                )
            });

        } catch (error) {
            console.error("Error fetching the user(s) by creation date:", error);
            throw error;
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
                throw new Error('User with this name not found.');
            }

            if (!user.validPassword(password)) {
                throw new Error('Invalid password.');
            }

            return user; // Return the authenticated user
        } catch (error) {
            console.error("Error authenticating the user:", error);
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
            const deletedUser = await User.destroy({
                where: { user_id: id }
            });

            return deletedUser > 0; // Return true if a record was deleted
        } catch (error) {
            console.error("Error deleting the user:", error);
            throw error;
        }
    }
}

module.exports = UsersRepository;
