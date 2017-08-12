const Sequelize = require('sequelize');

let Connection;

if(process.env.NODE_ENV === 'production'){
  Connection = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres'});
} else {
    Connection = new Sequelize(
      'toviadb',
      'Jblizm87',
      'Elephant87',
      {
        dialect: 'postgres',
        host: 'localhost'
      }
    );
}


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

const InMessage = Connection.define('inbox_message',
  {
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

const OutMessage = Connection.define('outbox_message',
  {
    toUser: {
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

User.hasMany(OutMessage);
User.hasMany(InMessage);
OutMessage.belongsTo(User);
InMessage.belongsTo(User);

Connection.sync({force: true})
  .then(() => {
    return User.create({
      userId: '7487',
      displayName: 'JSAM',
      gender: 'male',
      imageUrl: 'BlackFACE'
    })
    .then( user => {
      user.createOutbox_message({
        toUser: 'user2',
        passPhrase: 'testPhrase',
        content: 'this is a sent message',
        expireDate: new Date(Date.now())
      });
      user.createInbox_message({
        fromUser: 'user2',
        passPhrase: 'testPhrase',
        content: 'this is a received message',
        expireDate: new Date(Date.now())
      });
    });
  });

module.exports = Connection;
