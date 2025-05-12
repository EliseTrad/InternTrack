const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const bcrypt = require('bcryptjs');

/**
 * User model to represent user data in the 'users' table.
 * This model defines the structure of the 'users' table, including fields, validations, and hooks.
 */
class User extends Model {
  /**
   * Validates a password by comparing it with the hashed password stored in the database.
   * @param {string} password - The plain-text password to validate.
   * @returns {boolean} - Returns true if the password matches, false otherwise.
   */
  validPassword(password) {
    return bcrypt.compareSync(password, this.user_password);
  }

  static hashPassword(plainPassword) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
  }
}

/**
 * Initialize the User model with its fields, validations, and hooks.
 */
User.init(
  {
    // User ID: Auto-incremented primary key
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Username: Unique, non-null field with a max length of 50
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    // Email: Unique, non-null field with email validation
    user_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensures the value is a valid email address
      },
    },
    // Password: Non-null field, length of 60 characters for hashed password
    user_password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    // Profile Picture: Optional field
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Account creation date: Automatically set to the current timestamp when a user is created
    account_created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Automatically sets the current timestamp
    },
  },
  {
    sequelize, // Sequelize instance
    modelName: 'User', // Name of the model
    tableName: 'users', // Specifies the table name in the database
    timestamps: false, // Disables automatic createdAt and updatedAt fields

    /**
     * Hooks
     */
    hooks: {
      /**
       * Hook to hash the password before creating a user.
       * Ensures the password is securely hashed before being stored in the database.
       * @param {User} user - The user instance being created.
       */
      beforeCreate: async (user) => {
        if (user.user_password) {
          // Ensure password exists before hashing
          // Hash the password with a salt round of 10
          user.user_password = await bcrypt.hash(user.user_password, 10);
        }
      },

      /**
       * Hook to hash the password before updating a user, if the password has changed.
       * Ensures the updated password is securely hashed before being stored in the database.
       * @param {User} user - The user instance being updated.
       */
      beforeUpdate: async (user) => {
        if (user.changed('user_password') && user.user_password) {
          // Check if the password field has been modified
          user.user_password = await bcrypt.hash(user.user_password, 10); // Hash the updated password
        }
      },
    },
  }
);

// Export the User model for use in other parts of the application
module.exports = User;