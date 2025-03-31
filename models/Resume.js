const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const moment = require('moment');

class Resume extends Model { }

Resume.init(
    {
        resume_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        resume_file_path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resume_file_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resume_upload_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Set the current date
            get() {
                return moment(this.getDataValue('resume_upload_date')).format('YYYY-MM-DD');
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
    sequelize,
    modelName: 'Resume',
    tableName: 'resumes',
    timestamps: false
});

module.exports = Resume;
