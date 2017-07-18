const graphql = require('graphql');
const GraphQLInt = graphql.GraphQLInt;
const GraphQLString = graphql.GraphQLString;
const GraphQLList = graphql.GraphQLList;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLSchema = graphql.GraphQLSchema;
// const GraphQLNonNull = graphql.GraphQLNonNull;
const DB = require('./config.js');

const ProfileData = new graphql.GraphQLObjectType({
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

const Query = new graphql.GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      getProfileData: {
        type: new GraphQLList(UserData),
        resolve(root, args) {
          return DB.models.mytest.findAll({where: args});
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({
  query: Query
});
