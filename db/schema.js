const {
  graphql,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema
} = require('graphql');

const DB = require('./config.js');

const ProfileData = new GraphQLObjectType({
  name: 'ProfileData',
  description: 'This represents a user profile data.',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(message) {
          return message.id;
        }
      },
      userId: {
        type: GraphQLString,
        resolve(user) {
          return user.userId;
        }
      },
      displayName: {
        type: GraphQLString,
        resolve(user) {
          return user.displayName;
        }
      },
      gender: {
        type: GraphQLString,
        resolve(user) {
          return user.gender;
        }
      },
      imageUrl: {
        type: GraphQLString,
        resolve(user) {
          return user.imageUrl;
        }
      },
      inbox: {
        type: new GraphQLList(Message),
        resolve(user) {
          return user.getInbox_messages();
        }
      },
      outbox: {
        type: new GraphQLList(Message),
        resolve(user) {
          return user.getOutbox_messages();
        }
      }
    };
  }
});

const Message = new GraphQLObjectType({
  name: 'Message',
  description: 'This represents a user profile data.',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(message) {
          return message.id;
        }
      },
      toUser: {
        type: GraphQLString,
        resolve(message) {
          return message.toUser;
        }
      },
      fromUser: {
        type: GraphQLString,
        resolve(message) {
          return message.fromUser;
        }
      },
      passPhrase: {
        type: GraphQLString,
        resolve(message) {
          return message.passPhrase;
        }
      },
      content: {
        type: GraphQLString,
        resolve(message) {
          return message.content;
        }
      },
      expireDate: {
        type: GraphQLString,
        resolve(message) {
          return message.expireDate;
        }
      },
      createdAt: {
        type: GraphQLString,
        resolve(message) {
          return message.createdAt;
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      getProfileData: {
        type: new GraphQLList(ProfileData),
        args: {
          userId: {
            type: GraphQLString
          },
          displayName: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return DB.models.profile.findAll({where: args});
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

module.exports = Schema;
