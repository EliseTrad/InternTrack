const { DataTypes, Model } = require('sequelize');
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
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Set the current date
            get() {
                return moment(this.getDataValue('cover_upload_date')).format('YYYY-MM-DD');
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
    sequelize,
    modelName: 'CoverLetter',
    tableName: 'cover_letters',
    timestamps: false
});

module.exports = CoverLetter;
