const Sequelize = require('sequelize');

const Connection = new Sequelize(
  'toviadb',
  'Jblizm87',
  'Elephant87',
  {
    dialect: 'postgres',
    host: 'localhost',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  }
);

Connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

let userData = Connection.define('profiles',
  {
    userId: Sequelize.STRING,
    displayName: Sequelize.STRING,
    gender: Sequelize.STRING,
    imageUrl: Sequelize.STRING
  });

Connection.sync({force: true})
  .then(() => userData.create({
    userId: '7487',
    displayName: 'JSAM',
    gender: 'male',
    imageUrl: 'BlackFACE'
  }))

module.exports = Connection;
