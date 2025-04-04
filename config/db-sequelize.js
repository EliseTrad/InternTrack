const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mariadb",
        dialectOptions: {
            allowPublicKeyRetrieval: true, // Fixes the RSA public key error
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 3000,
            idle: 1000,
        },
        logging: console.log, 
    }
);


module.exports = sequelize;
