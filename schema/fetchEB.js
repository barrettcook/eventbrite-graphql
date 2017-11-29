const fetch = require("node-fetch");
const graphqlFields = require('graphql-fields');

const fetchEB = (path, args, context, ast) => {
  let query = graphqlFields(ast);

  let expansions = [];
  ['organizer', 'venue', 'event', 'attendees', 'category', 'subcategory', 'format'].forEach((expansion) => {
    if (query.hasOwnProperty(expansion)) {
      expansions.push(expansion);
    }
  });

  let page = args.page || "";
  let expand = expansions.join(',');
  let url = `https://www.eventbriteapi.com/v3${path}?token=${context.params.token}&page=${page}&expand=${expand}`;
  console.log(url);
  return fetch(url)
    .then(resp => resp.json())
};

module.exports = fetchEB;
