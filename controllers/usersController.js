const UserService = require('../services/usersService');

class UserController {

    static async createUser(req, res) {
        try {
            const { name, email, password, account_created_date, profile_picture } = req.body;
            const result = await UserService.createUserrUser(name, email, password, account_created_date,
                profile_picture);
            res.status(201).json({ message: 'User created successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async userExists(req, res) {
        try {
          const { name } = req.params;
          const userExists = await UserService.userExists(name);
    
          if (userExists) {
            return res.status(200).json({ message: 'User exists' });
          } else {
            return res.status(404).json({ message: 'User does not exist' });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    }

    static async registerUser(req, res) {
        try {
            const { name, email, password, account_created_date,
                profile_picture } = req.body;
            const result = await UserService.registerUser(name, email, password, account_created_date,
                profile_picture);
            res.status(201).json({ message: 'User registered successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password, profile_picture } = req.body;
            const result = await UserService.updateUser(id, name, email, password, profile_picture);
            res.status(200).json({ message: 'User updated successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserByName(req, res) {
        try {
            const { name } = req.params;
            const user = await UserService.getUserByName(name);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params;
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserByAccountCreationDate(req, res) {
        try {
            const { date } = req.params;
            const users = await UserService.getUserByAccountCreationDate(date);
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async authenticate(req, res) {
        try {
            const { name, password } = req.body;
            const user = await UserService.authenticate(name, password);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await UserService.deleteUser(id);
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserController;
