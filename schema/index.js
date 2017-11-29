const {
  GraphQLObjectType,
  GraphQLSchema,
} = require("graphql");
const fetchEB = require('./fetchEB');

const events = require('./models/events');
const orders = require('./models/orders');

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...events.query,
    ...orders.query,
  }
});

module.exports = new GraphQLSchema({
  query
});
