const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const User = require('../models/User');
const CoverLetter = require('../models/CoverLetter');
const Resume = require('../models/Resume');

/**
 * Application model represents an internship or job application submitted by a user.
 * This model defines the structure and constraints for storing application data in the database.
 */
class Application extends Model {}

// Initialize the Application model with its schema and configurations
Application.init(
  {
    /**
     * `application_id` is the primary key for the applications table.
     * It uniquely identifies each application record.
     */
    application_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Auto-increment value
      primaryKey: true, // Primary key
      allowNull: false, // Cannot be null
    },

    /**
     * `company_name` stores the name of the company to which the application was submitted.
     * This field is required and cannot be null.
     */
    company_name: {
      type: DataTypes.STRING,
      allowNull: false, // Cannot be null
    },

    /**
     * `position_title` stores the title of the position applied for.
     * This field is required and cannot be null.
     */
    position_title: {
      type: DataTypes.STRING,
      allowNull: false, // Cannot be null
    },

    /**
     * `application_date` stores the date the application was submitted.
     * Defaults to the current date when the record is created.
     */
    application_date: {
      type: DataTypes.DATEONLY, // Stores only the date (no time)
      allowNull: false, // Cannot be null
      defaultValue: Sequelize.NOW, // Default value is the current date
    },

    /**
     * `status` stores the current status of the application.
     * Must be one of the predefined values: 'waitlist', 'rejected', 'not_answered', or 'accepted'.
     */
    status: {
      type: DataTypes.ENUM('waitlist', 'rejected', 'not_answered', 'accepted'),
      allowNull: false, // Cannot be null
    },

    /**
     * `deadline` stores the optional deadline for the application.
     * This field can be null if no deadline is specified.
     */
    deadline: {
      type: DataTypes.DATEONLY, // Stores only the date (no time)
      allowNull: true, // Can be null
    },

    /**
     * `notes` stores additional notes about the application.
     * This field is optional and can contain longer text.
     */
    notes: {
      type: DataTypes.TEXT,
      allowNull: true, // Can be null
    },

    /**
     * `application_source` stores the source of the application (e.g., LinkedIn, Referral).
     * This field is required and cannot be null.
     */
    application_source: {
      type: DataTypes.STRING,
      allowNull: false, // Cannot be null
    },

    /**
     * `user_id` is a foreign key referencing the user who submitted the application.
     * Ensures referential integrity between applications and users.
     */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Cannot be null
      references: {
        model: User, // Name of the referenced table (User model)
        key: 'user_id', // Referenced column in the User model
      },
    },

    /**
     * `resume_id` is a foreign key referencing the resume used in the application.
     * Ensures referential integrity between applications and resumes.
     */
    resume_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Cannot be null
      references: {
        model: Resume, // Name of the referenced table (Resume model)
        key: 'resume_id', // Referenced column in the Resume model
      },
    },

    /**
     * `cover_letter_id` is a foreign key referencing the cover letter used in the application.
     * This field is optional and can be null if no cover letter is used.
     */
    cover_letter_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null
      references: {
        model: CoverLetter, // Name of the referenced table (CoverLetter model)
        key: 'cover_letter_id', // Referenced column in the CoverLetter model
      },
    },
  },
  {
    sequelize, // Sequelize instance to connect to the database
    modelName: 'Application', // Name of the model
    tableName: 'applications', // Name of the database table
    timestamps: false, // Disable automatic createdAt and updatedAt fields
  }
);

module.exports = Application;