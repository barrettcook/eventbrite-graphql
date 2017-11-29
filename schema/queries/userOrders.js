const {
  GraphQLList,
} = require("graphql");
const fetchEB = require('../fetchEB');

const Order = require('../types/orders').Order;

module.exports = {
  type: new GraphQLList(Order),
  resolve: (rawUser, args, context, ast) => {
    let id = rawUser.id || "me";
    return fetchEB(`/users/${id}/orders/`, args, context, ast)
      .then(json => json.orders);
  }
};
