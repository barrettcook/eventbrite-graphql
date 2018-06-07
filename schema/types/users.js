const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");
const fetchEB = require('../fetchEB');

const Node = new GraphQLInterfaceType({
  name: "Node",
  description: "An object with an ID.",
  resolveType: (value) => {
    if (value instanceof Order) {
      return Order;
    } else if (value instanceof User) {
      return User;
    } else {
      return null;
    }
  },
  fields: () => ({
    id: { type: GraphQLID },
  }),
});

const PageInfo = new GraphQLObjectType({
  name: "PageInfo",
  description: "Information about pagination in a connection.",
  fields: {
    endCursor: { type: GraphQLString },
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
    hasPreviousPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "When paginating backwards, are there more items?",
    },
    startCursor: { type: GraphQLString },
  }
});

const Order = new GraphQLObjectType({
  name: "Order",
  interfaces: [Node],
  isTypeOf: (value) => value instanceof Order,
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    event_id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
  })
});

const OrderEdge = new GraphQLObjectType({
  name: "OrderEdge",
  description: "An edge in a connection.",
  fields: {
    cursor: { type: GraphQLString },
    node: { type: Order },
  }
});

const OrderConnection = new GraphQLObjectType({
  name: "OrderConnection",
  description: "A list of orders owned by the subject",
  fields: {
    edges: { type: new GraphQLList(OrderEdge) },
    nodes: { type: new GraphQLList(Order) },
    pageInfo: { type: PageInfo },
    totalCount: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

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
  interfaces: [Node],
  isTypeOf: (value) => value instanceof User,
  fields: () => ({
    id: { type: GraphQLID },
    emails: { type: new GraphQLList(Email) },
    name: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    is_public: { type: GraphQLBoolean },
    image_id: { type: GraphQLString },
    orders: {
      type: new GraphQLList(OrderConnection),
      resolve: (rawUser, args, context, ast) => {
        let id = rawUser.id || "me";
        return fetchEB(`/users/${id}/orders/`, args, context, ast)
          .then(json => json.orders);
      }
    }, //require('../queries/userOrders'),
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
