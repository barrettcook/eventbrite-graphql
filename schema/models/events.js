const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");
const fetchEB = require('../fetchEB');

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

module.exports = {
  Event,
  query: {
    event: {
      type: Event,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (rawSearch, args, context, ast) => {
        return fetchEB(`/events/${args.id}/`, args, context, ast)
      }
    },

    events: {
      type: new GraphQLList(Event),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (rawSearch, args, context, ast) => {
        return fetchEB('/events/search/', args, context, ast)
          .then(json => json.events);
      }
    }
  }
};
