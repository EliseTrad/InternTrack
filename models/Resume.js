const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const User = require('../models/User');

// Define the Resume model
class Resume extends Model {}

Resume.init(
  {
    // Primary key: unique identifier for each resume
    resume_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Path to the uploaded resume file
    resume_file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Original name of the uploaded resume file
    resume_file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Upload date of the resume, defaults to current timestamp
    resume_upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    // Foreign key linking to the user who uploaded the resume
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Name of the referenced table
        key: 'user_id', // Referenced column
      },
    },
  },
  {
    sequelize,
    modelName: 'Resume',
    tableName: 'resumes',
    timestamps: false,
  }
);

module.exports = Resume;
