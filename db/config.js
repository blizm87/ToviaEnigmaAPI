const Sequelize = require('sequelize');

const Connection = new Sequelize(
  'toviadb',
  'Jblizm87',
  'Elephant87',
  {
    dialect: 'postgres',
    host: 'localhost'
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

const User = Connection.define('profile',
  {
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    displayName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

const Message = Connection.define('message',
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
      type: Sequelize.DATE,
      allowNull: false
    }
});
// console.log('I AM THE DATEONLY DATATYPE: ')
// console.log(Sequelize.DATEONLY)
// console.log(typeof Sequelize.DATEONLY)
User.hasMany(Message);
Message.belongsTo(User);

Connection.sync({force: true})
  .then(() => {
    return User.create({
      userId: '7487',
      displayName: 'JSAM',
      gender: 'male',
      imageUrl: 'BlackFACE'
    })
    .then( user => {
      return user.createMessage({
        toUser: 'user2',
        fromUser: 'user1',
        passPhrase: 'testPhrase',
        content: 'this is a test message',
        expireDate: new Date(Date.now())
      });
    });
  });

module.exports = Connection;
