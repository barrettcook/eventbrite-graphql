const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
  } = require("graphql");

  const fetchEB = require('../fetchEB');
  
const Artist = new GraphQLObjectType({
    name: "Artist",
    fields: {
        name: { type: GraphQLString }
    }
});

const Performance = new GraphQLObjectType({
    name: "Performance",
    fields: {
        display_name: { type: GraphQLString }
    }
});


module.exports = {
type: new GraphQLList(Performance),
args: {
    page: { type: GraphQLInt }
},
resolve: (event, args, context, ast) => {
    return fetchEB(`/events/${event.id}/performances/`, args, context, ast)
    .then(json => json.performances);
}
};
