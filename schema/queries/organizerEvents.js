const {
  GraphQLInt,
  GraphQLList,
} = require("graphql");
const fetchEB = require('../fetchEB');

const Event = require('../types/events').Event;

module.exports = {
  type: new GraphQLList(Event),
  args: {
    page: { type: GraphQLInt }
  },
  resolve: (rawOrganizer, args, context, ast) => {
    return fetchEB(`/organizers/${rawOrganizer.id}/events/`, args, context, ast)
      .then(json => json.events);
  }
};
