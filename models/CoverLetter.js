const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const moment = require('moment');

class CoverLetter extends Model { }

CoverLetter.init(
    {
        cover_letter_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cover_file_path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cover_file_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cover_upload_date: {
            type: DataTypes.DATE,
                  allowNull: false,
                  defaultValue: Sequelize.NOW,  
            get() {
                return moment(this.getDataValue('cover_upload_date')).format('YYYY-MM-DD');
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
    modelName: 'CoverLetter',
    tableName: 'cover_letters',
    timestamps: false
});

module.exports = CoverLetter;
