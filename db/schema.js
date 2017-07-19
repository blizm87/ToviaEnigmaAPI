const {
  graphql,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');

const DB = require('./config.js');

const ProfileData = new GraphQLObjectType({
  name: 'ProfileData',
  description: 'This represents a user profile data.',
  fields: () => {
    return {
      userId: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.userId;
        }
      },
      displayName: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.displayName;
        }
      },
      gender: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.gender;
        }
      },
      imageUrl: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.imageUrl;
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
        resolve(root) {
          return DB.models.profiles.findAll();
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Posts data to database',
  fields: () => {
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
          return DB.models.profiles.ProfileData.create({
            userId: args.userId,
            displayName: args.displayName,
            gender: args.gender,
            imageUrl: args.imageUrl
          });
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = Schema;
