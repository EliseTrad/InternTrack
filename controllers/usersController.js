const UserService = require('../services/usersService');

class UserController {

    // Register a new user
    static async registerUser(req, res) {
        try {
            const { user_name, 
                user_email, 
                user_password, 
                account_created_date, 
                profile_picture } = req.body;

            // Call service to register the user
            const result = await UserService.registerUser({
                user_name, user_email, user_password, account_created_date, profile_picture
            });

            // Respond with success status
            res.status(201).json({ message: 'User registered successfully', result });
        } catch (error) {
            // Handle errors
            res.status(500).json({ message: error.message });
        }
    }

    // Retrieve all users
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Retrieve user by ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            
            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Retrieve user by name
    static async getUserByName(req, res) {
        try {
            const { name } = req.params;
            const user = await UserService.getUserByName(name);

            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Retrieve user by email
    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await UserService.getUserByEmail(email);

            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Retrieve users by account creation date
    static async getUserByAccountCreationDate(req, res) {
        try {
            const { date } = req.params;
            const users = await UserService.getUserByAccountCreationDate(date);

            // Check if users are found
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found for this date' });
            }

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Authenticate a user
    static async authenticate(req, res) {
        try {
            const { user_name, user_password } = req.body;

            // Attempt to authenticate user
            const user = await UserService.authenticate(user_name, user_password);

            // If user is not found or credentials are wrong, return 401
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update user name by ID
    static async updateNameById(req, res) {
        try {
            const { id } = req.params;
            const { user_name } = req.body;

            const user = await UserService.updateNameById(user_name, id);

            // If user not found, return 404
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update user email by ID
    static async updateEmailById(req, res) {
        try {
            const { id } = req.params;
            const { user_email } = req.body;

            const user = await UserService.updateEmailById(user_email, id);

            // If user not found, return 404
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update user password by ID
    static async updatePasswordById(req, res) {
        try {
            const { id } = req.params;
            const { user_password } = req.body;

            const user = await UserService.updatePasswordById(user_password, id);

            // If user not found, return 404
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update user profile picture by ID
    static async updateProfileById(req, res) {
        try {
            const { id } = req.params;
            const { profile_picture } = req.body;

            const user = await UserService.updateProfileById(profile_picture, id);

            // If user not found, return 404
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update all user details by ID
    static async updateUserById(req, res) {
        try {
            const { id } = req.params;
            const { user_name, user_email, user_password, profile_picture } = req.body;

            const user = await UserService.updateUserById(id, { user_name, user_email, user_password, profile_picture });

            // If user not found, return 404
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete a user by ID
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await UserService.deleteUser(id);

            // If user not found, return 404
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(204).send();  // 204 for successful deletion with no content
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;
