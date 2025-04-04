const UsersRepository = require('../repositories/usersRepository');

class UserService {

    /**
     * Create a new user
     * @param {Object} userDetails - Details of the user to create
     * @param {string} userDetails.user_name - The user's username
     * @param {string} userDetails.user_email - The user's email
     * @param {string} userDetails.user_password - The user's password
     * @param {string} [userDetails.profile_picture=null] - The user's profile picture (optional)
     * @param {Date} [userDetails.account_created_date=new Date()] - The account creation date (optional)
     * @returns {Promise<Object>} The created user
     */
    static async createUser({ user_name, user_email, user_password, profile_picture = null,
        account_created_date = new Date() }) {
        try {
            const existingUserByEmail = await UsersRepository.getUserByEmail(user_email);
            if (existingUserByEmail)
                throw new Error('Email already exists.');

            const existingUserByName = await UsersRepository.getUserByName(user_name);
            if (existingUserByName)
                throw new Error('Username already exists.');

            return await UsersRepository.createUser({
                user_name, user_email, user_password, profile_picture, account_created_date
            });
        } catch (error) {
            console.error('Unable to create user. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Update the name of a user by their ID
     * @param {string} name - The new name of the user
     * @param {number} id - The ID of the user to update
     * @returns {Promise<Object>} The updated user
     */
    static async updateNameById(name, id) {
        try {
            if (!id)
                throw new Error('User ID is required.');

            const existingUser = await UsersRepository.getUserById(id);
            if (!existingUser)
                throw new Error('User not found.');

            const updatedUser = await UsersRepository.updateNameById(name, id);
            if (!updatedUser)
                throw new Error('Failed to update user.');

            return updatedUser;
        } catch (error) {
            console.error('Unable to update user name. Please try again later.');
            throw error;
        }
    }

    /**
     * Update the email of a user by their ID
     * @param {string} email - The new email of the user
     * @param {number} id - The ID of the user to update
     * @returns {Promise<Object>} The updated user
     */
    static async updateEmailById(email, id) {
        try {
            if (!id)
                throw new Error('User ID is required.');

            const existingUser = await UsersRepository.getUserById(id);
            if (!existingUser)
                throw new Error('User not found.');

            const userWithEmail = await UsersRepository.getUserByEmail(email);
            if (userWithEmail && userWithEmail.id !== id)
                throw new Error('Email already in use by another user.');

            const updatedUser = await UsersRepository.updateEmailById(email, id);
            if (!updatedUser)
                throw new Error('Failed to update user email.');

            return updatedUser;
        } catch (error) {
            console.error('Unable to update user email. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Update the password of a user by their ID
     * @param {string} password - The new password for the user
     * @param {number} id - The ID of the user to update
     * @returns {Promise<Object>} The updated user
     */
    static async updatePasswordById(password, id) {
        try {
            if (!id)
                throw new Error('User ID is required.');

            const existingUser = await UsersRepository.getUserById(id);
            if (!existingUser)
                throw new Error('User not found.');

            const updatedUser = await UsersRepository.updatePasswordById(password, id);
            if (!updatedUser)
                throw new Error('Failed to update user.');

            return updatedUser;
        } catch (error) {
            console.error('Unable to update user password. Please try again later.');
            throw error;
        }
    }

    /**
     * Update the profile of a user by their ID
     * @param {Object} profile - The new profile data for the user
     * @param {number} id - The ID of the user to update
     * @returns {Promise<Object>} The updated user
     */
    static async updateProfileById(profile, id) {
        try {
            if (!id)
                throw new Error('User ID is required.');

            const existingUser = await UsersRepository.getUserById(id);
            if (!existingUser)
                throw new Error('User not found.');

            const updatedUser = await UsersRepository.updateProfileById(profile, id);
            if (!updatedUser)
                throw new Error('Failed to update user.');

            return updatedUser;
        } catch (error) {
            console.error('Unable to update user profile. Please try again later.');
            throw error;
        }
    }

    /**
     * Update the user by their ID
     * @param {number} id - The ID of the user to update
     * @param {Object} userDetails - The details to update (name, email, password, profile)
     * @returns {Promise<Object>} The updated user
     */
    static async updateUserById(id, { name, email, password, profile }) {
        try {
            if (!id)
                throw new Error('User ID is required.');

            const existingUser = await UsersRepository.getUserById(id);
            if (!existingUser)
                throw new Error('User not found.');

            const updatedUser = await UsersRepository.updateUserById
                (id, { name, email, password, profile });
            if (!updatedUser)
                throw new Error('Failed to update user.');

            return updatedUser;
        } catch (error) {
            console.error('Unable to update user. Please try again later.');
            throw error;
        }
    }

    /**
     * Get all users
     * @returns {Promise<Array>} List of all users
     */
    static async getAllUsers() {
        try {
            return await UsersRepository.getAllUsers();
        } catch (error) {
            console.error('Unable to fetch users. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Get a user by their ID
     * @param {number} id - The ID of the user to retrieve
     * @returns {Promise<Object>} The user data
     */
    static async getUserById(id) {
        try {
            return await UsersRepository.getUserById(id);
        } catch (error) {
            console.error('Unable to fetch user. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Get a user by their name
     * @param {string} name - The name of the user to retrieve
     * @returns {Promise<Object>} The user data
     */
    static async getUserByName(name) {
        try {
            return await UsersRepository.getUserByName(name);
        } catch (error) {
            console.error('Unable to fetch user by name. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Get a user by their email
     * @param {string} email - The email of the user to retrieve
     * @returns {Promise<Object>} The user data
     */
    static async getUserByEmail(email) {
        try {
            return await UsersRepository.getUserByEmail(email);
        } catch (error) {
            console.error('Unable to fetch user by email. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Get users by account creation date
     * @param {Date} date - The date to filter users by
     * @returns {Promise<Array>} List of users created on the given date
     */
    static async getUserByAccountCreationDate(date) {
        try {
            return await UsersRepository.getUsersByAccountCreationDate(date);
        } catch (error) {
            console.error('Unable to fetch users by account creation date. Please try again later.',
                error.message);
            throw error;
        }
    }

    /**
     * Authenticate a user by their name and password
     * @param {string} name - The user's name
     * @param {string} password - The user's password
     * @returns {Promise<Object>} The authenticated user
     */
    static async authenticate(name, password) {
        try {
            const user = await UsersRepository.getUserByName(name);
            if (!user) throw new Error('User not found.');

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) throw new Error('Incorrect password.');

            return user;
        } catch (error) {
            console.error('Unable to authenticate user. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Delete a user by their ID
     * @param {number} id - The ID of the user to delete
     * @returns {Promise<boolean>} Whether the user was successfully deleted
     */
    static async deleteUser(id) {
        try {
            if (!id) throw new Error('User ID is required.');

            const existingUser = await UsersRepository.getUserById(id);
            if (!existingUser) throw new Error('User not found.');

            return await UsersRepository.deleteUser(id);
        } catch (error) {
            console.error('Unable to delete user. Please try again later.', error.message);
            throw error;
        }
    }

    /**
     * Register a new user
     * @param {Object} userDetails - Details of the user to register
     * @param {string} userDetails.user_name - The user's username
     * @param {string} userDetails.user_email - The user's email
     * @param {string} userDetails.user_password - The user's password
     * @param {string} [userDetails.profile_picture=null] - The user's profile picture (optional)
     * @returns {Promise<Object>} The created user
     */
    static async registerUser({ user_name, user_email, user_password, profile_picture = null }) {
        try {
            return await UsersRepository.createUser({
                user_name, user_email, user_password, profile_picture
            });
        } catch (error) {
            console.error('Unable to register user. Please try again later.');
            throw error;
        }
    }
}

module.exports = UserService;
