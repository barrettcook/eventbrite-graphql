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
  resolve: (rawUser, args, context, ast) => {
    return fetchEB(`/users/${rawUser.id}/owned_events/`, args, context, ast)
      .then(json => json.events);
  }
};
