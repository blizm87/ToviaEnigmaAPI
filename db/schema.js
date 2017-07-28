const {
  graphql,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLSchema
} = require('graphql');
const GraphQLDate = require('graphql-iso-date');

const DB = require('./config.js');

const ProfileData = new GraphQLObjectType({
  name: 'ProfileData',
  description: 'This represents a user profile data.',
  fields: () => {
    return {
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
      messages: {
        type: new GraphQLList(Message),
        resolve(user) {
          return user.getMessages();
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
        // type: GraphQLDate,
        type: GraphQLString,
        resolve(message) {
          return message.expireDate;
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
        resolve(root, args) {
          return DB.models.profile.findAll({where: args});
        }
      },
      getMessages: {
        type: new GraphQLList(Message),
        resolve(root, args) {
          return DB.models.message.findAll({where: args});
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Posts data to database',
  fields() {
    return {
      addProfileData: {
        type: ProfileData,
        args: {
          userId: {
            type: new GraphQLNonNull(GraphQLString)
          },
          displayName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          gender: {
            type: new GraphQLNonNull(GraphQLString)
          },
          imageUrl: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args){
          return DB.models.profile.create({
            userId: args.userId,
            displayName: args.displayName,
            gender: args.gender,
            imageUrl: args.imageUrl
          });
        }
      },
      createMessage: {
        type: Message,
        args: {
          toUser: {
            type: new GraphQLNonNull(GraphQLString)
          },
          fromUser: {
            type: new GraphQLNonNull(GraphQLString)
          },
          passPhrase: {
            type: new GraphQLNonNull(GraphQLString)
          },
          content: {
            type: new GraphQLNonNull(GraphQLString)
          },
          expireDate: {
            type: new GraphQLNonNull(GraphQLString)
            // type: GraphQLDate
          }
        },
        resolve(_, args){
          return DB.models.message.create({
            toUser: args.toUser,
            fromUser: args.fromUser,
            passPhrase: args.passPhrase,
            content: args.content,
            expireDate: args.expireDate
          });
        }
      }
    };
  }
});

console.log(GraphQLDate)

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = Schema;
