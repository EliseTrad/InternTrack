const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db-sequelize');
const moment = require('moment');
const bcrypt = require('bcryptjs');

class User extends Model { }

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile_picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        account_created_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Set the current date
            get() {
                return moment(this.getDataValue('account_created_date')).format('YYYY-MM-DD');
            }
        }
    }, 
    { 
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
        hooks: {
            beforeCreate: async (user) => {
                user.user_password = await bcrypt.hash(user.user_password, 10);
            },
            beforeUpdate: async (user) => {
                if (user.changed('user_password')) {
                    user.user_password = await bcrypt.hash(user.user_password, 10);
                }
            }
        }
    } 
); 

module.exports = User;
