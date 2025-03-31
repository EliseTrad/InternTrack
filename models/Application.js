const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const moment = require('moment');

class Application extends Model { }

Application.init(
  {
    application_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    position_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    application_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Set the current date
      get() {
        return moment(this.getDataValue('application_date')).format('YYYY-MM-DD');
      }
    },

    status: {
      type: DataTypes.ENUM(['waitlist', 'rejected', 'not answered', 'accepted']),
      allowNull: false,
    },

    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    application_source: {
      type: DataTypes.STRING,
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },

    resume_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'resumes',
        key: 'resume_id'
      }
    },

    cover_letter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cover_letters',
        key: 'cover_letter_id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: false,
  }
);

module.exports = Application;
