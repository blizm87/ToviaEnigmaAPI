const graphql = require('graphql');
const GraphQLInt = graphql.GraphQLInt;
const GraphQLString = graphql.GraphQLString;
const GraphQLList = graphql.GraphQLList;
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLNonNull = graphql.GraphQLNonNull;
const DB = require('./config.js');

const UserData = new graphql.GraphQLObjectType({
  name: 'UserData',
  description: 'This represents a user profile data.',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(userdata) {
          return userdata.id;
        }
      },
      displayname: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.displayname;
        }
      },
      imageurl: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.imageurl;
        }
      },
      gender: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.gender;
        }
      },
      googleid: {
        type: GraphQLString,
        resolve(userdata) {
          return userdata.googleid;
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
          return DB.profiles.userdata.findAll({where: args});
        }
      }
    };
  }
});

const Mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  description: 'Posts data to database',
  fields: () => {
    return {
      addProfileData: {
        type: UserData,
        args: {
          googleid: {
            type: new GraphQLNonNull(GraphQLString)
          },
          displayname: {
            type: new GraphQLNonNull(GraphQLString)
          },
          imageurl: {
            type: new GraphQLNonNull(GraphQLString)
          },
          gender: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args){
          return DB.profiles.userdata.create({
            googleid: args.googleid,
            displayname: args.displayname,
            imageurl: args.imageurl,
            gender: args.gender
          });
        }
      }
    };
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});


