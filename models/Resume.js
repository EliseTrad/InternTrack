const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const moment = require('moment');

class Resume extends Model { }

Resume.init(
    {
        resume_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            get() {
                return moment(this.getDataValue('resume_upload_date')).format('YYYY-MM-DD');
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        }
    }, {
    sequelize,
    modelName: 'Resume',
    tableName: 'resumes',
    timestamps: false
});

module.exports = Resume;
