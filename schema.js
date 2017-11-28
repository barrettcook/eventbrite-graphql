const fetch = require("node-fetch");
const graphqlFields = require('graphql-fields');

const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require("graphql");

const fetchEB = (path, args, context, ast) => {
  let query = graphqlFields(ast);

  let expansions = [];
  ['organizer', 'venue', 'event'].forEach((expansion) => {
    if (query.hasOwnProperty(expansion)) {
      expansions.push(expansion);
    }
  });

  let page = args.page || "";
  let expand = expansions.join(',');
  let url = `https://www.eventbriteapi.com/v3${path}?token=${context.token}&page=${page}&expand=${expand}`;
  console.log(url);
  return fetch(url)
    .then(resp => resp.json())
};

const TextAndHtml = new GraphQLObjectType({
  name: "TextAndHtml",
  fields: {
    text: { type: GraphQLString },
    html: { type: GraphQLString },
  }
});

const DateTime = new GraphQLObjectType({
  name: "DateTime",
  fields: {
    timezone: { type: GraphQLString },
    local: { type: GraphQLString },
    utc: { type: GraphQLString }
  }
});

const Organizer = new GraphQLObjectType({
  name: "Organizer",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: TextAndHtml },
    long_description: { type: TextAndHtml },
    website: { type: GraphQLString },
    twitter: { type: GraphQLString },
    facebook: { type: GraphQLString },
    instagram: { type: GraphQLString },
    num_past_events: { type: GraphQLInt },
    num_future_events: { type: GraphQLInt },
  }
});

const Venue = new GraphQLObjectType({
  name: "Venue",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }
});

const Event = new GraphQLObjectType({
  name: "Event",
  fields: {
    id: { type: GraphQLID },
    name: { type: TextAndHtml },
    description: { type: TextAndHtml },
    start: { type: DateTime },
    end: { type: DateTime },
    url: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    status: { type: GraphQLString },
    currency: { type: GraphQLString },
    organizer: { type: Organizer },
    venue: { type: Venue },
  }
});

const Order = new GraphQLObjectType({
  name: "Order",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    status: { type: GraphQLString },
    event: { type: Event },
  }
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    events: {
      type: new GraphQLList(Event),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (rawSearch, args, context, ast) => {
        return fetchEB('/events/search/', args, context, ast)
          .then(json => json.events);
      }
    },
    orders: {
      type: new GraphQLList(Order),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (rawSearch, args, context, ast) => {
        return fetchEB('/users/me/orders/', args, context, ast)
          .then(json => json.orders);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query
});
