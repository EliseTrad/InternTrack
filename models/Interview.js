const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const Application = require('../models/Application');

/**
 * Represents an Interview in the database.
 * @class
 * @extends Model
 */
class Interview extends Model {}

/**
 * Initializes the Interview model with its attributes and options.
 */
Interview.init(
  {
    /**
     * The unique identifier for the interview.
     * @type {number}
     */
    interview_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /**
     * The date and time of the interview.
     * @type {Date}
     */
    interview_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    /**
     * The name of the interviewer.
     * @type {string}
     */
    interviewer_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensure the field is not an empty string
      },
    },

    /**
     * The email address of the interviewer.
     * @type {string}
     */
    interviewer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Validate that the value is a valid email address
        notEmpty: true,
      },
    },

    /**
     * The location of the interview.
     * @type {string}
     */
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    /**
     * Indicates whether a reminder has been sent for the interview.
     * @type {boolean}
     */
    reminder_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default to false if not provided
    },

    /**
     * The current status of the interview.
     * @type {'scheduled'|'completed'|'cancelled'|'no_show'}
     */
    interview_status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'),
      allowNull: false,
      defaultValue: 'scheduled', // Default to 'scheduled'
    },

    /**
     * The ID of the associated application.
     * @type {number}
     */
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Application, // References the Application model
        key: 'application_id',
      },
    },
  },
  {
    sequelize, // The Sequelize instance
    modelName: 'Interview', // The name of the model
    tableName: 'interviews', // The name of the database table
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);


module.exports = Interview;