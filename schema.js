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

const Search = new GraphQLObjectType({
  name: "Search",
  fields: {
    events: {
      type: new GraphQLList(Event),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (rawSearch, args, context, ast) => {
        let query = graphqlFields(ast);

        let expansions = [];
        ['organizer', 'venue'].forEach((expansion) => {
          if (query.hasOwnProperty(expansion)) {
            expansions.push(expansion);
          }
        });

        let expand = expansions.join(',');
        let url = `https://www.eventbrite.com/api/v3/events/search/?token=${context.token}&page=${args.page}&expand=${expand}`;
        console.log(url);
        return fetch(url)
          .then(resp => resp.json())
          .then(json => json.events);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Search
});
