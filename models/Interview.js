const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const Application = require('../models/Application');

class Interview extends Model {}

Interview.init(
  {
    interview_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    interview_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    interviewer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    interviewer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    reminder_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    interview_status: {
      type: DataTypes.ENUM(['scheduled', 'completed', 'cancelled', 'no_show']),
      allowNull: false,
    },

    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Application,
        key: 'application_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Interview',
    tableName: 'interviews',
    timestamps: false,
  }
);

module.exports = Interview;
