const Sequelize = require('Sequelize')

const connection = new Sequelize('guiaperguntas', 'root', '21052014', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;