const db = require('../config/db');
const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');

class UsersRepository {
    /**
     * Create a new user in the database.
     * Hashes the password and checks for existing users before inserting into the database.
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user account.
     * @param {string|null} profile_picture - Optional profile picture path.
     * @param {Date} account_created_date - The account creation date.
     * @returns {Promise<{affectedRows: number, insertId: number}>} Result of the insertion.
     */
    static async createUser(name, email, password, profile_picture = null, 
                            account_created_date = new Date()) {
        try {
            // Hash the password using the model's method
            const hashedPassword = await User.hashPassword(password);

            // Check if the user already exists
            const userExists = await this.userExists(name);
            if (userExists) {
                return { message: "User already exists" };
            }

            // SQL query to insert the user into the database
            let sql = `INSERT INTO users (user_name, user_email, user_password, 
                        profile_picture, account_created_date)
                        VALUES (?, ?, ?, ?, ?)`;

            // Execute the query
            const [result] = await db.query(sql, [name, email, hashedPassword, profile_picture, 
                                            account_created_date]);

            return { affectedRows: result.affectedRows, insertId: result.insertId };
        } catch (error) {
            console.error("Error creating user:", error.sql || error.message);
            throw new Error('Unable to create the user at the moment. Please try again later.');
        }
    }

    /**
     * Check if a user already exists by their name.
     * Used to prevent duplicate user creation.
     * @param {string} name - The name of the user.
     * @returns {Promise<boolean>} True if the user exists, false otherwise.
     */
    static async userExists(name) {
        try {
            const sql = `SELECT * FROM users WHERE user_name = ?`;
            const [rows] = await db.query(sql, [name]);

            return rows.length > 0;
        } catch (error) {
            console.error("Error checking if user exists:", error.sql);
            throw new Error('Unable to check if user exists at the moment. Please try again later.');
        }
    }

    /**
     * Updates a user's details by their ID.
     * Only updates the fields that are provided (e.g., name, email, password).
     * @param {number} id - The unique ID of the user to update.
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user (optional).
     * @param {string|null} profile_picture - The profile picture path (optional).
     * @returns {number} The number of affected rows in the database.
     */
    static async updateUser(id, name, email, password = null, profile_picture = null) {
        try {
            let updateFields = [];
            let queryParams = [];
    
            // Always add the user ID
            queryParams.push(id);
    
            // Check if each field is provided and add it to the update query
            if (name) {
                updateFields.push("user_name = ?");
                queryParams.push(name);
            }
    
            if (email) {
                updateFields.push("user_email = ?");
                queryParams.push(email);
            }
    
            if (password) {
                // Only hash and add the password if it's provided
                const hashedPassword = await User.hashPassword(password);
                updateFields.push("user_password = ?");
                queryParams.push(hashedPassword);
            }
    
            if (profile_picture) {
                updateFields.push("profile_picture = ?");
                queryParams.push(profile_picture);
            }
    
            if (updateFields.length === 0) {
                throw new Error('No valid fields to update.');
            }
    
            let sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    
            const [result] = await db.query(sql, queryParams);
    
            return result.affectedRows; // Return the number of rows updated    
        } catch (error) {
            console.error("Error updating user:", error.sql);
            throw new Error('Unable to update the user at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves all users from the database.
     * @static
     * @returns {Promise<User[]>} List of users mapped into User model instances.
     * @throws {Error} If there is an issue fetching users.
     */
    static async getAllUsers() {
        try {
            let sql = "SELECT * FROM USERS";
            const rows = await db.query(sql);
            return rows.map(User.fromRow);
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
            const [result] = await db.query(`SELECT * FROM users WHERE user_id = ?`, [id]);
            return result.map(User.fromRow)[0];
        } catch (error) {
            console.error("Error fetching the user:", error.sql);
            throw new Error(`Unable to display the user with id ${id}. Please try again later.`);
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
            const [result] = await db.query(`SELECT * FROM users WHERE user_name = ?`, [name]);
            return result.map(User.fromRow)[0];
        } catch (error) {
            console.error("Error fetching the user:", error.sql);
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
            const [result] = await db.query(`SELECT * FROM users WHERE user_email = ?`, [email]);
            return result.map(User.fromRow)[0]; // Return the first user found (or null if not found)
        } catch (error) {
            console.error("Error fetching the user:", error.sql);
            throw new Error(`Unable to display the user with email ${email}. Please try again later.`);
        }
    }

    /**
     * Retrieves all users created on a specific account creation date.
     * @param {Date|string} date - The account creation date to search for users ('YYYY-MM-DD HH:MM:SS').
     * @returns {Promise<User[]>} A list of users created on the given date.
     * @throws {Error} If there is an issue fetching users by the account creation date.
     */
    static async getUserByAccountCreationDate(date) {
        try {
            // Ensure that the date is in the correct format for MySQL if it's a Date object
            const formattedDate = date instanceof Date ? date.toISOString()
                .slice(0, 19).replace('T', ' ') : date;

            const rows = await db.query(`SELECT * FROM users WHERE account_created_date = ?`
                , [formattedDate]);
            return rows.map(User.fromRow); // Map rows to User model instances
        } catch (error) {
            console.error("Error fetching the user:", error.sql);
            throw new Error(`Unable to display the user(s) with account creation date ${date}. 
                Please try again later.`);
        }
    }

    /**
     * Authenticates a user by their username and password.
     * Compares the plaintext password with the stored hashed password.
     * @param {string} name - The username of the user.
     * @param {string} password - The plaintext password of the user.
     * @returns {Promise<User|null>} The authenticated user object if successful, or null if authentication fails.
     * @throws {Error} If there is an issue during authentication or password mismatch.
     */
    static async authenticate(name, password) {
        try {
            let sql = `SELECT * FROM users WHERE user_name = ?`;
            const [result] = await db.query(sql, [name]);

            // If no user found
            if (result.length === 0) {
                throw new Error(`User with name ${name} not found.`);
            }

            // Compare the hashed password with the stored password
            const user = result[0];
            const isMatch = await User.compare(password);

            if (!isMatch) {
                throw new Error('Invalid password.');
            }

            return user; // Return the authenticated user
        } catch (error) {
            console.error("Error authenticating the user:", error.sql);
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
            const result = await db.query(`DELETE FROM users WHERE user_id = ?`, [id]);

            if (result.affectedRows === 0) {
                return false; // No user found to delete
            }
            return true; // User successfully deleted
        } catch (error) {
            console.error("Error deleting the user:", error.sql);
            throw new Error(`Unable to delete the user with ID ${id}. Please try again later.`);
        }
    }
}

module.exports = UsersRepository;
