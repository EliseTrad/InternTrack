const UsersRepository = require('../repositories/usersRepository');

class UserService {
    // create a new user
    static async createUser({ name, email, password, profile_picture = null, 
                                account_created_date = new Date() }) {
        try {
            // passing an object to the repository method
            return await UsersRepository.createUser({ name, email, password, profile_picture, 
                                                    account_created_date });
        } catch (error) {
            throw new Error('Unable to create user. Please try again later.');
        }
    }

    // update user by id
    static async updateUser(id, { name, email, password = null, profile_picture = null }) {
        try {
            return await UsersRepository.updateUser(id, { name, email, password, profile_picture });
        } catch (error) {
            throw new Error('Unable to update user details. Please try again later.');
        }
    }

    // read all users
    static async getAllUsers() {
        try {
            return await UsersRepository.getAllUsers();
        } catch (error) {
            throw new Error('Unable to fetch users. Please try again later.');
        }
    }

    // read user by id
    static async getUserById(id) {
        try {
            return await UsersRepository.getUserById(id);
        } catch (error) {
            throw new Error('Unable to fetch user. Please try again later.');
        }
    }

    // read user by name
    static async getUserByName(name) {
        try {
            return await UsersRepository.getUserByName(name);
        } catch (error) {
            throw new Error('Unable to fetch user by name. Please try again later.');
        }
    }

    // read user by email
    static async getUserByEmail(email) {
        try {
            return await UsersRepository.getUserByEmail(email);
        } catch (error) {
            throw new Error('Unable to fetch user by email. Please try again later.');
        }
    }

    // read users by account creation date
    static async getUserByAccountCreationDate(date) {
        try {
            return await UsersRepository.getUsersByAccountCreationDate(date);
        } catch (error) {
            throw new Error('Unable to fetch users by account creation date. Please try again later.');
        }
    }

    // authenticate user
    static async authenticate(name, password) {
        try {
            return await UsersRepository.authenticate(name, password);
        } catch (error) {
            throw new Error('Unable to authenticate user. Please try again later.');
        }
    }

    // delete user by id
    static async deleteUser(id) {
        try {
            return await UsersRepository.deleteUser(id);
        } catch (error) {
            throw new Error('Unable to delete user. Please try again later.');
        }
    }

    // register new user 
    static async registerUser({ name, email, password, profile_picture = null }) {
        try {
            return await UsersRepository.createUser({ name, email, password, profile_picture });
        } catch (error) {
            throw new Error('Unable to register user. Please try again later.');
        }
    }
}

module.exports = UserService;
