const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const User = require('../models/User');

/**
 * CoverLetter model represents a cover letter uploaded by a user.
 * This model defines the structure and constraints for storing cover letter data in the database.
 */
class CoverLetter extends Model {}

// Initialize the CoverLetter model with its schema and configurations
CoverLetter.init(
  {
    /**
     * `cover_letter_id` is the primary key for the cover_letters table.
     * It uniquely identifies each cover letter record.
     */
    cover_letter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Primary key
      autoIncrement: true, // Auto-increment value
      allowNull: false, // Cannot be null
    },

    /**
     * `cover_file_path` stores the file path (URL or local path) of the cover letter.
     * This field is required and cannot be null.
     */
    cover_file_path: {
      type: DataTypes.STRING,
      allowNull: false, // Cannot be null
    },

    /**
     * `cover_file_name` stores the name of the cover letter file.
     * This field is required and cannot be null.
     */
    cover_file_name: {
      type: DataTypes.STRING,
      allowNull: false, // Cannot be null
    },

    /**
     * `cover_upload_date` stores the date and time the cover letter was uploaded.
     * Defaults to the current timestamp when the record is created.
     */
    cover_upload_date: {
      type: DataTypes.DATE,
      allowNull: false, // Cannot be null
      defaultValue: Sequelize.NOW, // Default value is the current date and time
    },

    /**
     * `user_id` is a foreign key referencing the user who uploaded the cover letter.
     * Ensures referential integrity between cover letters and users.
     */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Cannot be null
      references: {
        model: User, // Name of the referenced table (User model)
        key: 'user_id', // Referenced column in the User model
      },
    },
  },
  {
    sequelize, // Sequelize instance to connect to the database
    modelName: 'CoverLetter', // Name of the model
    tableName: 'cover_letters', // Name of the database table
    timestamps: false, // Disable automatic createdAt and updatedAt fields
  }
);

module.exports = CoverLetter;