const UsersRepository = require('../repositories/usersRepository');
const {
  NotFound,
  UserConflictError,
  EmailAlreadyExistsError,
  NameAlreadyExistsError,
  InvalidPassword,
} = require('../errors/customError');

class UserService {
  // create a new user
  static async createUser({
    user_name,
    user_email,
    user_password,
    profile_picture = null,
    account_created_date = new Date(),
  }) {
    try {
      const existingUserByEmail = await UsersRepository.getUserByEmail(
        user_email
      );
      if (existingUserByEmail) throw new EmailAlreadyExistsError();

      const existingUserByName = await UsersRepository.getUserByName(user_name);
      if (existingUserByName) throw new NameAlreadyExistsError();

      return await UsersRepository.createUser({
        user_name,
        user_email,
        user_password,
        profile_picture,
        account_created_date,
      });
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // update name by id
  static async updateNameById(name, id) {
    try {
      const existingUser = await UsersRepository.getUserById(id);
      if (!existingUser) throw new NotFound(`User with id ${id} is not found.`);

      const existingUserByName = await UsersRepository.getUserByName(name);
      if (existingUserByName) throw new NameAlreadyExistsError();

      const updatedUser = await UsersRepository.updateNameById(name, id);
      if (!updatedUser) throw new Error('Failed to update user.');

      return updatedUser;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // update email by id
  static async updateEmailById(email, id) {
    try {
      const existingUser = await UsersRepository.getUserById(id);
      if (!existingUser) throw new NotFound(`User with id ${id} is not found.`);

      const userWithEmail = await UsersRepository.getUserByEmail(email);
      if (userWithEmail && userWithEmail.id !== id)
        throw new EmailAlreadyExistsError();

      const updatedUser = await UsersRepository.updateEmailById(email, id);
      if (!updatedUser) throw new Error('Failed to update user email.');

      return updatedUser;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // update password by id
  static async updatePasswordById(password, id) {
    try {
      const existingUser = await UsersRepository.getUserById(id);
      if (!existingUser) throw new NotFound(`User with id ${id} is not found.`);

      const updatedUser = await UsersRepository.updatePasswordById(
        password,
        id
      );
      if (!updatedUser) throw new Error('Failed to update user.');

      return updatedUser;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // update profile by id
  static async updateProfileById(profile, id) {
    try {
      const existingUser = await UsersRepository.getUserById(id);
      if (!existingUser) throw new NotFound(`User with id ${id} is not found.`);

      const updatedUser = await UsersRepository.updateProfileById(profile, id);
      if (!updatedUser) throw new Error('Failed to update user.');

      return updatedUser;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // update user by id
  static async updateUserById(id, updateData) {
    // Check if the user exists
    const existingUser = await UsersRepository.getUserById(id);
    if (!existingUser) throw new NotFound(`User with ID ${id} not found.`);
    
    // Update the user
    return await UsersRepository.updateUserById(id, updateData);
  }
  catch(error) {
    console.error('Error in UsersService while updating user:', error);
    throw error;
  }

  // read all users
  static async getAllUsers() {
    try {
      return await UsersRepository.getAllUsers();
    } catch (error) {
      console.error('Error in usersService:', error);
      throw new Error('Unable to fetch users. Please try again later.');
    }
  }

  // read user by id
  static async getUserById(id) {
    try {
      const user = await UsersRepository.getUserById(id);

      if (!user) {
        throw new NotFound(`User with id ${id} is not found.`);
      }
      return user;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // read user by name
  static async getUserByName(name) {
    try {
      const user = await UsersRepository.getUserByName(name);

      if (!user) {
        throw new NotFound(`User with name ${name} is not found.`);
      }
      return user;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // read user by email
  static async getUserByEmail(email) {
    try {
      const user = await UsersRepository.getUserByEmail(email);

      if (!user) {
        throw new NotFound(`User with email ${email} is not found.`);
      }
      return user;
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // authenticate user
  static async authenticate(name, password) {
    try {
      // Fetch user from the repository
      const user = await UsersRepository.getUserByName(name);

      // If user is not found, throw an error
      if (!user) throw new NotFound(`User with name ${name} is not found.`);

      // Check if the password is correct using the validPassword method
      const isPasswordValid = await user.validPassword(password);

      // If password is invalid, throw an error
      if (!isPasswordValid) {
        throw new InvalidPassword();
      }

      return user; // Return the authenticated user
    } catch (error) {
      console.error('Error in usersService:', error);
      throw error;
    }
  }

  // delete user by id
  static async deleteUser(id) {
    try {
      const found = await UsersRepository.getUserById(id);

      // Check if the user exists
      if (!found) throw new NotFound(`User with id ${id} is not found.`);

      await UsersRepository.deleteUser(id);

      return true; // Indicate successful deletion
    } catch (error) {
      console.error('Error in service while deleting user:', error);

      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new UserConflictError();
      }

      throw error; // Propagate other errors to the controller
    }
  }
}

module.exports = UserService;
