const {
  GraphQLID,
  GraphQLInterfaceType,
} = require("graphql");

export const Node = new GraphQLInterfaceType({
  name: "Node",
  description: "An object with an ID.",
  fields: () => ({
    id: { type: GraphQLID },
  }),
});

