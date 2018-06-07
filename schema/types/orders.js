const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require("graphql");
const fetchEB = require('../fetchEB');

const Event = require('./events').Event;

const Price = new GraphQLObjectType({
  name: "Price",
  fields: {
    display: { type: GraphQLString },
    currency: { type: GraphQLString },
    value: { type: GraphQLInt },
    major_value: { type: GraphQLString },
  }
});

const Attendee = new GraphQLObjectType({
  name: "Attendee",
  fields: {
    id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    checked_in: { type: GraphQLBoolean },
    event: { type: Event },
    ticket_class_name: { type: GraphQLString },
    team: { type: GraphQLString },
  }
});

const Order = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    event_id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    status: { type: GraphQLString },
    event: { type: Event },
    attendees: { type: new GraphQLList(Attendee) },
    costs: { type: new GraphQLObjectType({
      name: "Costs",
      fields: {
        base_price: { type: Price },
        eventbrite_fee: { type: Price },
        gross: { type: Price },
        payment_fee: { type: Price },
        tax: { type: Price },
      }
    })}
  })
});

module.exports = {
  Order,
  query: {
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
};
