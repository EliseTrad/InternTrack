const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const User = require('../models/User');
const CoverLetter = require('../models/CoverLetter');
const Resume = require('../models/Resume');

class Application extends Model {}

Application.init(
  {
    application_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    position_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    application_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    status: {
      type: DataTypes.ENUM([
        'waitlist',
        'rejected',
        'not_answered',
        'accepted',
      ]),
      allowNull: false,
    },

    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    application_source: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },

    resume_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Resume,
        key: 'resume_id',
      },
    },

    cover_letter_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CoverLetter,
        key: 'cover_letter_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: false,
  }
);

module.exports = Application;
