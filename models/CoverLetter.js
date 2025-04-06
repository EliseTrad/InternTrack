const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const User = require('../models/User');

class CoverLetter extends Model {}

// Initialize the CoverLetter model with its schema and configurations
CoverLetter.init(
  {
    // `cover_letter_id` is the primary key for the cover_letters table
    cover_letter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Primary key
      autoIncrement: true, // Auto-increment value
      allowNull: false,
    },

    // `cover_file_path` stores the file path of the cover letter
    cover_file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // `cover_file_name` stores the name of the cover letter file
    cover_file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // `cover_upload_date` stores the date the cover letter was uploaded
    cover_upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Default value is the current date and time
    },

    // `user_id` is a foreign key referencing the user who uploaded the cover letter
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'CoverLetter',
    tableName: 'cover_letters',
    timestamps: false,
  }
);

module.exports = CoverLetter;
