const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const bcrypt = require('bcryptjs');

// User model to represent user data in the 'users' table
class User extends Model {
  // Method to validate passwords
  // Compares the given password with the hashed password in the database
  validPassword(password) {
    return bcrypt.compareSync(password, this.user_password);
  }
}

// Initialize the User model with its fields, validations, and hooks
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
        isEmail: true, // Ensures value is a valid email
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
    // Account creation date: Automatically set to current timestamp when a user is created
    account_created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Specifies the table name
    timestamps: false, // Disables automatic timestamps

    hooks: {
      // Hook to hash password before creating a user
      beforeCreate: async (user) => {
        if (user.user_password) {
          // Ensure password exists before hashing
          user.user_password = await bcrypt.hash(user.user_password, 10);
        }
      },
      // Hook to hash password before updating a user, if password has changed
      beforeUpdate: async (user) => {
        if (user.changed('user_password') && user.user_password) {
          user.user_password = await bcrypt.hash(user.user_password, 10);
        }
      },
    },
  }
);

module.exports = User;
