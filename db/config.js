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

let messages = Connection.define('messages',
  {
    toUser: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fromUser: {
      type: Sequelize.STRING,
      allowNull: false
    },
    passPhrase: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    expireDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
})

userData.hasMany(messages);
messages.belongsTo(userData);

Connection.sync({force: true})
  .then(() => userData.create({
    userId: '7487',
    displayName: 'JSAM',
    gender: 'male',
    imageUrl: 'BlackFACE'
  }))
  .then(() => messages.create({
    toUser: 'user1',
    fromUser: 'user2',
    passPhrase: 'testPhrase',
    content: 'this is a test message',
    expireDate: new Date(Date.now())
  }))

module.exports = Connection;
