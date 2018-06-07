const queryString = require('querystring');

const {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} = require('graphql');
const fetchEB = require('../fetchEB');

const TextAndHtml = new GraphQLObjectType({
    name: 'TextAndHtml',
    fields: {
        text: {type: GraphQLString},
        html: {type: GraphQLString},
    },
});

const DateTime = new GraphQLObjectType({
    name: 'DateTime',
    fields: {
        timezone: {type: GraphQLString},
        local: {type: GraphQLString},
        utc: {type: GraphQLString},
    },
});

const Logo = new GraphQLObjectType({
    name: 'Logo',
    fields: {
        id: {type: GraphQLID},
        url: {type: GraphQLString},
        crop_mask: {type: GraphQLString},
        original: {type: new GraphQLObjectType({
          name: 'Original',
          fields: {
            url: {type: GraphQLString},
            width: {type: GraphQLInt},
            height: {type: GraphQLInt},
        },
      })},
        aspect_ratio: {type: GraphQLFloat},
        edge_color: {type: GraphQLString},
        edge_color_set: {type: GraphQLBoolean},
    },
});

const Organizer = new GraphQLObjectType({
    name: 'Organizer',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: TextAndHtml},
        long_description: {type: TextAndHtml},
        resource_uri: {type: GraphQLString},
        website: {type: GraphQLString},
        url: {type: GraphQLString},
        vanity_url: {type: GraphQLString},
        twitter: {type: GraphQLString},
        facebook: {type: GraphQLString},
        instagram: {type: GraphQLString},
        num_past_events: {type: GraphQLInt},
        num_future_events: {type: GraphQLInt},
        logo: {type: Logo},
        events: require('../queries/organizerEvents'),
    }),
});

const Venue = new GraphQLObjectType({
    name: 'Venue',
    fields: {
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        address: {type: new GraphQLObjectType({
          name: 'Address',
          fields: {
            address_1: {type: GraphQLString},
            address_2: {type: GraphQLString},
            city: {type: GraphQLString},
            region: {type: GraphQLString},
            postal_code: {type: GraphQLString},
            country: {type: GraphQLString},
            latitude: {type: GraphQLFloat},
            longitude: {type: GraphQLFloat},
            localized_address_display: {type: GraphQLString},
            localized_area_display: {type: GraphQLString},
            localized_multi_line_address_display: {type: new GraphQLList(GraphQLString)},
        },
      })},
        latitude: {type: GraphQLFloat},
        longitude: {type: GraphQLFloat},
        resource_uri: {type: GraphQLString},
    },
});

const Category = new GraphQLObjectType({
    name: 'Category',
    fields: {
        id: {type: GraphQLID},
        resource_uri: {type: GraphQLString},
        name: {type: GraphQLString},
        name_localized: {type: GraphQLString},
        short_name: {type: GraphQLString},
        short_name_localized: {type: GraphQLString},
    },
});

const CategoryFilter = new GraphQLInputObjectType({
    name: 'CategoryFilter',
    fields: {
        id: {type: GraphQLString},
    },
});

const Cost = new GraphQLObjectType({
    name: 'Cost',
    fields: {
        currency: {type: GraphQLString},
        value: {type: GraphQLString},
        display: {type: GraphQLString},
    },
});

const TicketClass = new GraphQLObjectType({
    name: 'TicketClass',
    fields: {
        name: {type: GraphQLString},
        cost: {type: Cost},
        description: {type: GraphQLString},
    },
});

const Location = new GraphQLInputObjectType({
    name: 'Location',
    fields: {
        address: {type: GraphQLString},
    },
});

const EventFilters = new GraphQLInputObjectType({
    name: 'EventFilters',
    fields: {
        location: {type: Location},
        start: {type: GraphQLString},
        end: {type: GraphQLString},
        categories: {type: CategoryFilter},
    },
});

const Event = new GraphQLObjectType({
    name: 'Event',
    fields: {
        id: {type: GraphQLID},
        name: {type: TextAndHtml},
        description: {type: TextAndHtml},
        start: {type: DateTime},
        end: {type: DateTime},
        url: {type: GraphQLString},
        capacity: {type: GraphQLInt},
        status: {type: GraphQLString},
        currency: {type: GraphQLString},
        created: {type: GraphQLString},
        changed: {type: GraphQLString},
        capacity_is_custom: {type: GraphQLBoolean},
        listed: {type: GraphQLBoolean},
        shareable: {type: GraphQLBoolean},
        online_event: {type: GraphQLBoolean},
        tx_time_limit: {type: GraphQLInt},
        hide_start_date: {type: GraphQLBoolean},
        hide_end_date: {type: GraphQLBoolean},
        locale: {type: GraphQLString},
        is_locked: {type: GraphQLBoolean},
        privacy_setting: {type: GraphQLString},
        is_series: {type: GraphQLBoolean},
        is_series_parent: {type: GraphQLBoolean},
        is_reserved_seating: {type: GraphQLBoolean},
        source: {type: GraphQLString},
        is_free: {type: GraphQLBoolean},
        version: {type: GraphQLString},
        resource_uri: {type: GraphQLString},
        category: {type: Category},
        subcategory: {type: Category},
        format: {type: Category},
        logo: {type: Logo},
        organizer: {type: Organizer},
        venue: {type: Venue},
        ticket_classes: { 
          type: new GraphQLList(TicketClass),  
      },
    },
});

module.exports = {
    Event,
    Organizer,
    query: {
        event: {
          type: Event,
          args: {
            id: {type: GraphQLID},
        },
          resolve: (rawSearch, args, context, ast) => fetchEB(`/events/${args.id}/`, args, context, ast),
      },

        events: {
            type: new GraphQLList(Event),
            args: {
                page: {type: GraphQLInt},
                filters: {type: EventFilters},
            },
            resolve: (rawSearch, args, context, ast) => {
                args.filters['location.address'] = args.filters.location.address;
                args.filters['categories'] = args.filters.categories.id;
                delete args.filters.location;
                args.filters = queryString.stringify(args.filters);

                return fetchEB('/events/search/', args, context, ast)
                .then((json) => json.events);
            },
      },

        organizer: {
          type: Organizer,
          args: {
            id: {type: new GraphQLNonNull(GraphQLID)},
        },
          resolve: (rawSearch, args, context, ast) => fetchEB(`/organizers/${args.id}/`, args, context, ast),
      },
    },
};
