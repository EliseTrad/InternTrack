const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const User = require('../models/User');

/**
 * Resume model represents a resume uploaded by a user.
 * This model defines the structure and constraints for storing resume data in the database.
 */
class Resume extends Model {}

Resume.init(
  {
    /**
     * Primary key: Unique identifier for each resume.
     * Automatically increments with each new record.
     */
    resume_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Path to the uploaded resume file.
     * This field stores the URL or file path where the resume is stored.
     * Cannot be null.
     */
    resume_file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * Original name of the uploaded resume file.
     * This field stores the name of the file as provided by the user during upload.
     * Cannot be null.
     */
    resume_file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * Upload date of the resume.
     * Defaults to the current timestamp when the record is created.
     * Cannot be null.
     */
    resume_upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    /**
     * Foreign key linking to the user who uploaded the resume.
     * References the `user_id` column in the `users` table.
     * Ensures referential integrity between resumes and users.
     */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Name of the referenced table (User model)
        key: 'user_id', // Referenced column in the User model
      },
    },
  },
  {
    sequelize, // Sequelize instance to connect to the database
    modelName: 'Resume', // Name of the model
    tableName: 'resumes', // Name of the database table
    timestamps: false, // Disable automatic createdAt and updatedAt fields
  }
);

module.exports = Resume;