const fetch = require("node-fetch");

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

const Event = new GraphQLObjectType({
  name: "Event",
  fields: {
    id: { type: GraphQLString },
    name: { type: TextAndHtml },
    description: { type: TextAndHtml },
    start: { type: DateTime },
    end: { type: DateTime },
    url: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    status: { type: GraphQLString },
    currency: { type: GraphQLString },
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
      resolve: (rawSearch, args, context) => {
        return fetch(`https://www.eventbrite.com/api/v3/events/search/?token=${context.token}&page=${args.page}`)
          .then(resp => resp.json())
          .then(json => json.events);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Search
});
