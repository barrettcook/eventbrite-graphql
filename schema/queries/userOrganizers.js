const {
  GraphQLList,
} = require("graphql");
const fetchEB = require('../fetchEB');

const Organizer = require('../types/events').Organizer;

module.exports = {
  type: new GraphQLList(Organizer),
  resolve: (rawUser, args, context, ast) => {
    let id = rawUser.id || "me";
    return fetchEB(`/users/${id}/organizers/`, args, context, ast)
      .then(json => json.organizers);
  }
};
