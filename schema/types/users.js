const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");
const fetchEB = require('../fetchEB');

const Email = new GraphQLObjectType({
  name: "Email",
  fields: {
    email: { type: GraphQLString },
    verified: { type: GraphQLBoolean },
    primary: { type: GraphQLBoolean },
  }
});

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    emails: { type: new GraphQLList(Email) },
    name: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    is_public: { type: GraphQLBoolean },
    image_id: { type: GraphQLString },
    orders: require('../queries/userOrders'),
    organizers: require('../queries/userOrganizers'),
    owned_events: require('../queries/userOwnedEvents'),
  })
});


module.exports = {
  query: {
    user: {
      type: User,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (rawSearch, args, context, ast) => {
        let id = args.id || "me";
        return fetchEB(`/users/${id}/`, args, context, ast);
      }
    }
  }
};
