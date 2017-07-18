const {
  graphql,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');

// const GraphQLInt = graphql.GraphQLInt;
// const GraphQLNonNull = graphql.GraphQLNonNull;
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
        resolve(root, args) {
          return DB.models.profiles.findAll({where: args});
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

module.exports = Schema;
