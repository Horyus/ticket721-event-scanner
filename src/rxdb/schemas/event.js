export const eventSchema = {
    title: 'event_schema',
    description: 'Schema to store informations about scanned people',
    version: 0,
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        scanned: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    },
    required: ['name']
};
