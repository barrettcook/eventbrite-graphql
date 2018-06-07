const {
  GraphQLObjectType,
  GraphQLSchema,
} = require("graphql");
const fetchEB = require('./fetchEB');

const events = require('./types/events');
//const orders = require('./types/orders');
const users = require('./types/users');

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...events.query,
    //...orders.query,
    ...users.query,
  }
});

module.exports = new GraphQLSchema({
  query
});
